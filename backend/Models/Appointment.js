const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Appointment = sequelize.define('Appointment', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    patientId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    doctorName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time: {
        type: DataTypes.STRING,
        allowNull: false
    },
    symptoms: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    urgency: {
        type: DataTypes.ENUM('PENDING', 'LOW', 'MEDIUM', 'HIGH'),
        defaultValue: 'PENDING'
    },
    triageReason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('PENDING_CONFIRMATION', 'CONFIRMED', 'RESCHEDULED', 'NO_SHOW'),
        defaultValue: 'PENDING_CONFIRMATION'
    },
    language: {
        type: DataTypes.ENUM('EN', 'SW'),
        defaultValue: 'EN'
    }
});

module.exports = Appointment;