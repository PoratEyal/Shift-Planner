const express = require('express')
const router = express.Router()
const Role = require('../models/role');

// create role
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