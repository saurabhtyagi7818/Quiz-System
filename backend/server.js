require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./models/User');
const Quiz = require('./models/Quiz');
const Question = require('./models/Question');

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/quiz', require('./routes/quiz'));
app.use('/api/attempt', require('./routes/attempt'));
app.use('/api/analytics', require('./routes/analytics'));

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quiz-system';

async function seedDemoData() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@quiz.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
        admin = new User({ email: adminEmail, password: adminPassword, role: 'admin' });
        await admin.save();
        console.log(`Seeded admin user: ${adminEmail}`);
    }

    const quizCount = await Quiz.countDocuments();
    if (quizCount === 0) {
        const quiz = await Quiz.create({
            title: 'General Knowledge Basics',
            description: 'Starter quiz for demo',
            admin_id: admin._id
        });

        await Question.insertMany([
            {
                quiz_id: quiz._id,
                text: 'What is the capital of India?',
                options: ['Mumbai', 'New Delhi', 'Kolkata', 'Chennai'],
                correct_index: 1
            },
            {
                quiz_id: quiz._id,
                text: '2 + 2 = ?',
                options: ['3', '4', '5', '6'],
                correct_index: 1
            },
            {
                quiz_id: quiz._id,
                text: 'Which planet is known as the Red Planet?',
                options: ['Earth', 'Venus', 'Mars', 'Jupiter'],
                correct_index: 2
            }
        ]);

        console.log('Seeded demo quiz and questions');
    }
}

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await seedDemoData();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => console.error('MongoDB connection error:', err));
