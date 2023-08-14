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
  
    createWeekTest("64c259e1933a450465d6b292");
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

// get manager id and week data as a json and update the week with the new data
weekRouter.post('/updateNextWeek', async (req, res) => {
    try {
        const managerId = req.body.managerId;
        const updatedData = req.body.data; 
        
        // Find the week by name and managerId
        const week = await Week.findOneAndUpdate(
            { name: "NextWeek", ofManager: managerId },
            updatedData,
            { new: true }
        );

        if (!week) {
            return res.status(404).json({ message: 'Week not found' });
        }

        res.status(200).json(week);
    } catch (err) {
        res.status(400).json(err);
    }
});


module.exports = weekRouter