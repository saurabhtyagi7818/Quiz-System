const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    quiz_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
    text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correct_index: { type: Number, required: true }
});

module.exports = mongoose.model('Question', questionSchema);
