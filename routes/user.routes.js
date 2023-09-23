const express = require('express');
const userRouter = express.Router();
const Role = require('../models/role');
const User = require('../models/user');
const job = require('../models/job');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const ObjectId = mongoose.Types.ObjectId;

userRouter.use(bodyParser.json());

// get the manager id and return the count of his workers
userRouter.put('/workersCountOfManager', async (req, res) => {
    const managerId = req.body.managerId;

    try {
        await User.find({ manager: managerId }).then(data => {
            res.status(200).json(data.length - 1);
    })
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// create/POST user
userRouter.post('/addUser', async (req, res) => {
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        let user = req.body;
        user.password = hashedPassword;

        const role = await Role.findOne({ _id: user.role });
        user.role = role._doc;
        console.log(role);
        const jobRes = await job.findOne({ name: user.job });
        user.job = jobRes._doc._id;

        const createdUser = await User.create(user);

        res.status(201).json(createdUser);
    }
    catch (err) {
        res.status(400).json({ message: 'An error occurred while processing the request.' });
    }
});

// get all workers
userRouter.post(`/getAllWorkers`, (req, res) => {
    const shiftWorkers = req.body;
    const convertedArr = shiftWorkers.workers.map(id => new ObjectId(id))
    User.find({ _id: { $nin: convertedArr }, manager: shiftWorkers.manager }, { _id: 1, fullName: 1 }).then(data => {
        res.status(200).json(data)
    }).catch(err => {
        console.log(err);
    });
});

userRouter.post('/rolesToShow', (req, res) => {
    const id = req.body.id;
    const roleStatus = req.body.roleStatus;

    User.findById(id)
        .then((user) => {
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            // Update the useRoles field with the roleStatus
            user.useRoles = roleStatus;

            // Save the updated user
            return user.save();
        })
        .then((updatedUser) => {
            res.json({ message: 'useRoles field updated successfully', user: updatedUser });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Internal server error', details: error.message });
        });
});


userRouter.post('/getMyWorkers', (req, res) => {
    const job = req.body.job;
    User.find({ manager: new ObjectId(job) }).then(data => {
        res.status(200).json(data);
    }).catch(err => {
        console.error(err);
    });
});

//gets id and return user
userRouter.post('/getUserById', (req, res) => {
    const id = req.body.id;
    User.findById(id)
        .then((data) => {
            const user = data;
            res.status(200).json(user);
        })
        .catch(err => {
            res.status(400).json({ message: err.message });
        });
});

userRouter.get('/GetUserRole', authenticateToken, (req, res) => {
    if (req.user.job === '649c08040834b0d306adef45' || req.user.job === "64c259551a5f2d4dca3424bb") {
        const resRole = {
            job: "admin"
        }
        return res.status(200).json(resRole);
    }
    else if (req.user.job === '649d571b70f2c12b782d204f' || req.user.job === "64c2594b1a5f2d4dca3424b9") {
        const resRole = {
            job: "user"
        }
        return res.status(200).json(resRole);
    }
    else {
        return res.sendStatus(403);
    }
});


//login
userRouter.post('/login', async (req, res) => {
    await User.findOne({ username: `${req.body.username}` }).then(user => {
        bcrypt.compare(req.body.password, user.password).then((result) => {
            if (result === true) {
                const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_TOKEN_SECRET);
                user.token = accessToken;
                res.status(200).json(user);
            }
            else {
                res.status(201).json({ error: 'Unauthorized' });
            }
        }).catch(() => {
            res.status(201).json({ error: 'Unauthorized' });
        });
    })
        .catch(err => {
            res.status(201).json({ error: 'Unauthorized' });
        });
});

//delete user by id
userRouter.delete('/deleteUser/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(400).json({ messege: err.messege })
    }
});

// edit user 
userRouter.put('/editUser', (req, res) => {
    //const salt = await bcrypt.genSalt();
    bcrypt.hash(req.body.password, 10)
        .then((hash) => {
            let updatedUser = req.body;
            updatedUser.password = hash;
            User.findByIdAndUpdate({ _id: updatedUser._id }, updatedUser)
                .then(user => {
                    res.status(202).json(user);
                })
                .catch(err => {
                    res.status(404).json({ error: err.message });
                });
        });
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


module.exports = userRouter