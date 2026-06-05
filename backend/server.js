const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

// We want to make sure your server initialization still looks clean like this:
sequelize.sync({ force: false }) 
    .then(() => {
        console.log('MySQL Connected... ');
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));
    })
    .catch(err => console.error('Database connection error:', err));

// Add this line with your other routing imports
const appointmentRoutes = require('./routes/appointments');

// Mount the engine paths
app.use('/api/appointments', appointmentRoutes);