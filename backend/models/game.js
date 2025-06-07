// models/Game.js
const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
  gameName: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Game', GameSchema);
