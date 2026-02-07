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
            const allUsers = await User.find({});
            console.log(`\n📊 Total Users in DB: ${allUsers.length}`);

            if (allUsers.length > 0) {
                console.log('\n📋 User List:');
                allUsers.forEach(u => {
                    console.log(`- Name: ${u.name}, Role: ${u.role}, Email: ${u.email}`);
                });
            } else {
                console.log('⚠️ No users found in the database at all.');
            }

            const students = await User.find({ role: 'student' });
            console.log(`\n🎓 Students found with query { role: 'student' }: ${students.length}`);

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
