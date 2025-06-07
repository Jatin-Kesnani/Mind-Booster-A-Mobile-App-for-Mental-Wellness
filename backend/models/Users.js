const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Keep this as is, but no hashing
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // New field for friends
  profilePic: { type: String, default: null }, // New field for profile picture

});

module.exports = mongoose.model('User', userSchema);
