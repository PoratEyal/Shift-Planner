
const Week = require('../models/week');
const Day = require('../models/day');
const User = require('../models/user');
const { response } = require('express');
function CreateWeek() {
  User.find({ manager: { $exists: false } }).exec().then(documents => {
    documents.forEach(document => {
      const id = document._id;
      const days = ['ראשון', 'שני', "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
      Week.create({ name: 'NextWeek', visible: false, publishScheduling: false, ofManager: id, day: [] })
        .then(newWeek => {
          const currentDate = new Date();
          const saveNextDay = index => {
            if (index >= days.length) {
              return newWeek.save();
            }
            const day = days[index];
            const futureDate = new Date(currentDate);
            futureDate.setDate(currentDate.getDate() + index);
            return Day.create({ name: day, shifts: [] , date: futureDate})
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
    });
  });
}

module.exports = CreateWeek