const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  username: { type: String, required: true },  // Username of the community member
  imagePath: { type: String, required: true }, // Path to the image related to the community screen
  currentDateTime: { type: Date, default: Date.now }, // Stores the current date and time when the post is made
});

module.exports = mongoose.model('Community', communitySchema);
