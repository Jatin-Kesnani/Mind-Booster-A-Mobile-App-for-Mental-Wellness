const express = require('express');
const router = express.Router();

// Define the route for fetching quotes
router.get('/', async (req, res) => {
    try {
        const response = await fetch('https://zenquotes.io/api/quotes');

        // Check if the response is OK
        if (!response.ok) {
            return res.status(response.status).json({ message: 'Error fetching quotes from external API' });
        }

        const quotes = await response.json();

        // Validate the structure of the quotes
        if (!Array.isArray(quotes)) {
            return res.status(500).json({ message: 'Unexpected response format from quotes API' });
        }

        res.json(quotes);
    } catch (error) {
        console.error('Error fetching quotes:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
