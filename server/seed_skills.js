const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/skills-marketplace';

const sampleSkills = [
    {
        title: 'Advanced React Development',
        description: 'Learn how to build scalable React applications with Redux and Hooks.',
        category: 'Programming',
        type: 'teaching',
        level: 'Intermediate',
        postedByName: 'Rahul Sharma'
    },
    {
        title: 'Machine Learning Basics',
        description: 'Introduction to Python, NumPy, Pandas, and basic ML algorithms.',
        category: 'Academics',
        type: 'teaching',
        level: 'Beginner',
        postedByName: 'Priya Patel'
    },
    {
        title: 'Guitar Lessons',
        description: 'Learn to play acoustic guitar from scratch.',
        category: 'Music',
        type: 'teaching',
        level: 'Beginner',
        postedByName: 'Amit Singh'
    },
    {
        title: 'Data Structures & Algorithms',
        description: 'Seeking help with DSA problems in C++.',
        category: 'Programming',
        type: 'learning',
        level: 'Intermediate',
        postedByName: 'Rahul Sharma'
    },
    {
        title: 'UI/UX Design Mentorship',
        description: 'Looking for a mentor to guide me in Figma and Adobe XD.',
        category: 'Design',
        type: 'learning',
        level: 'All Levels',
        postedByName: 'Priya Patel'
    }
];

mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(async () => {
        console.log('✅ Connected to MongoDB');
        const User = require('./models/User');
        const Skill = require('./models/Skill');

        try {
            // clear existing skills to avoid duplicates if re-running (optional, maybe safe to check if exists)
            // For now, let's just add if not exists

            for (const skillData of sampleSkills) {
                const user = await User.findOne({ name: skillData.postedByName });
                if (!user) {
                    console.log(`⚠️ User not found for skill: ${skillData.title} (User: ${skillData.postedByName})`);
                    continue;
                }

                // Check if skill already exists for this user
                const existingSkill = await Skill.findOne({ title: skillData.title, postedBy: user._id });
                if (existingSkill) {
                    console.log(`ℹ️ Skill already exists: ${skillData.title}`);
                    continue;
                }

                const newSkill = new Skill({
                    postedBy: user._id,
                    title: skillData.title,
                    description: skillData.description,
                    category: skillData.category,
                    type: skillData.type,
                    level: skillData.level,
                    availability: 'Flexible'
                });

                await newSkill.save();

                // Update user
                if (skillData.type === 'teaching') {
                    await User.findByIdAndUpdate(user._id, { $addToSet: { skillsTeaching: newSkill._id } });
                } else {
                    await User.findByIdAndUpdate(user._id, { $addToSet: { skillsLearning: newSkill._id } });
                }

                console.log(`✅ Created skill: ${skillData.title}`);
            }

            console.log('\n✨ Skills Seeding completed!');
        } catch (err) {
            console.error('❌ Error seeding skills:', err);
        } finally {
            mongoose.connection.close();
        }
    })
    .catch(err => {
        console.error('❌ Connection error:', err);
        process.exit(1);
    });
