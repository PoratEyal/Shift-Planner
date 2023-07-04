const schedule = require('node-schedule');

// Define the schedule rule for running the function at the start of Sunday
const scheduleRule = new schedule.RecurrenceRule();
scheduleRule.dayOfWeek = 0; // Sunday (0)
scheduleRule.hour = 0;      // 00:00 (midnight)
scheduleRule.minute = 0;    // 00 minutes

// Schedule the function to run at the start of every Sunday
const job = schedule.scheduleJob(scheduleRule, yourFunction);

// Define the function that will be called at the start of every Sunday
function yourFunction() {
  console.log('Function called at the start of Sunday!');
  // Place your code here to be executed at the start of Sunday
}


