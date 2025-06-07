const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    messages: [
        {
            sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            text: { type: String }, // Made text optional
            audioPath: { type: String }, // New field for voice note file path
            timestamp: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('Chat', ChatSchema);
