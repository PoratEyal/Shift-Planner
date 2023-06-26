const express = require('express')
const router = express.Router()
const Role = require('../models/role')
const User = require('../models/user')
const Shift = require('../models/shift')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const { parse } = require('dotenv')

// ---------------------------- ROLE funcs ---------------------------------------

// create/POST role
router.post('/addRole', async(req, res) => {
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

//gets all the roles
router.get('/getRoles', async (req, res) => {
    try {
      const roles = await Role.find({}, 'name');
      const roleNames = roles.map((role) => role.name);
      res.status(201).json(roleNames)  
    } catch (err) {
      res.status(400).json({messege: err.messege})
    }
});


// ---------------------------- USER funcs ---------------------------------------

// create/POST user
router.post('/addUser', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const role = await Role.findOne({name: req.body.role})

        const user = new User({
            fullName: req.body.fullName,
            username: req.body.username,
            password: hashedPassword,
            role: role._id
        })
        const newUser = await user.save()
        res.status(201).json(newUser)
        } catch(err) {
            res.status(400).json({messege: err.messege})
        }
})

//gets all the users
router.get('/getUsers', async (req, res) => {
    try {
        const users = await User.find().populate('role');
        res.status(201).json(users)  
    } catch (err) {
        res.status(400).json({messege: err.messege})
    }
});

//delete user by id
router.delete('/deleteUser/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedUser = await User.findByIdAndDelete(id);
  
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(400).json({messege: err.messege})
    }
  });

// edit user - - - - - - - didnt checked yet
router.put('/editUser/:id', async (req, res) => {
try {
    const { id } = req.params;
    const updatedUser = req.body;

    const user = await User.findByIdAndUpdate(id, updatedUser, { new: true });

    if (!user) {
    return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
} catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
}
});


// ---------------------------- SHIFT funcs ---------------------------------------

// create/post shift
router.post('/addShift', async (req, res) => {
    try {
        const workers = await User.find({fullName: req.body.workers})
        //const workers = await User.find({fullName: req.body.workers})
        console.log(workers)

        const shift = new Shift({
            description: req.body.description,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            workers: workers
        })
        const newShift = await shift.save()
        res.status(201).json(newShift)
    } catch(err) {
        res.status(400).json({messege: err.messege})
    }
})




module.exports = router