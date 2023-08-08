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
const routeGPT = require('./routes/gpt.routes');
const routeMessage = require('./routes/message.routes');


// database area
mongoose.connect(process.env.DATABASE_ACCESS, { useNewUrlParser: true });
const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to Database...'))


// app area
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
var allowedDomains = process.env.ALLOWED_DOMAINS.split(", ");
console.log(allowedDomains);
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        console.log(origin);
        if (!allowedDomains.includes(origin)) {
          var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      }
}));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });
app.use('/app', routeDay);
app.use('/app', routeJob);
app.use('/app', routeRole);
app.use('/app', routeShift);
app.use('/app', routeUser);
app.use('/app', routeWeek);
app.use('/app', routeWorker);
app.use('/app', routeGPT);
app.use('/app', routeMessage);

app.listen(process.env.PORT || 3001, () => console.log("server is runing..."));

