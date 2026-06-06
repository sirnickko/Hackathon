const { Sequelize } = require('sequelize');
require('dotenv').config();

// Ensure all parameters are safely evaluated
const sequelize = new Sequelize(
  process.env.DB_NAME || 'defaultdb',
  process.env.DB_USER || 'avnadmin',
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 15851,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // CRITICAL: This allows your hotspot to bypass local certificate validation
      },
      connectTimeout: 60000 // Gives your mobile hotspot a 60-second window to finish handshaking
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000
    }
  }
);

// Test the connection live in the console log layout
sequelize.authenticate()
  .then(() => console.log('MySQL Connected Live to Aiven Cloud... 🎉'))
  .catch(err => console.error('Database connection error:', err.message));

module.exports = sequelize;