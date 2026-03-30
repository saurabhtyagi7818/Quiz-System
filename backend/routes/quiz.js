const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const { auth, admin } = require('../middleware/auth');

// Create Quiz (Admin)
router.post('/', auth, admin, async (req, res) => {
    try {
        const quiz = new Quiz({ ...req.body, admin_id: req.user.id });
        await quiz.save();
        res.status(201).send(quiz);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Get All Quizzes
router.get('/', auth, async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.send(quizzes);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Add Question (Admin)
router.post('/:id/questions', auth, admin, async (req, res) => {
    try {
        const question = new Question({ ...req.body, quiz_id: req.params.id });
        await question.save();
        res.status(201).send(question);
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Get Questions for a Quiz
router.get('/:id/questions', auth, async (req, res) => {
    try {
        const questions = await Question.find({ quiz_id: req.params.id });
        res.send(questions);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
