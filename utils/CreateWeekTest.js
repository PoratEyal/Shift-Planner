const Week = require('../models/week');
const Day = require('../models/day');

async function createWeekForManager(managerId) {
  const days = ['ראשון', 'שני', "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
  try {
    const newWeek = await Week.create({ name: 'NextWeek', visible: false, publishScheduling: false, ofManager: managerId, usedAi: false, day: [] });

    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    
    async function saveNextDay(index) {
      if (index >= days.length) {
        return newWeek.save();
      }
      futureDate.setDate(currentDate.getDate() + index);
      const day = days[index];
      const newDay = await Day.create({ name: day, shifts: [], date: futureDate});
      newWeek.day.push(newDay);
      await newDay.save();
      return saveNextDay(index + 7);
    }

    await saveNextDay(0);
  } catch (error) {
    console.error(error);
  }
}

module.exports = createWeekForManager;
