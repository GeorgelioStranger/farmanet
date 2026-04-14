const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    height: { type: String, required: true },
    weight: { type: String, required: true },
    symptoms: { type: String, required: true },
    history: { type: String }, // Medical history summary
    medications: { type: String },
    prescriptions: [{
        medication: String,
        quantity: String,
        frequency: String,
        duration: String,
        date: { type: Date, default: Date.now }
    }],
    area: { type: String, required: true }, 
    status: { 
        type: String, 
        enum: ['stable', 'observation', 'critical'], 
        default: 'stable' 
    },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isArchived: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
