const express = require('express');
const router = express.Router();
const MedicalHistory = require('../models/MedicalHistory');
const auth = require('../middleware/auth');

// Get history for a patient
router.get('/:patientId', auth, async (req, res) => {
    try {
        const history = await MedicalHistory.find({ patient: req.params.patientId })
            .sort({ date: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el historial' });
    }
});

// Add new note to history
router.post('/', auth, async (req, res) => {
    try {
        const { patientId, notes } = req.body;
        const entry = new MedicalHistory({
            patient: patientId,
            notes,
            doctor: req.user.id
        });
        await entry.save();
        res.status(201).json(entry);
    } catch (error) {
        res.status(400).json({ message: 'Error al agregar nota' });
    }
});

module.exports = router;
