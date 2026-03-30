const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true },
    answers: [{ type: Number }],
    completed_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attempt', attemptSchema);
