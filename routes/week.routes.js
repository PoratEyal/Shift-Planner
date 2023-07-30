const express = require('express');
const weekRouter = express.Router();
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

weekRouter.use(bodyParser.json());


// get week by his name
weekRouter.get('/getWeekByName/:name', async (req, res) => {
    try {
        const name = req.params.name;
        const week = await Week.findOne({ name: name });
        res.status(200).json(week);
    } catch (err) {
        res.status(400).json(err);
    }
});
weekRouter.get('/getNextWeek', async (req, res) => {
    try {
        const week = await Week.findOne({ name: "NextWeek" });
        res.status(200).json(week);
    } catch (err) {
        res.status(400).json(err);
    }
});
weekRouter.get('/getCurrentWeek', async (req, res) => {
    try {
        const week = await Week.findOne({ name: "CurrentWeek" }).then((response => {

            res.status(200).json(response);
        }))
    } catch (err) {
        res.status(400).json(err);
    }
});

// for testing - create new nextWeek with days
weekRouter.get('/testWeekCreating', (req, res) => {
    functions();
    res.status(200);
});

// set nextWeek to visible
weekRouter.put('/setNextWeekVisible', (req, res) => {
    Week.findOneAndUpdate({ name: "NextWeek" }, { visible: "true" }).then(response => {
        res.status(200).json(response);
    }).catch(err => { console.log(err) })
})

// set nextWeek to published
weekRouter.put('/setNextWeekPublished', (req, res) => {
    Week.findOneAndUpdate({ name: "NextWeek" }, { publishScheduling: "true" }).then(response => {
        res.status(200).json(response);
    }).catch(err => { console.log(err) })
})

// create new week
weekRouter.post('/addWeek', async (req, res) => {
    Week.create(req.body).then((obj) => {
        res.status(201).json(obj);
    }).catch(err => {
        res.status(400).json({ messege: err._messege });
    });
});

// edit week - update his id
weekRouter.put('/editWeek', async (req, res) => {
    try {
        let reqBody = req.body;
        const oldWeek = await Week.findOneAndUpdate({ _id: reqBody._id }, reqBody);
        res.status(200).json(oldWeek);
    } catch (err) {
        res.status(400).json({ message: err._messege });
    }
});



module.exports = weekRouter