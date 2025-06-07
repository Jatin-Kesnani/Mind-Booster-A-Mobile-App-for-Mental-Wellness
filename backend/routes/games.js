const express = require('express');
const router = express.Router();
const Game = require('../models/game');

// POST /api/games - Create a new game
router.post('/', async (req, res) => {
  const { gameName } = req.body;

  // Validate the request body
  if (!gameName) {
    return res.status(400).json({ message: 'Game ID and game name are required.' });
  }

  try {
    const newGame = new Game({ gameName });
    const savedGame = await newGame.save();
    res.status(201).json(savedGame);
  } catch (error) {
    res.status(500).json({ message: 'Error saving game data', error });
  }
});

// GET /api/games - Retrieve all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find(); // Fetch all games from the database
    res.status(200).json(games); // Send the games as a response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching games', error });
  }
});

module.exports = router;
