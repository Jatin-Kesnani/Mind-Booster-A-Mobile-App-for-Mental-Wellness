const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/Users'); // Adjust the path accordingly
const Friend = require('../models/Friends')
const Chat = require('../models/message');

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user instance with plain password
    const user = new User({ username, email, password });

    // Save the user
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user');
  }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
  
      console.log('User found:', user); // Log the found user
  
      // Check if user exists
      if (!user) {
        return res.status(400).json({ message: 'No user found!' });
      }
  
      // Compare the provided password directly (not hashed)
      if (user.password !== password) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }
  
      // Return user ID, username, and a success message
      res.status(200).json({ 
        message: 'Login successful', 
        username: user.username,
        userId: user._id // Return the user ID
      });
    } catch (error) {
      console.error(error);
      res.status(500).send('Error logging in');
    }
  });
  

// Get All Users Route
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, 'username email'); // Adjust the fields to return as needed
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching users');
  }
});

// Add Friend Route
router.post('/add-friend', async (req, res) => {
  const { userId, friendId } = req.body;

  // Validate input
  if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
  }

  if (!friendId) {
      return res.status(400).json({ message: 'Friend ID is required' });
  }

  // Check if the user is trying to add themselves
  if (userId === friendId) {
      return res.status(400).json({ message: 'You cannot add yourself as a friend' });
  }

  try {
      // Check if both users exist
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      if (!friend) {
          return res.status(404).json({ message: 'Friend not found' });
      }

      // Check if they are already friends
      const existingFriendship = await Friend.findOne({ userId, friendId });
      if (existingFriendship) {
          return res.status(400).json({ message: 'Already friends' });
      }

      // Create a new chat session if none exists between these two users
      let chat = await Chat.findOne({
          participants: { $all: [userId, friendId] }
      });

      if (!chat) {
          chat = new Chat({
              participants: [userId, friendId],
              messages: []
          });
          await chat.save();
      }

      // Add the friend for both users
      const friendForUser = new Friend({ userId, friendId, chatId: chat._id });
      const userForFriend = new Friend({ userId: friendId, friendId: userId, chatId: chat._id });

      // Save both records
      await Promise.all([friendForUser.save(), userForFriend.save()]);

      res.status(200).json({ message: 'Friend added successfully!' });
  } catch (error) {
      console.error('Error adding friend:', error);
      res.status(500).json({ message: 'Error adding friend' });
  }
});




router.get('/get-friends/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Received ID:', id); // Log the received ID

  // Check if the id is a valid ObjectId
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const friends = await Friend.find({ userId: id }).populate('friendId', 'username email');

    if (!friends || friends.length === 0) {
      return res.status(404).json({ message: 'No friends found' });
    }

    const friendDetails = friends.map(friend => friend.friendId);
    res.json(friendDetails);

  } catch (error) {
    console.error('Error fetching friends:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


  router.put('/update-user', async (req, res) => {
    const { email, username, password, profilePic } = req.body;

    // Validate input
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Email, username, and password are required.' });
    }
  
    try {
      // Update user information in the database
      const updatedUser = await User.findOneAndUpdate(
        { email },
        { username, password, profilePic },
        { new: true } // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'Profile updated successfully!', user: updatedUser });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Error updating profile', error });
    }
});

// Get User by Username
router.get('/user/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username }, 'username email profilePic'); // Adjust fields as needed
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

// Update Profile Picture by Username
router.put('/user/profile-pic', async (req, res) => {
  const { username, profilePic } = req.body;

  // Validate input
  if (!username || !profilePic) {
    return res.status(400).json({ message: 'Username and profile picture are required.' });
  }

  try {
    // Update the profile picture in the database
    const updatedUser = await User.findOneAndUpdate(
      { username },
      { profilePic },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Profile picture updated successfully!', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ message: 'Error updating profile picture', error });
  }
});

module.exports = router;