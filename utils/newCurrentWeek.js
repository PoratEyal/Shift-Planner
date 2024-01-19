const Week = require('../models/week');
const Day = require('../models/day');
const User = require('../models/user');
const { response } = require('express');
const { DateTime } = require('luxon');

function newCurrentWeek(id) {
    const israelTimezone = 'Asia/Jerusalem';
    const currentDateInIsrael = DateTime.now().setZone(israelTimezone);
    const daysUntilNextSunday = (7 - currentDateInIsrael.weekday + 7) % 7;
    const days = ['ראשון', 'שני', "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    Week.create({ name: 'CurrentWeek', visible: false, publishScheduling: false, ofManager: id, usedAi: false, day: [] })
        .then(newWeek => {
            const saveNextDay = (index, daysToAdd) => {
                if (index >= days.length) {
                    return newWeek.save();
                }
                const day = days[index];
                const futureDate = new Date(
                    currentDateInIsrael.year,
                    currentDateInIsrael.month - 1,
                    currentDateInIsrael.day + (daysToAdd),
                    currentDateInIsrael.hour,
                    currentDateInIsrael.minute,
                    currentDateInIsrael.second
                );
                futureDate.setMinutes(futureDate.getMinutes() + currentDateInIsrael.offset);

                return Day.create({ name: day, shifts: [], date: futureDate })
                    .then(newDay => {
                        newWeek.day.push(newDay);
                        return newDay.save().then(() => {
                            saveNextDay(index + 1, daysToAdd+1);
                        });
                    });
            };
            if (currentDateInIsrael.weekday === 7) {
                return saveNextDay(0,0);
            }
            else {
                return saveNextDay(currentDateInIsrael.weekday,0);
            }
        })
        .catch(error => {
            console.error(error);
        });

}
module.exports = newCurrentWeek