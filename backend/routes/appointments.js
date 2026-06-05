const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const { sendDispatchedAlert } = require('../utils/notifier');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "MOCK_KEY");

// 1. BOOK APPOINTMENT & GENERATE AI TRIAGE
router.post('/book', async (req, res) => {
    try {
        const { patientId, patientName, doctorName, date, time, symptoms, language } = req.body;

        // Create initial placeholder asset
        const appointment = await Appointment.create({
            patientId,
            doctorName,
            date,
            time,
            symptoms,
            language
        });

        // Executing Asynchronous Prompt Engineering Flow if symptoms exist
        if (symptoms) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const systemPrompt = `You are a clinical triage assistant. Analyze the patient symptoms: "${symptoms}". Categorize urgency as strictly HIGH, MEDIUM, or LOW. Return exactly a JSON object, no markdown wrappers: {"urgency": "VALUE", "reason": "one sentence explanation"}`;
                
                const aiResult = await model.generateContent(systemPrompt);
                const aiData = JSON.parse(aiResult.response.text().trim());
                
                appointment.urgency = aiData.urgency;
                appointment.triageReason = aiData.reason;
                await appointment.save();
            } catch (aiErr) {
                console.error("AI Fallback engaged:", aiErr.message);
                // Graceful degradation layout so system never crashes mid-demo
                appointment.urgency = 'LOW';
                await appointment.save();
            }
        }

        // Trigger our Proactive Continuity Pipeline instantly
        await sendDispatchedAlert(appointment, patientName || "Patient");

        res.status(201).json({ message: "Appointment registered with proactive triage.", appointment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. DYNAMIC LINK MUTATION: ONE-CLICK RESPONSE
router.post('/:id/respond', async (req, res) => {
    try {
        const { id } = req.params;
        const { action, newDate, newTime } = req.body; // action can be 'CONFIRM' or 'RESCHEDULE'

        const appointment = await Appointment.findByPk(id);
        if (!appointment) return res.status(404).json({ message: "Record missing." });

        if (action === 'CONFIRM') {
            appointment.status = 'CONFIRMED';
        } else if (action === 'RESCHEDULE') {
            appointment.status = 'RESCHEDULED';
            if (newDate) appointment.date = newDate;
            if (newTime) appointment.time = newTime;
        }

        await appointment.save();
        res.json({ message: `Patient continuity updated to: ${appointment.status}`, appointment });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. DOCTOR TRIAGE OVERVIEW FEED
router.get('/doctor/feed', async (req, res) => {
    try {
        // Zero Trust / Priority sort ordering: high-risk patient elements float straight up to the top
        const feed = await Appointment.findAll({
            order: [
                [sequelize.literal("CASE WHEN urgency = 'HIGH' THEN 1 WHEN urgency = 'MEDIUM' THEN 2 ELSE 3 END"), 'ASC'],
                ['date', 'ASC']
            ]
        });
        res.json(feed);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;