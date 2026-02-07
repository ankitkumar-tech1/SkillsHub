const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skills-marketplace';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        const User = require('./models/User');
        const others = await User.find({ role: { $nin: ['student', 'admin'] } });

        console.log('--- Users with "Other" roles ---');
        others.forEach(u => {
            console.log(`Name: ${u.name} | Role: ${u.role} | Email: ${u.email}`);
        });
        console.log('--------------------------------');

        mongoose.connection.close();
    }).catch(err => console.error(err));
