const express = require('express');
const DSRouter = express.Router();
const defShifts = require('../models/defaultShifts');
const Shift = require('../models/shift');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');


DSRouter.use(bodyParser.json());

DSRouter.post('/getDefShifts', async (req, res) => {
    const managerId = req.body.managerId;
    try {
        const response = await defShifts.findOne({ ofManager: managerId });
        if (response) {
            res.status(200).send(response.shifts);
        }
        else {
            const newDefShifts = {
                ofManager: managerId,
                maxAmount: 4,
                shifts: []
            }
            await defShifts.create(newDefShifts);
            const response = await defShifts.findOne({ ofManager: managerId });
            if (response) {
                res.status(200).send(response.shifts);
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(404);
    }


});
DSRouter.put('/deleteShift', async (req, res) => {
    reqBody = req.body;
    const response = await defShifts.findOne({ ofManager: reqBody.managerId });
    const index = response.shifts.findIndex(shift => String(shift._id) === (reqBody.shiftId));
    if(index !== -1){
        response.shifts.splice(index, 1);
        await response.save();
        res.status(200).send(response.shifts);
    }
});
DSRouter.put('/changeShift', async (req, res) => {
    reqBody = req.body;

    const st = new Date(`1970-01-01T${reqBody.startTime}:00Z`);
    const et = new Date(`1970-01-01T${reqBody.endTime}:00Z`);

    const response = await defShifts.findOne({ ofManager: reqBody.managerId });

      
    const shift = response.shifts.find(shift => String(shift._id) === (reqBody.shiftId));
    if (shift) {
        shift.description = reqBody.name;
        shift.startTime = st;
        shift.endTime = et;
        shift.amountOfWorkers = reqBody.numberOfWorkers;
        await response.save();
        res.status(200).send(shift);
    } else {
        res.status(200);
    }

})
DSRouter.put('/addNewShift', async (req, res) => {
    rewBody = req.body;
    console.log(rewBody);
    const st = new Date(`1970-01-01T${rewBody.startTime}:00Z`);
    const et = new Date(`1970-01-01T${rewBody.endTime}:00Z`);
    const shift = new Shift({
        availableWorkers: [],
        description: rewBody.name,
        shiftData: [],
        workers: [],
        startTime: st,
        endTime: et,
        amountOfWorkers: rewBody.amountOfWorkers
    });
    const response = await defShifts.findOne({ ofManager: rewBody.managerId });
    if (response.shifts.length < response.maxAmount) {
        response.shifts.push(shift);
        response.save().then(() => {
            res.status(200).send(response.shifts);
        })
    }
    else {
        res.status(204)
    }
});
module.exports = DSRouter