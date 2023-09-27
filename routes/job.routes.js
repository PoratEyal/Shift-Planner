const express = require("express");
const jobRouter = express.Router();
const job = require("../models/job");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

jobRouter.use(bodyParser.json());

jobRouter.post("/addJob", (req, res) => {
    job.create(req.body)
        .then((job) => {
            res.status(201).json(job);
        })
        .catch((err) => {
            res.status(400).json(err.message);
        });
});

module.exports = jobRouter;
