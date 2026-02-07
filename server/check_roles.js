const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skills-marketplace';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        const User = require('./models/User');
        const students = await User.countDocuments({ role: 'student' });
        const admins = await User.countDocuments({ role: 'admin' });
        const others = await User.countDocuments({ role: { $nin: ['student', 'admin'] } });

        console.log(`Students: ${students}`);
        console.log(`Admins: ${admins}`);
        console.log(`Others: ${others}`);

        mongoose.connection.close();
    }).catch(err => console.error(err));
