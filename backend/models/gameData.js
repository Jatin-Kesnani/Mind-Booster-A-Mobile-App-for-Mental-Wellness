// models/GameData.js
const mongoose = require('mongoose');

const GameDataSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  gameId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Game' },
  minutesPlayed: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('GameData', GameDataSchema);
