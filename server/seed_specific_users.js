const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skills-marketplace';

const specificUsers = [
    {
        name: 'Ashuk Kumar',
        email: 'ashuk@example.com',
        password: 'password123',
        role: 'student',
        college: 'IGNOU',
        course: 'BCA',
        year: 'Final Year'
    },
    {
        name: 'Anuj Kushwaha',
        email: 'anuj@example.com',
        password: 'password123',
        role: 'student',
        college: 'DU',
        course: 'B.Sc. CS',
        year: '2nd Year'
    }
];

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('✅ Connected');
        const User = require('./models/User');

        for (const u of specificUsers) {
            // Check by email OR name (loose match)
            const existing = await User.findOne({
                $or: [
                    { email: u.email },
                    { name: new RegExp(u.name.split(' ')[0], 'i') } // Check 'Ashuk' or 'Anuj'
                ]
            });

            if (!existing) {
                const salt = await bcrypt.genSalt(10);
                u.password = await bcrypt.hash(u.password, salt);
                await User.create(u);
                console.log(`✅ Created user: ${u.name}`);
            } else {
                console.log(`ℹ️ User already exists (matched name/email): ${existing.name} (${existing.email})`);
                // Ensure role is student
                if (existing.role !== 'student') {
                    existing.role = 'student';
                    await existing.save();
                    console.log(`   🔸 Updated role to 'student'`);
                }
            }
        }

        console.log('Done.');
        mongoose.connection.close();
    })
    .catch(err => { console.error(err); process.exit(1); });
