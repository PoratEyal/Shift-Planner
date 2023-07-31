// import area
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
require('./utils/scheduler');
const routeDay = require('./routes/day.routes');
const routeJob = require('./routes/job.routes');
const routeRole = require('./routes/role.routes');
const routeShift = require('./routes/shift.routes');
const routeUser = require('./routes/user.routes');
const routeWeek = require('./routes/week.routes');
const routeWorker = require('./routes/worker.routes');
// database area
mongoose.connect(process.env.DATABASE_ACCESS, { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to Database...'))
// app area
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());
//app.use('/app', routesUrls);
app.use('/app', routeDay);
app.use('/app', routeJob);
app.use('/app', routeRole);
app.use('/app', routeShift);
app.use('/app', routeUser);
app.use('/app', routeWeek);
app.use('/app', routeWorker);

app.listen(process.env.PORT || 3001, () => console.log("server is runing..."));

