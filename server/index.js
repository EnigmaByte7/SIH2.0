import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios'; // <-- 1. ADDED: To make HTTP requests to Flask

// Keep your existing route for other purposes
import testRoute from './routes/test.js';

const app = express();
configDotenv();

app.use(cors());
app.use(express.json());

// You can keep your existing '/api' route
app.use('/api', testRoute);

// --- 2. CORRECTED: MongoDB Connection ---
// The original code connected and then immediately disconnected.
// This new code connects once when the server starts and stays connected.
const uri = process.env.MONGO_URI;
mongoose.connect(uri)
  .then(() => {
    console.log("✅ Successfully connected to MongoDB!");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit the process if DB connection fails
  });


// --- 3. NEW: AI Analysis Endpoint ---
// This is the new endpoint that your React app will call.
// It acts as a bridge to your Python Flask AI service.
app.post('/api/analyze', async (req, res) => {
    console.log('Received request, forwarding to Python AI service...');

    try {
        // The URL of your running Flask server
        const flaskApiUrl = 'http://127.0.0.1:5001/predict';

        // Make a POST request to the Flask API
        const response = await axios.post(flaskApiUrl);

        // Log and send the prediction from Flask back to the React client
        console.log('Received response from Flask:', response.data);
        res.status(200).json(response.data);

    } catch (error) {
        console.error('Error calling Python service:', error.message);
        res.status(500).json({ status: "ERROR", message: "Could not connect to the AI service." });
    }
});


const PORT = process.env.PORT || 5000; // Changed default to 5000 to avoid conflicts with React

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});