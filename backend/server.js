const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); 
// const bodyParser = require('body-parser');
const mongoURI = require('./db');

const authRoutes = require('./routes/auth');
const quotesRouter = require('./routes/quotes'); 
const messageRoutes = require('./routes/message');
const gameRoutes = require('./routes/games');
const gameDataRoutes = require('./routes/gameData');
const communityRoutes = require('./routes/communityR');

const app = express();
const PORT = 5000; // Allow PORT to be set by environment variables

// Middleware
// app.use(bodyParser.json());
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

// Route handlers
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quotesRouter);
app.use('/api/messages', messageRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/gameData', gameDataRoutes);
app.use('/api/communityR', communityRoutes);

// MongoDB connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit the process if MongoDB connection fails
  });

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
