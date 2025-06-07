const express = require('express');
const router = express.Router();
const Community = require('../models/communityModel'); // Path to the Community model

// POST route to create a new community post
router.post('/create', async (req, res) => {
  try {
    const { username, imagePath } = req.body;

    // Validate input data
    if (!username || !imagePath) {
      return res.status(400).json({ message: 'Username and Image Path are required' });
    }

    // Create a new community post
    const newCommunityPost = new Community({
      username,
      imagePath,
    });

    // Save the post to the database
    const savedPost = await newCommunityPost.save();
    return res.status(201).json(savedPost); // Respond with the created post

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
});

// GET route to fetch all community posts
router.get('/posts', async (req, res) => {
  try {
    const communityPosts = await Community.find().sort({ currentDateTime: 1 }); // Sort by most recent
    return res.status(200).json(communityPosts); // Respond with all community posts

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error, please try again later' });
  }
});

module.exports = router;
