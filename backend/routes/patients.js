const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const MedicalHistory = require('../models/MedicalHistory');
const auth = require('../middleware/auth');

// Get all non-archived patients
router.get('/', auth, async (req, res) => {
    try {
        const patients = await Patient.find({ isArchived: false });
        res.json(patients);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener pacientes' });
    }
});

// Create patient
router.post('/', auth, async (req, res) => {
    try {
        const patient = new Patient({
            ...req.body,
            doctor: req.user.id
        });
        await patient.save();

        // Create initial history entry
        const initialHistory = new MedicalHistory({
            patient: patient._id,
            notes: `Registro inicial - Sintomatología: ${patient.symptoms}`,
            condition: 'Ingreso inicial',
            prescriptions: req.body.prescriptions || [],
            doctor: req.user.id
        });
        await initialHistory.save();

        res.status(201).json(patient);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear paciente', error: error.message });
    }
});

// Get single patient
router.get('/:id', auth, async (req, res) => {
    try {
        const patient = await Patient.findOne({ _id: req.params.id });
        if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' });
        res.json(patient);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener paciente' });
    }
});

// Update patient (including status/archiving)
router.put('/:id', auth, async (req, res) => {
    try {
        const patient = await Patient.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true }
        );
        if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' });
        res.json(patient);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar paciente' });
    }
});

// ARCHIVE patient (Logical delete)
router.delete('/:id', auth, async (req, res) => {
    try {
        const patient = await Patient.findOneAndUpdate(
            { _id: req.params.id },
            { isArchived: true },
            { new: true }
        );
        if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' });
        res.json({ message: 'Paciente archivado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al archivar paciente' });
    }
});

module.exports = router;
