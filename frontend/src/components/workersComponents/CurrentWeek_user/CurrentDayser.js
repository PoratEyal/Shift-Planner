import React, { useState } from 'react';
import styles from './currentWeekUser.module.css';
import Shift from './CurrentShiftUser'

const CurrentDayUser = (props) => {

  const [day] = useState(props.day);

  return (
    <div>
      <div className={styles.day_container}>
        <h2 className={styles.h2}>{day.name}</h2>
        {day.shifts.map((shift) => {
          return <Shift key={shift._id} shift={shift}></Shift>;
        })}
      </div>
    </div>
  );
};

export default CurrentDayUser;
