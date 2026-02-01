const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const createAdmin = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/skills-marketplace';
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to MongoDB');

        const email = 'ankitkumar2431967@gmail.com';
        const password = 'ankit123';
        const name = 'Admin Ankit';

        let user = await User.findOne({ email });

        if (user) {
            console.log('User found, updating to admin...');
            user.role = 'admin';
            user.password = password; // The pre-save hook will hash this
            await user.save();
            console.log('User updated successfully!');
        } else {
            console.log('User not found, creating new admin...');
            user = new User({
                name,
                email,
                password,
                role: 'admin',
                college: 'Admin College',
                course: 'Admin Course',
                year: 'Final'
            });
            await user.save();
            console.log('Admin user created successfully!');
        }

        mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createAdmin();
