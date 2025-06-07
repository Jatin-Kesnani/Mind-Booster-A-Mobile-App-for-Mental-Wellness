const express = require('express');
const router = express.Router();
const Chat = require('../models/message');
const mongoose = require('mongoose');

// Endpoint to fetch messages
router.get('/getmsg/:id', async (req, res) => {
    const { id } = req.params;
    const { friendId } = req.query;

    if (!id || !friendId) {
        return res.status(400).json({ error: 'Both userId and friendId are required.' });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(friendId)) {
        return res.status(400).json({ error: 'Invalid userId or friendId.' });
    }

    try {
        // Find the chat where both users are participants
        const chat = await Chat.findOne({
            participants: { $all: [new mongoose.Types.ObjectId(id), new mongoose.Types.ObjectId(friendId)] }
        });

        // If the chat exists, return its messages, otherwise return an empty array
        if (chat) {
            res.json(chat.messages);
        } else {
            res.json([]); // No chat found between the two users
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages.' });
    }
});

// Endpoint to send a message
router.post('/sendmsg', async (req, res) => {
    const senderId = req.query.senderId;
    const { receiverId, text } = req.body;

    if (!senderId || !receiverId || !text) {
        return res.status(400).json({ error: 'senderId, receiverId, and text are required.' });
    }

    // Validate ObjectIds
    if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
        return res.status(400).json({ error: 'Invalid senderId or receiverId.' });
    }

    try {
        let chat = await Chat.findOne({
            participants: { $all: [new mongoose.Types.ObjectId(senderId), new mongoose.Types.ObjectId(receiverId)] }
        });

        if (!chat) {
            chat = new Chat({
                participants: [senderId, receiverId],
                messages: []
            });
        }

        chat.messages.push({
            sender: senderId,
            text,
            timestamp: new Date()
        });

        const updatedChat = await chat.save();

        res.status(201).json(updatedChat);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message.' });
    }
});

module.exports = router;
