const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skills-marketplace';

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('✅ Connected to MongoDB');
        const User = require('./models/User');

        try {
            const specificUsers = await User.find({
                $or: [
                    { name: { $regex: 'ashuk', $options: 'i' } },
                    { name: { $regex: 'anuj', $options: 'i' } },
                    { email: { $regex: 'ashuk', $options: 'i' } },
                    { email: { $regex: 'anuj', $options: 'i' } }
                ]
            });

            console.log(`\n🔍 Found ${specificUsers.length} users matching 'ashuk' or 'anuj':`);
            specificUsers.forEach(u => {
                console.log(`\n👤 Name: ${u.name}`);
                console.log(`   Email: ${u.email}`);
                console.log(`   Role: ${u.role}`);
                console.log(`   ID: ${u._id}`);
            });

            if (specificUsers.length === 0) {
                console.log('⚠️ No users found matching those names.');
                // List all users to see what's actually there
                const allUsers = await User.find({}, 'name email role');
                console.log('\n📋 All users in DB:');
                allUsers.forEach(u => console.log(`- ${u.name} (${u.role})`));
            }

        } catch (err) {
            console.error('❌ Error querying users:', err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => {
        console.error('❌ Connection error:', err);
        process.exit(1);
    });
