const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Routes
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const historyRoutes = require('./routes/history');
const User = require('./models/User');

dotenv.config();

const app = express();

const seedDefaultAdmin = async () => {
    try {
        const defaultUsers = [
            {
                name: 'Doctor X',
                email: 'xxd06268@gmail.com',
                password: 'password123',
                role: 'doctor'
            },
            {
                name: 'Doctor Stranger',
                email: 'strangerdangerdj@gmail.com',
                password: 'password123',
                role: 'doctor'
            },
            {
                name: 'Cielo Poot',
                email: 'cielo.poot@modelo.edu.mx',
                password: 'cielopoot123',
                role: 'doctor'
            }
        ];

        for (const userData of defaultUsers) {
            const userExists = await User.findOne({ email: userData.email });
            if (!userExists) {
                console.log(`Creando usuario administrativo: ${userData.email}`);
                await User.create(userData);
            }
        }
    } catch (err) {
        console.error('Error al sembrar usuarios:', err);
    }
};

// Middleware
app.use(cors());
app.use(express.json());

// Routes implementation
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/history', historyRoutes);

// SERVE FRONTEND (Production)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')));
    
    app.get('*any', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
    });
}

// DB Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/farmanet';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('MongoDB conectado');
        await seedDefaultAdmin();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error de conexión a MongoDB:', err.message);
    });
