const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const doctors = [
    {
        name: 'Doctor X',
        email: 'xxd06268@gmail.com',
        password: 'password123', // Será hasheado por el pre-save hook
        role: 'doctor'
    },
    {
        name: 'Doctor Stranger',
        email: 'strangerdangerdj@gmail.com',
        password: 'password123',
        role: 'doctor'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/farmanet');
        console.log('Conectado a MongoDB...');
        
        await User.deleteMany({ email: { $in: doctors.map(d => d.email) } });
        
        for (let doc of doctors) {
            const newUser = new User(doc);
            await newUser.save();
            console.log(`Usuario creado: ${doc.email}`);
        }
        
        console.log('Seed finalizado con éxito.');
        process.exit();
    } catch (error) {
        console.error('Error al poblar la DB:', error);
        process.exit(1);
    }
};

seedDB();
