const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

// Middleware
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

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

// Root route
app.get('/', (req, res) => {
  res.send('Hello from the Art Store backend!');
});

// API endpoint to fetch artworks from MongoDB
app.get('/api/artworks', async (req, res) => {
  try {
    const database = client.db('artstore');
    const collection = database.collection('artworks');
    const artworks = await collection.find({}).toArray();
    res.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
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