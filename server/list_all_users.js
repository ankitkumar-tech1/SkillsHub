const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skills-marketplace';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('✅ Connected');
        const User = require('./models/User');

        const users = await User.find({});
        console.log('--------------------------------------------------');
        console.log(`Total Users: ${users.length}`);
        console.log(String(users.length).padEnd(50, '-'));

        users.forEach(u => {
            console.log(`Name:   ${u.name}`);
            console.log(`Email:  ${u.email}`);
            console.log(`Role:   '${u.role}'`); // Quote to see if there are spaces
            console.log(`ID:     ${u._id}`);
            console.log('--------------------------------------------------');
        });

        const students = await User.find({ role: 'student' });
        console.log(`\nQuery { role: 'student' } matches matching count: ${students.length}`);

        mongoose.connection.close();
    })
    .catch(err => { console.error(err); process.exit(1); });
