const express = require("express");
const messageRouter = express.Router();
const Message = require("../models/Message");
const Week = require("../models/week");
const User = require("../models/user");

const bodyParser = require("body-parser");
const { ObjectId } = require("mongodb");

messageRouter.use(bodyParser.json());

// create message
messageRouter.post("/sendMessage", async (req, res) => {
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
                message: messageText,
            });

            // Save the new message to the database
            const savedMessage = await newMessage.save();
            return res.status(201).json(savedMessage);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
});

// get the message of the user if he wrote one
messageRouter.post("/getMessageOfUser", async (req, res) => {
    const userId = req.body.userId;
    const weekId = req.body.weekId;

    // Check if the user and week exist
    const user = await User.findById(userId);
    const week = await Week.findById(weekId);

    if (!user || !week) {
        return res.status(404).json({ error: "User or Week not found" });
    }

    // Find the message for the given user and week
    const message = await Message.findOne({
        worker: new ObjectId(userId),
        week: new ObjectId(weekId),
    });

    if (!message) {
        return res.status(404).json({ error: "Message not found for the given user and week" });
    }

    return res.status(200).json(message);
});
messageRouter.post("/getUserMessagesOfWeek", async (req, res) => {
    const weekId = req.body.weekId;
    const week = await Week.findById(weekId);

    if (!week) {
        return res.status(404);
    }
    const messages = await Message.find({
        week: new ObjectId(weekId),
    });

    if (!messages) {
        return res.status(404);
    }
    return res.status(200).json(messages);
});

// get all the messages that sent to the specific manager
messageRouter.post("/getMessages", async (req, res) => {
    try {
        const managerId = req.body.managerId;
        const weekId = req.body.weekId;
        const usersId = req.body.usersId;

        const manager = await User.findById(managerId);
        if (!manager) {
            return res.status(404).json({ error: "Manager not found" });
        }

        const messages = await Message.find({
            worker: { $in: usersId },
            week: weekId,
        });

        res.status(200).json({ messages });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = messageRouter;
