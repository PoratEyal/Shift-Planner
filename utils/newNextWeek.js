const Week = require('../models/week');
const Day = require('../models/day');
const User = require('../models/user');
const { response } = require('express');
const { DateTime } = require('luxon');

function newNextWeek(id) {
    const israelTimezone = 'Asia/Jerusalem';
    const currentDateInIsrael = DateTime.now().setZone(israelTimezone);
    const daysUntilNextSunday = (7 - currentDateInIsrael.weekday + 7) % 7;
    console.log(daysUntilNextSunday);
    const days = ['ראשון', 'שני', "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    Week.create({ name: 'NextWeek', visible: false, publishScheduling: false, ofManager: id, usedAi: false, day: [] })
        .then(newWeek => {
            const saveNextDay = index => {
                if (index >= days.length) {
                    return newWeek.save();
                }
                const day = days[index];
                const futureDate = new Date(
                    currentDateInIsrael.year,
                    currentDateInIsrael.month - 1,
                    currentDateInIsrael.day + (index + daysUntilNextSunday),
                    currentDateInIsrael.hour,
                    currentDateInIsrael.minute,
                    currentDateInIsrael.second
                );
                futureDate.setMinutes(futureDate.getMinutes() + currentDateInIsrael.offset);

                return Day.create({ name: day, shifts: [], date: futureDate })
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
module.exports = newNextWeek