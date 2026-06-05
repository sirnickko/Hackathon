const express = require('express');
const router = express.Router();
const User = require('../models/User');

// SIGN UP ROUTE
router.post('/signup', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ where: { username } });
        if (userExists) return res.status(400).json({ message: "User already exists" });

        // Create new user (Password hashing happens automatically in our Model hook!)
        const newUser = await User.create({ username, password, role });

        res.status(201).json({ message: "User registered successfully!", user: newUser.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;