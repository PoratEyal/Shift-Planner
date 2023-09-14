const express = require('express');
const roleRouter = express.Router();
const Role = require('../models/role');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

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
roleRouter.post('/getRoleWithId', async (req, res) => {
    try {
        const { id } = req.body;

        Role.findById(id)
            .then((data) => {
                if (data) {
                    res.status(200).json(data.name);
                } else {
                    res.status(404).json({ message: 'Role not found' });
                }
            })
            .catch((error) => {
                console.error(error);
                res.status(500).json({ message: 'Internal server error' });
            });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
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