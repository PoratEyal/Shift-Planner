const express = require('express');
const weekRouter = express.Router();
const Week = require('../models/week');
const bodyParser = require('body-parser');
const functions = require('../utils/functions');

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

// new good func !!!!!!!!!
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
weekRouter.get('/testWeekCreating', (req, res) => {
    functions();
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