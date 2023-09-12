const express = require('express');
const DSRouter = express.Router();
const defShifts = require('../models/defaultShifts');
const Shift = require('../models/shift');
const bodyParser = require('body-parser');

DSRouter.use(bodyParser.json());

DSRouter.post('/getDefShifts', async (req, res) => {
    const managerId = req.body.managerId;
    try {
        const response = await defShifts.findOne({ ofManager: managerId });
        if (response) {
            res.status(200).json(response.shifts);
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
                res.status(200).json(response.shifts);
            }
        }
    }
    catch (err) {
        console.log(err);
        res.status(404);
    }


});
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
        endTime: et
    });
    const response = await defShifts.findOne({ofManager: rewBody.managerId});
    if(response.shifts.length < response.maxAmount){
        response.shifts.push(shift);
        response.save().then(() => {
            console.log(response)
            res.status(200).send(response.shifts);
        })
    }
    else{
        res.status(204)
    }
    console.log(shift);
});
module.exports = DSRouter