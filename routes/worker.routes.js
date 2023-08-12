const express = require('express');
const workerRouter = express.Router();
const Week = require('../models/week');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

workerRouter.use(bodyParser.json());

// working one !!!!!
workerRouter.put('/addWorkerToAvial', (req, res) => {
    const body = req.body;
    const managerId = body.managerId;
    const dayId = body.dayId;
    const shiftId = body.shiftId;
    const workerId = body.workerId;

    Week.findOneAndUpdate(
        { "day._id": dayId, "day.shifts._id": shiftId, "ofManager": managerId },
        { $push: { "day.$.shifts.$[elem].availableWorkers": workerId } },
        { arrayFilters: [{ "elem._id": shiftId }], returnOriginal: true }
    ).then(response => {
        res.status(200).json(response);
    });
});

// working one !!!!!
workerRouter.put('/delWorkerToAvial', (req, res) => {
    const body = req.body;
    const managerId = body.managerId;
    const dayId = body.dayId;
    const shiftId = body.shiftId;
    const workerId = body.workerId;

    Week.findOneAndUpdate({ "day._id": dayId, "day.shifts._id": shiftId, "ofManager": managerId },
        {
            $pull: { "day.$.shifts.$[elem].availableWorkers": workerId }
        },
        { arrayFilters: [{ "elem._id": shiftId }] }).then(response => {
            res.status(200).json(response);
        });
});



// working one!!!!!
workerRouter.put('/addWorkerToWorkrs', (req, res) => {
    const body = req.body;
    const managerId = body.managerId;
    const dayId = body.dayId;
    const shiftId = body.shiftId;
    const workerId = body.workerId;

    Week.findOneAndUpdate(
        { "day._id": dayId, "day.shifts._id": shiftId, ofManager: managerId },
        {
            $push: {
                "day.$.shifts.$[elem].workers": workerId,
            }
        },
        { arrayFilters: [{ "elem._id": shiftId }], projection: { "day.$": 1 } }
    )
        .then(() => {
            Week.findOne({ "day._id": dayId, ofManager: managerId }, { "day.$": 1 })
                .then(response => {
                    if (response && response.day && response.day.length > 0) {
                        res.status(200).json(response.day[0]);
                    }
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "An error occurred while adding the worker shift." });
        });
});


// working one!!!!!
workerRouter.put('/WorkersToAvail', (req, res) => {
    const body = req.body;
    const managerId = body.managerId;
    const dayId = body.dayId;
    const shiftId = body.shiftId;
    const workerId = body.workerId;

    Week.findOneAndUpdate(
        { "day._id": dayId, "day.shifts._id": shiftId, ofManager: managerId },
        {
            $pull: {
                "day.$.shifts.$[elem].workers": workerId,
                "day.$.shifts.$[elem].shiftData": { userId: { $eq: workerId } }
            }
        },
        { arrayFilters: [{ "elem._id": shiftId }], projection: { "day.$": 1 } }
    )
        .then(() => {
            Week.findOne({ "day._id": dayId, ofManager: managerId }, { "day.$": 1 })
                .then(response => {
                    if (response && response.day && response.day.length > 0) {
                        res.status(200).json(response.day[0]);
                    }
                });
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "An error occurred while removing the worker shift." });
        });
});

workerRouter.put('/WorkerShiftMessage', (req, res) => {
    const message = req.body.message;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const workerId = req.body.workerId;
    const shiftId = req.body.shiftId;
    const dayId = req.body.dayId;
    const managerId = req.body.managerId;

    Week.findOne({
        "day._id": dayId,
        "day.shifts._id": shiftId,
        ofManager: managerId
    })
        .then((week) => {
            if (!week) {
                return res.status(404).json({ error: "Week not found." });
            }

            const dayIndex = week.day.findIndex(d => d._id.toString() === dayId);
            if (dayIndex === -1) {
                return res.status(404).json({ error: "Day not found." });
            }

            const shiftIndex = week.day[dayIndex].shifts.findIndex(s => s._id.toString() === shiftId);
            if (shiftIndex === -1) {
                return res.status(404).json({ error: "Shift not found." });
            }

            const shiftDataIndex = week.day[dayIndex].shifts[shiftIndex].shiftData.findIndex(sd => sd.userId.toString() === workerId);
            if (shiftDataIndex === -1) {
                week.day[dayIndex].shifts[shiftIndex].shiftData.push({
                    userId: workerId,
                    message: message,
                    start: startTime,
                    end: endTime
                });
            } else {
                week.day[dayIndex].shifts[shiftIndex].shiftData[shiftDataIndex].message = message;
                week.day[dayIndex].shifts[shiftIndex].shiftData[shiftDataIndex].start = startTime;
                week.day[dayIndex].shifts[shiftIndex].shiftData[shiftDataIndex].end = endTime;
            }
            week.save()
                .then(updatedWeek => {
                    console.log(updatedWeek);
                    if (updatedWeek && updatedWeek.day && updatedWeek.day.length > 0) {
                        res.status(200).json(updatedWeek.day[dayIndex]);
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({ error: "An error occurred while updating the worker shift." });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: "An error occurred while finding the week." });
        });


});
workerRouter.put('/getMessageToWorker', (req, res) => {
    const workerId = req.body.workerId;
    const shiftId = req.body.shiftId;
    const dayId = req.body.dayId;
    const managerId = req.body.managerId;
    Week.findOne(
        {
            ofManager: managerId,
            "day._id": dayId,
            "day.shifts": {
                $elemMatch: {
                    _id: shiftId,
                    "shiftData.userId": workerId
                }
            }
        },
        {
            "day.shifts.$": 1
        }
    )
    .then(response => {
        if (response && response.day) {

            const shift = response.day[0].shifts.find(shift => shift._id.equals(shiftId));
            const shiftData = shift.shiftData.find(data => data.userId.equals(workerId));
            
            if (shiftData) {
                res.status(200).json(shiftData);
            } else {
                res.status(404).json({ message: "Shift data not found for the given worker" });
            }
        } else {
            res.status(404).json({ message: "Shift not found" });
        }
    }).catch(err => {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    });
});
module.exports = workerRouter