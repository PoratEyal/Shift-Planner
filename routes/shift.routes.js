const express = require('express');
const shiftRouter = express.Router();
const User = require('../models/user');
const Shift = require('../models/shift');
const bodyParser = require('body-parser');

shiftRouter.use(bodyParser.json());

// create/post shift
shiftRouter.post('/addShift', (req, res) => {
    User.find({ fullName: req.body.workers }).then(data => {
        const workers = data
        const shift = new Shift({
            description: req.body.description,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            workers: workers
        })
        shift.save().then(data => {
            const newShift = data
            res.status(201).json(newShift)
        })
    })
        .catch((err) => {
            res.status(400).json({ messege: err.messege })
        })
});


module.exports = shiftRouter