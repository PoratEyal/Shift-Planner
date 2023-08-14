import React, { useEffect, useState } from "react";
import styles from '../CreateWeek/createWeek.module.css';
import CurrentWeekWorkers from './SeeWorkersCurrentWeek';
import moment from "moment";

const SeeShiftCurrentWeek = (props) => {

    const [shift, setShift] = useState(props.shift);
    const [showWorkers, setShow] = useState(false);

    return <div className={styles.shift} onClick={() => {setShow(!showWorkers)}}>
          <p className={styles.shift_description}>
              {shift.description}&nbsp;: {moment(shift.endTime).format('HH:mm')} - {moment(shift.startTime).format('HH:mm')}
          </p>
        { showWorkers ?<CurrentWeekWorkers managerId={props.managerId} workers={shift.workers}></CurrentWeekWorkers> : null }
    </div>
}

export default SeeShiftCurrentWeek