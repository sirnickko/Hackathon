const express = require('express');
const path = require('path');
const cors = require('cors');

// FORCE NODE TO READ THE EXACT PATH OF YOUR ENV FILE
require('dotenv').config({ path: path.join(__dirname, '.env') });

const sequelize = require('./config/db'); // or wherever your db configuration file sits


const app = express();

app.use(cors());
app.use(express.json());

// Add this line with your other routing imports
const appointmentRoutes = require('./routes/appointments');
const authRoutes = require('./routes/auth');

// Mount the engine paths
app.use('/api/appointments', appointmentRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

// Try to sync database, but start server anyway
sequelize.sync({ force: false }) 
    .then(() => {
        console.log('MySQL Connected... ');
    })
    .catch(err => console.error('Database connection error (server will still start):', err.message));

app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));