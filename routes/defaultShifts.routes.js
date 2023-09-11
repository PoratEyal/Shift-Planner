const express = require('express');
const DSRouter = express.Router();
const defShifts = require('../models/defaultShifts');

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
module.exports = DSRouter