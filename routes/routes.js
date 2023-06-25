const express = require('express')
const router = express.Router()
const Role = require('../models/role');

// create role
router.post('/', async(req, res) => {
    const role = new Role({
        name: req.body.name
    })
    try{
        const newRole = await role.save();
        res.status(201).json(newRole)
    } catch(err) {
        res.status(400).json({messege: err.messege})
    }
})

module.exports = router