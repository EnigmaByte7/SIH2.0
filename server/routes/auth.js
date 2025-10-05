import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// --- ROUTE 1: REGISTER ---
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Basic check for existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists." });
        }

        const newUser = new User({ username, password });
        await newUser.save();
        
        res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: "Registration failed due to server error." });
    }
});

// --- ROUTE 2: LOGIN ---
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Prototype check: Compares plaintext passwords
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        // Success
        res.status(200).json({ 
            success: true, 
            message: "Login successful.", 
            userId: user._id 
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: "Server error during login." });
    }
});

export default router;