const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skills-marketplace';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('✅ Connected');
        const User = require('./models/User');

        const users = await User.find({
            $or: [
                { name: { $regex: 'ashuk', $options: 'i' } },
                { name: { $regex: 'anuj', $options: 'i' } },
                { email: { $regex: 'ashuk', $options: 'i' } },
                { email: { $regex: 'anuj', $options: 'i' } }
            ]
        });

        console.log(`\nFound ${users.length} users:`);
        users.forEach(u => {
            console.log('--------------------------------------------------');
            console.log(`Name:    ${u.name}`);
            console.log(`Email:   ${u.email}`);
            console.log(`Role:    ${u.role}`);
            console.log(`College: ${u.college || '[MISSING]'}`);
            console.log(`Course:  ${u.course || '[MISSING]'}`);
            console.log(`Year:    ${u.year || '[MISSING]'}`);
            console.log(`Bio:     ${u.bio || '[MISSING]'}`);
        });
        console.log('--------------------------------------------------');

        mongoose.connection.close();
    })
    .catch(err => { console.error(err); process.exit(1); });
