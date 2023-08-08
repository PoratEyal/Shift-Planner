const express = require('express');
const weekRouter = express.Router();
const Week = require('../models/week');
const bodyParser = require('body-parser');
const functions = require('../utils/functions');
const createWeekTest = require('../utils/CreateWeekTest');

weekRouter.use(bodyParser.json());

// get nextWeek for the specific managerId
weekRouter.post('/getNextWeek', async (req, res) => {
    try {
        const managerId = req.body.id;
        const week = await Week.findOne({ name: "NextWeek", ofManager: managerId });
        res.status(200).json(week);
    } catch (err) {
        res.status(400).json(err);
    }
});

// get current Week for the specific managerId
weekRouter.post('/getCurrentWeek', async (req, res) => {
    try {
        const managerId = req.body.managerId;
        const week = await Week.findOne({ name: "CurrentWeek", ofManager: managerId }).then((response => {
            res.status(200).json(response);
        }))
    } catch (err) {
        res.status(400).json(err);
    }
});

// for testing - create new nextWeek with days
//need to put specific managerId her
weekRouter.get('/testWeekCreating', (req, res) => {
  
    createWeekTest("64ccfd81cd904a14764e3768");
    res.status(200);
});

// set nextWeek to visible
weekRouter.put('/setNextWeekVisible', (req, res) => {
    const managerId = req.body.id;
    Week.findOneAndUpdate({ name: "NextWeek" , ofManager: managerId}, { visible: "true" }).then(response => {
        res.status(200).json(response);
    }).catch(err => { console.log(err) })
})

// set nextWeek to published
weekRouter.put('/setNextWeekPublished', (req, res) => {
    const managerId = req.body.id;
    Week.findOneAndUpdate({ name: "NextWeek" , ofManager: managerId}, { publishScheduling: "true" }).then(response => {
        res.status(200).json(response);
    }).catch(err => { console.log(err) })
})


module.exports = weekRouter