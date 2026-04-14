const mongoose = require('mongoose');

const medicalHistorySchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    notes: { type: String, required: true },
    condition: { type: String },
    prescriptions: [{
        medication: String,
        quantity: String,
        frequency: String,
        duration: String,
        date: { type: Date, default: Date.now }
    }],
    date: { type: Date, default: Date.now },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('MedicalHistory', medicalHistorySchema);
