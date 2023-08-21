const express = require('express');
const dayRouter = express.Router();
const Day = require('../models/day');
const Week = require('../models/week');

const bodyParser = require('body-parser');

dayRouter.use(bodyParser.json());

// working one !!!!!!!!!!!!
//add shift to day
dayRouter.put('/addShiftToDay', (req, res) => {
    const managerId = req.body.managerId;
    const body = req.body;
    const dayId = body.dayId;
    const shift = body.newShift;
    Week.findOneAndUpdate(
        { "day._id": dayId, ofManager: managerId },
        { $push: { "day.$.shifts": shift } },
        { returnOriginal: true }
    )
        .then(response => {
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "An error occurred while adding the shift to the day." });
        });
});

dayRouter.put('/updateShiftsOfWeek', async (req, res) => {
    const weekId = req.body.weekId;
    const shifts = req.body.object.shifts
    shifts.map(async shift => {
        await Week.findOneAndUpdate({ _id: weekId, 'day.shifts._id': shift._id },
            {
                $set: {
                    'day.$[].shifts.$[shift].workers': shift.workers,
                    'day.$[].shifts.$[shift].availableWorkers': []
                }
            },
            {
                new: true,
                useFindAndModify: false,
                arrayFilters: [{ 'shift._id': shift._id }]
            }
        ).then(res => {
            console.log(res);
        }).catch(err => {
            console.log(err);
        })
    })
    res.status(200);
})


// working
// get all the shifts from specific day - get dayId and managerId
dayRouter.post('/getShiftsOfDay', (req, res) => {
    const managerId = req.body.managerId;
    const dayId = req.body.dayId;
    Week.findOne({ "day._id": dayId, ofManager: managerId }, { "day.$": 1 })
        .then(response => {
            res.status(200).json(response.day[0].shifts);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "An error occurred while fetching shifts of the day." });
        });
});

// working !!!!!!!!!!!!!!!
// delete shift from day
dayRouter.put('/deleteShiftFromDay/', (req, res) => {
    const managerId = req.body.managerId;
    const body = req.body;
    const dayId = body.dayId;
    const shift = body.shiftId;
    Week.findOneAndUpdate(
        { "day._id": dayId, ofManager: managerId },
        { $pull: { "day.$.shifts": { _id: shift } } },
        { returnOriginal: true }
    )
        .then(response => {
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "An error occurred while deleting the shift from the day." });
        });
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

module.exports = dayRouter