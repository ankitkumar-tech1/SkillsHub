const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skills-marketplace';

const specificUsers = [
    {
        email: 'ashuk@example.com',
        details: {
            college: 'IGNOU',
            course: 'BCA',
            year: 'Final Year',
            bio: 'Enthusiastic developer learning full stack.'
        }
    },
    {
        email: 'anuj@example.com',
        details: {
            college: 'DU',
            course: 'B.Sc. CS',
            year: '2nd Year',
            bio: 'Focused on Python and Data Science.'
        }
    }
];

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('✅ Connected');
        const User = require('./models/User');

        for (const u of specificUsers) {
            const user = await User.findOne({ email: u.email });
            if (user) {
                user.college = u.details.college;
                user.course = u.details.course;
                user.year = u.details.year;
                user.bio = u.details.bio; // Also update bio if missing

                await user.save();
                console.log(`✅ Updated details for: ${user.name} (${user.email})`);
                console.log(`   College: ${user.college}, Course: ${user.course}`);
            } else {
                console.log(`❌ User not found: ${u.email}`);
            }
        }

        console.log('Done.');
        mongoose.connection.close();
    })
    .catch(err => { console.error(err); process.exit(1); });
