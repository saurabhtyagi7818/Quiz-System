const express = require('express');
const router = express.Router();
const Attempt = require('../models/Attempt');
const Quiz = require('../models/Quiz');
const { auth, admin } = require('../middleware/auth');

// Get Overall Stats (Admin)
router.get('/stats', auth, admin, async (req, res) => {
    try {
        const totalAttempts = await Attempt.countDocuments();
        const totalQuizzes = await Quiz.countDocuments();

        // Average score per quiz
        const stats = await Attempt.aggregate([
            {
                $group: {
                    _id: "$quiz_id",
                    avgScore: { $avg: "$score" },
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "quizzes",
                    localField: "_id",
                    foreignField: "_id",
                    as: "quiz"
                }
            },
            { $unwind: "$quiz" },
            {
                $project: {
                    title: "$quiz.title",
                    avgScore: 1,
                    count: 1
                }
            }
        ]);

        res.send({ totalAttempts, totalQuizzes, quizStats: stats });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

module.exports = router;
