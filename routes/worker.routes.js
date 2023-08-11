const express = require('express');
const workerRouter = express.Router();
const Week = require('../models/week');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');

workerRouter.use(bodyParser.json());

// delete worker from workers list
// workerRouter.put('/removeWorkerFromWorkrs', (req, res) => {
//     const body = req.body;
//     const dayId = body.dayId;
//     const shiftId = body.shiftId;
//     const workerId = mongoose.Types.ObjectId(body.workerId);

//     Week.findOneAndUpdate(
//         { "day._id": dayId, "day.shifts._id": shiftId },
//         {
//             $pull: { 
//                 "day.$.shifts.$[elem].workers": workerId,
//                 "day.$.shifts.$[elem].$.shiftData": { userId: { $eq: workerId } }
//             },
//         },
//         { arrayFilters: [{ "elem._id": shiftId }], projection: { "day.$": 1 } })
//         .then(() => {
//             Week.findOne({ "day._id": dayId }, { "day.$": 1 }).then(response => {
//                 if (response && response.day && response.day.length > 0) {
//                     res.status(200).json(response.day[0]);
//                 }
//             });
//         })
//         .catch((err) => {
//             console.log(err);
//         });
// });

//----

//----

// working one !!!!!
// add worker to avialible workers list
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
// delete worker to avialible workers list
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
// add worker to workers list
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
                // "day.$.shifts.$[elem].shiftData": {
                //     //shiftId: shiftId,
                //     userId: workerId,
                //     message: "",
                //     start: null,
                //     end: null
                // }
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
// add worker to avialible workers list
workerRouter.put('/WorkersToAvail', (req, res) => {
    const body = req.body;
    const managerId = body.managerId;
    const dayId = body.dayId;
    const shiftId = body.shiftId;
    const workerId = body.workerId;

    Week.findOneAndUpdate(
        { "day._id": dayId, "day.shifts._id": shiftId, ofManager: managerId }, // Include 'ofManager' to filter by managerId
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

// workerRouter.put('/WorkerShiftMessage', (req, res) => {
//     const message = req.body.message;
//     const startTime = req.body.startTime;
//     const endTime = req.body.endTime;
//     const workerId = req.body.workerId;
//     console.log(workerId);

//     const shiftId = req.body.shiftId;
//     console.log(shiftId)
//     const dayId = req.body.dayId;
//     console.log(dayId);
//     const managerId = req.body.managerId;
//     Week.findOneAndUpdate({ "day._id": dayId, "day.shifts._id": shiftId, ofManager: managerId },
//     {
//         $set: {
//           "day.$[dayElem].shifts.$[shiftElem].shiftData.$[dataElem].message": message,
//           "day.$[dayElem].shifts.$[shiftElem].shiftData.$[dataElem].start": startTime,
//           "day.$[dayElem].shifts.$[shiftElem].shiftData.$[dataElem].end": endTime,
//         }
//     },
//     {
//         arrayFilters: [
//           { "dayElem._id": dayId },
//           { "shiftElem._id": shiftId },
//           { "dataElem.userId": new ObjectId(workerId) }
//         ],
//         upsert: true,
//         useFindAndModify: false,
//         new: true,
//     }
//     ).then((response) => {
//         console.log(response)
//         Week.findOne({ "day._id": dayId, ofManager: managerId }, { "day.$": 1 })
//             .then(response => {
//                 if (response && response.day && response.day.length > 0) {
//                     res.status(200).json(response.day[0]);
//                 }
//             });
//     })
//     .catch((err) => {
//         console.log(err);
//         res.status(500).json({ error: "An error occurred while removing the worker shift." });
//     });

// });
workerRouter.put('/WorkerShiftMessage', (req, res) => {
    const message = req.body.message;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const workerId = req.body.workerId;
    const shiftId = req.body.shiftId;
    const dayId = req.body.dayId;
    const managerId = req.body.managerId;

    const filter = {
        "day._id": dayId,
        "day.shifts._id": shiftId,
        "day.shifts.shiftData.userId": workerId,
        ofManager: managerId
    };

    const update = {
        $set: {
            "day.$[dayElem].shifts.$[shiftElem].shiftData.$[dataElem].message": message,
            "day.$[dayElem].shifts.$[shiftElem].shiftData.$[dataElem].start": startTime,
            "day.$[dayElem].shifts.$[shiftElem].shiftData.$[dataElem].end": endTime,
        }
    };

    const arrayFilters = [
        { "dayElem._id": dayId },
        { "shiftElem._id": shiftId },
        { "dataElem.userId": workerId } // Assuming workerId is a string, not an ObjectId
    ];

    const options = {
        arrayFilters,
        upsert: true,
        //useFindAndModify: false,
        new: true,
    };

    Week.findOneAndUpdate(filter, update, options)
        .then((response) => {
            console.log(response);
            if (response && response.day && response.day.length > 0) {
                res.status(200).json(response.day[0]);
            }
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "An error occurred while updating the worker shift." });
        });
});

module.exports = workerRouter