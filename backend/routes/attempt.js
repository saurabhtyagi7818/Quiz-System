const express = require('express');
const router = express.Router();
const Attempt = require('../models/Attempt');
const Question = require('../models/Question');
const { auth, admin } = require('../middleware/auth');

// Submit Quiz Attempt
router.post('/', auth, async (req, res) => {
    try {
        const { quiz_id, answers } = req.body;
        const questions = await Question.find({ quiz_id });

        let score = 0;
        questions.forEach((q, i) => {
            if (answers[i] === q.correct_index) {
                score++;
            }
        });

        const attempt = new Attempt({
            user_id: req.user.id,
            quiz_id,
            score,
            answers
        });
        await attempt.save();
        res.status(201).send({ score, total: questions.length });
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});

// Get User's Past Attempts
router.get('/my', auth, async (req, res) => {
    try {
        const attempts = await Attempt.find({ user_id: req.user.id }).populate('quiz_id', 'title');
        res.send(attempts);
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
