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

        // Create a new message
        const newMessage = new Message({
            worker: workerId,
            week: weekId,
            message: messageText
        });

        // Save the message to the database
        const savedMessage = await newMessage.save();

        return res.status(201).json(savedMessage);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = messageRouter;
