const express = require('express');
const jobRouter = express.Router();
const Role = require('../models/role');
const User = require('../models/user');
const Shift = require('../models/shift');
const Day = require('../models/day');
const Week = require('../models/week');
const job = require('../models/job');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const { parse } = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const functions = require('../utils/functions');
const { Job } = require('node-schedule');
const ObjectId = mongoose.Types.ObjectId;

jobRouter.use(bodyParser.json());

jobRouter.post('/addJob', (req, res) => {
    job.create(req.body).then(job => {
        res.status(201).json(job);
    })
        .catch(err => {
            res.status(400).json(err.message);
        });
});


module.exports = jobRouter