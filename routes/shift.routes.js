const express = require('express');
const shiftRouter = express.Router();
const User = require('../models/user');
const Shift = require('../models/shift');
const bodyParser = require('body-parser');

shiftRouter.use(bodyParser.json());

// create/post shift
shiftRouter.post('/addShift', (req, res) => {
    User.find({ fullName: req.body.workers }).then(data => {
        const workers = data
        const shift = new Shift({
            description: req.body.description,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            workers: workers
        })
        shift.save().then(data => {
            const newShift = data
            res.status(201).json(newShift)
        })
    })
        .catch((err) => {
            res.status(400).json({ messege: err.messege })
        })
});

//get all shifts
// shiftRouter.get('/getShifts', async (req, res) => {
//     try {
//         const shifts = await Shift.find();
//         res.status(201).json(shifts)
//     } catch (err) {
//         res.status(400).json({ message: err.message })
//     }
// });
//get one shift
// shiftRouter.get('/getShiftById/:id', async (req, res) => {
//     try {
//         const id = req.params.id
//         const shift = await Shift.findById(id);
//         res.status(201).json(shift)
//     } catch (err) {
//         res.status(400).json({ message: err.message })
//     }
// });

//delete shift
// shiftRouter.delete('/deleteShift/:id', async (req, res) => {
//     try {
//         const id = req.params.id;
//         const shift = await Shift.findByIdAndDelete(id);
//         res.status(202).json(shift);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });

//edit shift
// shiftRouter.put('/updateShift', async (req, res) => {
//     try {
//         const shift = req.body;
//         const oldShift = await Shift.findOneAndUpdate({ _id: shift._id }, shift);
//         res.status(202).json(oldShift);
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// });


module.exports = shiftRouter