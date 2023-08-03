const express = require('express');
const roleRouter = express.Router();
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


roleRouter.use(bodyParser.json());

// create/POST role
roleRouter.post('/addRole', async (req, res) => {
    const role = new Role({
        manager: req.body.manager,
        name: req.body.name
    })
    try {
        const newRole = await role.save();
        res.status(201).json(newRole)
    } catch (err) {
        res.status(400).json({ messege: err.messege })
    }
});
//gets all the roles
roleRouter.post('/getRoles', authenticateToken, async (req, res) => {
    try {
        const managerId = req.body.managerId; 
        const roles = await Role.find({manager: managerId}, 'name');
        const roleNames = roles.map((role) => role);
        res.status(200).json(roleNames)
    } catch (err) {
        res.status(400).json({ messege: err.messege })
    }
});
//get role by id
roleRouter.get('/getRoleWithId/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findById(id);
        //const roleNames = roles.map((role) => role);
        res.status(200).json(role)
    } catch (err) {
        res.status(400).json({ messege: err.messege })
    }
});
roleRouter.delete('/deleteRole/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedRole = await Role.findByIdAndDelete(id);

        if (!deletedRole) {
            return res.status(404).json({ error: 'Role not found' });
        }

        res.json({ message: 'Role deleted successfully' });
    } catch (err) {
        res.status(400).json({ messege: err.messege })
    }
});
roleRouter.put('/putRole', async (req, res) => {
    try {
        const role = req.body;
        const putRole = await Role.findOneAndUpdate(role._id, role);

        res.status(200).json(putRole)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
});


// - - - - - - authenticateToken check - - - - - - - - 
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();

    });
}


module.exports = roleRouter