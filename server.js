// import area
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const routesUrls = require('./routes/routes');
const cors = require('cors');


// database area
mongoose.connect(process.env.DATABASE_ACCESS, { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to Database...'))

// app area
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
app.use('/app', routesUrls);
app.listen(3001, () => console.log("server is runing..."));

require('./scheduler');