const express = require('express');
const messageRouter = express.Router();
const Message = require('../models/message');
const Week = require('../models/week');
const User = require('../models/user');

const bodyParser = require('body-parser');

messageRouter.use(bodyParser.json());

// create message
messageRouter.post('/sendMessage', async (req, res) => {
    try {
        const workerId = req.body.worker;
        const weekId = req.body.week;
        const messageText = req.body.message;

        // Check if a message with the same workerId and weekId already exists
        let existingMessage = await Message.findOne({ worker: workerId, week: weekId });

        if (existingMessage) {
            // Update the existing message's messageText
            existingMessage.message = messageText;
            await existingMessage.save();
            return res.status(201).json(existingMessage);
        } else {
            // Create a new message
            const newMessage = new Message({
                worker: workerId,
                week: weekId,
                message: messageText
            });
            
            // Save the new message to the database
            const savedMessage = await newMessage.save();
            console.log(newMessage)
            return res.status(201).json(savedMessage);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// get the message of the user if he wrote one
messageRouter.post('/getMessageOfUser', async (req, res) => {
    const userId = req.body.userId;
    const weekId = req.body.weekId;

    // Check if the user and week exist
    const user = await User.findById(userId);
    const week = await Week.findById(weekId);

    if (!user || !week) {
        return res.status(404).json({ error: 'User or Week not found' });
    }

    // Find the message for the given user and week
    const message = await Message.findOne({
        worker: userId,
        week: weekId
    });

    if (!message) {
        return res.status(404).json({ error: 'Message not found for the given user and week' });
    }

    return res.status(200).json(message);
});

module.exports = messageRouter;
