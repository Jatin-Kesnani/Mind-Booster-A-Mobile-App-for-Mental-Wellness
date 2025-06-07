// routes/gameData.js
const express = require('express');
const router = express.Router();
const GameData = require('../models/gameData');

// POST /api/gameData
router.post('/', async (req, res) => {
  const { userId, gameId, minutesPlayed } = req.body;

  // Validate the request body
  if (!userId || !gameId || minutesPlayed === undefined) {
    return res.status(400).json({ message: 'User ID, game ID, and minutes played are required.' });
  }

  try {
    const newGameData = new GameData({
      userId,
      gameId,
      minutesPlayed,
    });

    const savedGameData = await newGameData.save();
    res.status(201).json(savedGameData);
  } catch (error) {
    res.status(500).json({ message: 'Error saving game data', error });
  }
});

// GET /api/gameData/:userId
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const gameData = await GameData.find({ userId })
      .populate('gameId', 'gameName') // Assuming you want to populate game details
      .exec();

    if (!gameData.length) {
      return res.status(404).json({ message: 'No game data found for this user.' });
    }

    res.status(200).json(gameData);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving game data', error });
  }
});

router.put('/:userId/update', async (req, res) => {
    const { userId } = req.params;
    const { gameId, minutesPlayed } = req.body;

    try {
        // Logic to update the user's minutes played for the specific game in the database
        await updateUserGameData(userId, gameId, minutesPlayed);
        res.status(200).json({ message: 'Minutes played updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error updating minutes played' });
    }
});


  

module.exports = router;
