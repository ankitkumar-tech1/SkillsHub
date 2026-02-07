const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skills-marketplace';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Connected to MongoDB');

    // Define User Schema inline to avoid dependency issues or use require if stable
    const User = require('./models/User');

    try {
        const users = await User.find({});
        console.log(`\nTotal Users: ${users.length}`);

        if (users.length === 0) {
            console.log('No users found.');
        } else {
            console.log('--- User List ---');
            users.forEach(u => {
                console.log(`ID: ${u._id} | Name: ${u.name} | Role: ${u.role} | Email: ${u.email}`);
            });
            console.log('-----------------');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        mongoose.connection.close();
    }
}).catch(err => {
    console.error('Connection error:', err);
    process.exit(1);
});
