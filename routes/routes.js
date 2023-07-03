const express = require('express');
const router = express.Router();
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


router.use(bodyParser.json());
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
router.get('/getRoles', authenticateToken, async (req, res) => {
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
        const role = req.body;
        const putRole = await Role.findOneAndUpdate(role._id, role);
 
        res.status(200).json(putRole)
    } catch(err){
        res.status(400).json({message: err.message})
    }
});
//-----------------------------job funcs -------------------------------------
router.post('/addJob', (req, res) => {
    job.create(req.body).then(job => {
        res.status(201).json(job);
    })
    .catch(err =>{
        res.status(400).json(err.message);
    });
});

// ---------------------------- USER funcs ---------------------------------------
// create/POST user
router.post('/addUser', async (req, res) => {
    // try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt).then((password) =>{
            let user = req.body;
            user.password = password;
            
            Role.findOne({_id: user.role}).then((role) => {
                user.role = role._doc._id;

                job.findOne({name: user.job}).then(job => {
                    user.job = job._doc._id
                    User.create(user).then(user => {
                        res.status(201).json(user);
                    }).catch(err => {
                        
                        res.status(400).json({messege: err.messege})
                    });
                });
            });
        });
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
//login
router.post('/login', async (req, res) => {
    await User.findOne({username: req.body.username}).then(user => {        
         bcrypt.compare(req.body.password, user.password).then((result) => {
                 if(result === true){
                    const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
                    user.token = accessToken;
                    res.status(200).json(user);
                 }
                 else{
                    res.status(400);
                 }
             });
        })
        .catch(err => {
            res.status(404).json({message: err});
        });
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
        let updatedUser = req.body;
        updatedUser.password = hash;
        const user = await User.findByIdAndUpdate({_id: updatedUser._id}, updatedUser).then(user => {

            res.status(202).json(user); 
        }).catch(err => {

            res.status(404).json({ error: err.message });
        }); 
    });
    
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
        const shift = await Shift.findByIdAndDelete(id);
        res.status(202).json(shift);
    } catch(err){
        res.status(400).json({message: err.message});
    }
});
//edit shift
router.put('/updateShift', async (req, res) => {
    try {
      const shift = req.body;
      const oldShift = await Shift.findOneAndUpdate({ _id: shift._id }, shift);
      res.status(202).json(oldShift);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// ---------------------------- Days funcs ---------------------------------------
// create/post Day
router.post('/addDay', async (req, res) => {
    Day.create(req.body).then((obj) => {
        res.status(201).json(obj);
    }).catch(err =>{
        res.status(400).json({messege: err._messege});
    });
});
//get days
router.get('/getDays', async (req, res) => {
    await Day.find()
    .then(days =>{
        res.status(200).json(days);
    })
    .catch(err => {
        res.status.json({message: err.message});
    });
});
//get one day
router.get('/getDay/:id', async (req, res) => {
    await Day.findById(req.params.id)
    .then(day => {
        if(day){
            res.status(200).json(day)
         }else { 
            throw new Error("no such day was found");
        }
    })
    .catch(err => {
    res.status(400).json({message: err.Error});
    });
});
//delete day
router.delete('/deleteDay/:id', async (req, res) => {
    try{
        const id = req.params.id;
        const deleted = await Day.findOneAndDelete(id);
        res.status(202).json(deleted);
    }catch(err){
        res.status(400).json({message: err._messege})
    }
});
//edit day
router.put('/editDay', async (req, res) => {
    try{
        let reqBody = req.body;
        const oldDay = await Day.findByIdAndUpdate(reqBody._id, reqBody);
        res.status(200).json(oldDay);
    }catch(err){
        res.status(400).json({message: err._messege});
    }

});


//------------------------------Week funcs --------------------------------------------
router.get('/getWeekByName/:name', async(req, res) => {
    try{
        const name = req.params.name;
        const week = await Week.findOne({name: name});
        res.status(200).json(week);
    }catch(err){
        res.status(400).json(err);
    }
});
router.post('/addWeek', async (req,res) => {
    Week.create(req.body).then((obj) => {
        res.status(201).json(obj);
    }).catch(err =>{
        res.status(400).json({messege: err._messege});
    });
});

router.put('/editWeek', async (req, res) => {
    try{
        let reqBody = req.body;
        const oldWeek = await Week.findOne(reqBody._id, reqBody);
        res.status(200).json(oldWeek);
    }catch(err){
        res.status(400).json({message: err._messege});
    }

});


//-----------------------functions------------------
function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}




module.exports = router