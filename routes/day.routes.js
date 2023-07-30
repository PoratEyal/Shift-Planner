const express = require('express');
const dayRouter = express.Router();
const Role = require('../models/role');
const User = require('../models/user');
const Shift = require('../models/shift');
const Day = require('../models/day');
const Week = require('../models/week');
const job = require('../models/job');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { parse } = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const functions = require('../utils/functions');
const { Job } = require('node-schedule');
const ObjectId = mongoose.Types.ObjectId;


dayRouter.use(bodyParser.json());
// create/post Day
dayRouter.post('/addDay', async (req, res) => {
    Day.create(req.body).then((obj) => {
        res.status(201).json(obj);
    }).catch(err => {
        res.status(400).json({ messege: err._messege });
    });
});

//get days
dayRouter.get('/getDays', async (req, res) => {
    await Day.find()
        .then(days => {
            res.status(200).json(days);
        })
        .catch(err => {
            res.status.json({ message: err.message });
        });
});

//get one day
dayRouter.get('/getDay/:id', async (req, res) => {
    await Day.findById(req.params.id)
        .then(day => {
            if (day) {
                res.status(200).json(day)
            } else {
                throw new Error("no such day was found");
            }
        })
        .catch(err => {
            res.status(400).json({ message: err.Error });
        });
});

//delete day
dayRouter.delete('/deleteDay/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deleted = await Day.findOneAndDelete(id);
        res.status(202).json(deleted);
    } catch (err) {
        res.status(400).json({ message: err._messege })
    }
});
//edit day
dayRouter.put('/editDay', async (req, res) => {
    try {
        let reqBody = req.body;
        const oldDay = await Day.findByIdAndUpdate(reqBody._id, reqBody);
        res.status(200).json(oldDay);
    } catch (err) {
        res.status(400).json({ message: err._messege });
    }

});

// delete shift from day - get shiftId
dayRouter.delete('/deleteShiftFromDay/:shiftId', (req, res) => {
    Day.updateOne({ shifts: req.params.shiftId }, { $pull: { shifts: req.params.shiftId } })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(400).json(err);
        });
});

//add shift to day
dayRouter.put('/addShiftToDay', (req, res) => {
    //console.log("in request")
    const body = req.body;
    const dayId = body.dayId;
    const shift = body.newShift;
    Week.findOneAndUpdate({ "day._id": dayId, "day._id": dayId }, { $push: { "day.$.shifts": shift } }, { returnOriginal: true })
        .then(response => {
            res.status(200).json(response);
        });
});

// get all the shifts from specific day - get dayId
dayRouter.get('/getShiftsOfDay/:dayId', (req, res) => {
    Week.findOne({ "day._id": req.params.dayId }, { "day.$": 1 })
        .then(response => {
            res.status(200).json(response.day[0].shifts);
        })
});

// delete shift from day
dayRouter.put('/deleteShiftFromDay', (req, res) => {
    const body = req.body;
    const dayId = body.dayId;
    const shift = body.shiftId;
    Week.findOneAndUpdate({ "day._id": dayId, "day._id": dayId }, { $pull: { "day.$.shifts": { _id: shift } } }, { returnOriginal: true })
        .then(response => {
            res.status(200).json(response);
        });
});



module.exports = dayRouter