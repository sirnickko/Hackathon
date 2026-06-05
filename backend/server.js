const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const User = require('./models/User'); // Import the model we created

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows us to receive JSON data from the frontend

// Test Database Connection and Sync
sequelize.sync({ force: false }) // 'force: false' prevents deleting data on every restart
    .then(() => {
        console.log('MySQL Connected & Tables Synced');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT} `));
    })
    .catch(err => console.error('Unable to connect to database:', err));