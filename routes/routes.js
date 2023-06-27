const express = require('express');
const router = express.Router();
const Role = require('../models/role');
const User = require('../models/user');
const Shift = require('../models/shift');
const Day = require('../models/day');
const job = require('../models/job');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { parse } = require('dotenv');
const path = require('path');

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
});
//gets all the roles
router.get('/getRoles', async (req, res) => {
    try {
      const roles = await Role.find({}, 'name');
      const roleNames = roles.map((role) => role);
      res.status(200).json(roleNames)  
    } catch (err) {
      res.status(400).json({messege: err.messege})
    }
});
//get role by id
router.get('/getRoleWithId/:id', async (req, res) => {
    try {
      const { id } = req.params;

      const role = await Role.findById(id);
      //const roleNames = roles.map((role) => role);
      res.status(200).json(role)  
    } catch (err) {
      res.status(400).json({messege: err.messege})
    }
});
router.delete('/deleteRole/:id', async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedRole = await Role.findByIdAndDelete(id);
  
      if (!deletedRole) {
        return res.status(404).json({ error: 'Role not found' });
      }
  
      res.json({ message: 'Role deleted successfully' });
    } catch (err) {
        res.status(400).json({messege: err.messege})
    }
  });
router.put('/putRole', async (req, res) =>{
    try{
        const role = new Role({
            _id: req.body._id,
            name: req.body.name
        });
        const putRole = await Role.findOneAndUpdate(role._id, role);
 
        res.status(200).json(putRole)
    } catch(err){
        res.status(400).json({message: err.message})
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
});
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
// edit user 
router.put('/editUser', (req, res) => {
try {
    
    //const salt = await bcrypt.genSalt();
    bcrypt.hash(req.body.password, 10).then(async (hash) => {
        const updatedUser = new User({
            _id: req.body._id,
            fullName: req.body.fullName,
            username: req.body.username,
            job: req.body.job,
            password: hash,
            role: req.body.role
        });
        const user = await User.findOneAndUpdate(updatedUser._id, updatedUser);
        user ? res.status(202).json(user) : res.status(404).json({ error: 'User not found' });
    });
    // bcrypt.compare(req.body.password, user.password).then((result) => {
    //     console.log(result);
    // });
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
});
//get all shifts
router.get('/getShifts', async (req, res) => {
    try{
        const shifts = await Shift.find();
        res.status(201).json(shifts)  
    } catch(err){
        res.status(400).json({message: err.message})
    }
});
//get one shift
router.get('/getShiftById/:id', async (req, res) => {
    try{
        const id = req.params.id
        const shift = await Shift.findById(id);
        res.status(201).json(shift)  
    } catch(err){
        res.status(400).json({message: err.message})
    }
});
//delete shift
router.delete('/deleteShift/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const shift = await Shift.findOneAndDelete(id);
        res.status(202).json(shift);
    } catch(err){
        res.status(400).json({message: err.message});
    }
});
//edit shift
router.put('/updateShift', async (req, res) => {
    try{
    const shift = new Shift({
        _id: req.body._id,
        description: req.body.description,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        workers: req.body.workers
    });
    const oldShift = await Shift.findOneAndUpdate(shift._id, shift);
    res.status(202).json(oldShift);
    }catch(err){
        res.status(400).json({message: err.message});
    }
});

// ---------------------------- Days funcs ---------------------------------------
// create/post Day
router.post('/addDay', async (req, res) => {
    try {
        const shifts = await Shift.find({_id: req.body.shifts});
        for(let i = 0; i < shifts.length; i++){
            shifts[i] = shifts[i]._doc
        }

        console.log(shifts);

        const day = new Day({
            name: req.body.name,
            shifts: shifts
        });
        //console.log(typeof(shifts));
        const newDay = await day.save();
        res.status(201).json(newDay);
    } catch(err) {
        res.status(400).json({messege: err._messege});
    }
});

//get days
router.get('/getDays', async (req, res) => {
    try{
        const days = await Day.find();
        res.status(200).json(days);
    } catch (err){
        res.status.json({message: err.message});
    }
});











module.exports = router