const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors());
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
    const user = await usersCollection.findOne({ _id: id });
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

// Register a new user
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

// Login (authenticate)
app.post('/api/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Logged in successfully', user: req.user });
});

// Logout
app.get('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send('Error logging out');
    res.json({ message: 'Logged out successfully' });
  });
});

// Protected route example (requires authentication)
app.get('/api/protected', isAuthenticated, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
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