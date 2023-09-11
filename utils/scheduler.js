const schedule = require('node-schedule');
const Week = require('../models/week');
const createWeek = require('./functions');

const scheduleRule = new schedule.RecurrenceRule();
scheduleRule.dayOfWeek = 0; // Sunday
scheduleRule.hour = 0;      // 00:00
scheduleRule.minute = 0;    // 00 minutes
scheduleRule.tz = 'Asia/Jerusalem';


const currentDate = new Date();
const targetDate = new Date(currentDate.getTime() + 5 * 1000);
const job = schedule.scheduleJob(targetDate, yourFunction);


function yourFunction() {
  // Week.updateMany({name: "CurrentWeek"}, {name: "DataWeek"}).then((response) => {
  //   console.log(response);
  //   Week.updateMany({name: "NextWeek"}, {name: "CurrentWeek"}).then((response)=> {
  //     console.log(response);
       createWeek();
  //   });
  // });
}