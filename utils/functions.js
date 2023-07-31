
const Week = require('../models/week');
const Day = require('../models/day');
const { response } = require('express');
function CreateWeek(){
    const days = ['ראשון', 'שני', "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    Week.create({ name: 'NextWeek', visible: false, publishScheduling:false, ofManager:'64c259e1933a450465d6b292', day: [] })
    .then(newWeek => {
      const saveNextDay = index => {
        if (index >= days.length) {
          return newWeek.save();
        }
        const day = days[index];
        return Day.create({ name: day, shifts: [] })
          .then(newDay => {
            newWeek.day.push(newDay);
            return newDay.save().then(() => {
                saveNextDay(index + 1);
            });
          });
      };
      return saveNextDay(0);
    })
    .catch(error => {
      console.error(error);
    });
  }

module.exports = CreateWeek