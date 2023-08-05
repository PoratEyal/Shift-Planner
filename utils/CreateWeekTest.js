const Week = require('../models/week');
const Day = require('../models/day');
const User = require('../models/user');

async function createWeekForManager(managerId) {
  const days = ['ראשון', 'שני', "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  try {
    const newWeek = await Week.create({ name: 'NextWeek', visible: false, publishScheduling: false, ofManager: managerId, day: [] });

    async function saveNextDay(index) {
      if (index >= days.length) {
        return newWeek.save();
      }
      const day = days[index];
      const newDay = await Day.create({ name: day, shifts: [] });
      newWeek.day.push(newDay);
      await newDay.save();
      return saveNextDay(index + 1);
    }

    await saveNextDay(0);
  } catch (error) {
    console.error(error);
  }
}

module.exports = createWeekForManager;
