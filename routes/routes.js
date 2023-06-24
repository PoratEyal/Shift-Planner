const express = require('express')
const router = express.Router()
const {User, Role} = require('../models/db');
const { model } = require('mongoose');

router.post('/addRule', (req, res) => {
    const role = new Role({
        name: req.body.name
    })
    role.save()
    .then(data => {
        res.json(data)
    })
    .catch(error => {
        res.json(error)
    })
})

module.exports = router