const express = require('express')
const router = express.Router()
const Role = require('../models/role')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')

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

// create user
router.post('/addUser', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // const role = new Role({
        //   name: "developer"
        // });

        const user = new User({
        fullName: req.body.fullName,
        username: req.body.username,
        password: hashedPassword,
        role: req.body.role
        });
        const newUser = await user.save();
        res.status(201).json(newUser)
        } catch(err) {
            res.status(401).json({messege: err.messege})
        }
})

module.exports = router