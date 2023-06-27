const path = require('path');
const rootDir = require('../util/path');
const express = require('express');
const roleRouter = express.Router();
const Role = require('../models/role');

roleRouter.get('/addRole', (req, res)=>{
    res.sendFile(path.join(rootDir, "views", "addRole.html"))
});




// create/POST role
roleRouter.post('/addRole', async(req, res) => {
    const role = new Role({
        name: req.body.name
    });
    try{
        const newRole = await role.save();
        res.status(201);
        res.redirect('/');
        //res.json(newRole);
        
        //res;
    } catch(err) {
        res.status(400).json({messege: err.messege});
        res.redirect('/');
        res.end();
    };
});

//gets all the roles
roleRouter.get('/getRoles', async (req, res) => {
    try {
      const roles = await Role.find({}, 'name');
      const roleNames = roles.map((role) => role.name);
      res.status(200).json(roleNames);  
    } catch (err) {
      res.status(400).json({messege: err.messege})
    };
});

module.exports = roleRouter;