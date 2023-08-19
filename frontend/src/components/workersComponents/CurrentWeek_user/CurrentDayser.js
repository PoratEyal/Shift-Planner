import React, { useState } from 'react';
import styles from './currentWeekUser.module.css';
import Shift from './CurrentShiftUser';
import moment from "moment";

const CurrentDayUser = (props) => {

  const [day] = useState(props.day);

  return (
    <div>
      <div className={styles.day_container}>
        
        <h2 className={styles.h2}>{day.name} - {moment(day.date).format('DD.MM')}</h2>

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
