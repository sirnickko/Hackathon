const express = require('express');
const router = express.Router();
const User = require('../models/User');

// SIGN UP ROUTE
router.post('/login', async (req, res) => {
    try {

        // EMERGENCY PRESENTATION BYPASS
if ((req.body.email === 'demo@afyaconnect.com' || req.body.username === 'demo@afyaconnect.com') && req.body.password === 'demo123') {
    return res.status(200).json({
        token: "mock-jwt-token-for-presentation",
        username: "Ian Kimani",
        role: req.body.role || "DOCTOR" // Dynamically forwards you based on your toggle choice!
    });
}
        // Accept email from the frontend payload and map it to your username lookup variable
        const { email, username, password, role } = req.body;
        const identifier = username || email; 

        if (!identifier || !password) {
            return res.status(400).json({ message: "Missing required identification parameters." });
        }

        // Run your existing database finder using the mapped identifier
        const user = await User.findOne({ where: { username: identifier } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the provided password matches the stored hash
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ message: "Login successful!", user: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;