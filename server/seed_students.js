const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skills-marketplace';

const sampleStudents = [
    {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        password: 'password123',
        role: 'student',
        college: 'IIT Delhi',
        course: 'B.Tech CSE',
        year: '3rd Year',
        bio: 'Passionate about web development.'
    },
    {
        name: 'Priya Patel',
        email: 'priya@example.com',
        password: 'password123',
        role: 'student',
        college: 'BITS Pilani',
        course: 'B.Tech ECE',
        year: '2nd Year',
        bio: 'Learning AI/ML.'
    },
    {
        name: 'Amit Singh',
        email: 'amit@example.com',
        password: 'password123',
        role: 'student',
        college: 'NIT Trichy',
        course: 'MCA',
        year: 'Final Year',
        bio: 'Looking for backend dev roles.'
    }
];

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('✅ Connected to MongoDB');
        const User = require('./models/User');

        try {
            for (const student of sampleStudents) {
                // Check if user already exists
                const existing = await User.findOne({ email: student.email });
                if (!existing) {
                    // Hash password
                    const salt = await bcrypt.genSalt(10);
                    student.password = await bcrypt.hash(student.password, salt);

                    await User.create(student);
                    console.log(`✅ Created student: ${student.name}`);
                } else {
                    console.log(`ℹ️ Student already exists: ${student.name}`);
                }
            }
            console.log('\n✨ Seeding completed!');
        } catch (err) {
            console.error('❌ Error seeding users:', err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => {
        console.error('❌ Connection error:', err);
        process.exit(1);
    });
