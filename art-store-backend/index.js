require('dotenv').config(); // Load environment variables
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Initialize Stripe

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(passport.initialize());

// MongoDB connection string from .env
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Function to connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

// Get database and collections
const db = client.db('artstore');
const artworksCollection = db.collection('artworks');
const usersCollection = db.collection('users');
const cartsCollection = db.collection('carts');
const wishlistsCollection = db.collection('wishlists');

// Passport configuration
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await usersCollection.findOne({ username });
      if (!user) return done(null, false, { message: 'Incorrect username' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return done(null, false, { message: 'Incorrect password' });

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: 'Unauthorized' });
};

// Root route
app.get('/', (req, res) => {
  res.send('Hello from the Art Store backend!');
});

// API endpoint to fetch artworks from MongoDB
app.get('/api/artworks', async (req, res) => {
  try {
    const artworks = await artworksCollection.find({}).toArray();
    res.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    res.status(500).send('Something went wrong');
  }
});

// Register user
app.post('/api/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await usersCollection.findOne({ username });
    if (existingUser) return res.status(400).json({ message: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { username, password: hashedPassword };
    await usersCollection.insertOne(newUser);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Something went wrong');
  }
});

// User login
app.post('/api/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Logged in successfully', user: req.user });
});

// User logout
app.get('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Error logging out');
    res.json({ message: 'Logged out successfully' });
  });
});

// Cart APIs
app.post('/api/cart/add', isAuthenticated, async (req, res) => {
  try {
    const { artworkId } = req.body;
    const userId = req.user._id;
    const cartItem = await cartsCollection.findOne({ userId, artworkId });
    if (cartItem) return res.status(400).json({ message: 'Artwork already in cart' });

    await cartsCollection.insertOne({ userId, artworkId, quantity: 1 });
    res.json({ message: 'Artwork added to cart' });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).send('Something went wrong');
  }
});

app.get('/api/cart', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;
    const cartItems = await cartsCollection.aggregate([
      { $match: { userId: new ObjectId(userId) } },
      {
        $lookup: {
          from: 'artworks',
          localField: 'artworkId',
          foreignField: 'id',
          as: 'artwork'
        }
      },
      { $unwind: '$artwork' }
    ]).toArray();
    res.json(cartItems);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).send('Something went wrong');
  }
});

// Payment with Stripe (test mode)
app.post('/api/checkout', isAuthenticated, async (req, res) => {
  try {
    const { cartItems } = req.body; // Array of { artworkId, quantity }
    const lineItems = cartItems.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.artwork.title,
        },
        unit_amount: item.artwork.price * 100, // Convert to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: 'https://art-store-frontend.onrender.com/success',
      cancel_url: 'https://art-store-frontend.onrender.com/cancel',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).send('Something went wrong');
  }
});

// Start the server and connect to MongoDB
const server = app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  await connectToDatabase();
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down server...');
  try {
    await client.close();
    console.log('MongoDB connection closed');
    server.close(() => {
      console.log('Server stopped');
      process.exit(0);
    });
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});