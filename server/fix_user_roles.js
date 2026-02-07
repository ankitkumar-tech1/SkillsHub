const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skills-marketplace';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('✅ Connected to MongoDB');
        const User = require('./models/User');

        try {
            // Find users who are NOT admin and NOT student
            // This includes users with role: null, undefined, or any other string
            const result = await User.updateMany(
                { role: { $nin: ['student', 'admin'] } },
                { $set: { role: 'student' } }
            );

            console.log(`\n🛠️  Migration Complete`);
            console.log(`Matched (Invalid Roles): ${result.matchedCount}`);
            console.log(`Modified (Fixed -> student): ${result.modifiedCount}`);

        } catch (err) {
            console.error('❌ Error updating users:', err);
        } finally {
            mongoose.connection.close();
        }
    }).catch(err => {
        console.error('❌ Connection error:', err);
        process.exit(1);
    });
