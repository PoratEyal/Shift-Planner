import React, { useState, useEffect } from 'react';
import styles from './currentWeekUser.module.css';
import Shift from './CurrentShiftUser';
import moment from "moment";

const CurrentDayUser = (props) => {

  const [day] = useState(props.day);

  useEffect(() => {
    const today = moment().format('YYYY-MM-DD');
    if (moment(day.date).format('YYYY-MM-DD') === today && day.name !== "ראשון") {
        const scrollTimeout = setTimeout(() => {
            const dayContainer = document.getElementById(`day_${day.date}`);
            if (dayContainer) {
                const targetPosition = dayContainer.getBoundingClientRect().top + window.scrollY - 100;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }, 1300);

        return () => clearTimeout(scrollTimeout);
    }
  }, [day.date]);

  return (
    <div>
      <div className={styles.day_container} id={`day_${day.date}`}>
        <div className={styles.h2_div}>
          <h2 className={styles.h2}>{day.name} - {moment(day.date).utc().format('DD.MM')}</h2>
        </div>

        {day.shifts?.length === 0 ? (
          <div className={styles.no_shifts_message}>אין משמרות ליום זה</div>
        ) : (
          day.shifts.map((shift) => (
            <Shift managerId={props.managerId} key={shift._id} shift={shift}></Shift>
          ))
        )}

      </div>
    </div>
  );
};

export default CurrentDayUser;
