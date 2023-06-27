// import area
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const routesUrls = require('./routes/routes');
const cors = require('cors');

const roleData = require('../routes/roleRoutes');

// database area
mongoose.connect(process.env.DATABASE_ACCESS, { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to Database'))

// app area
app.use(express.json());
app.use(cors());
app.use('/app', routesUrls);
app.use(roleData);
app.listen(3001, () => console.log("server is runing"));