import React, { useEffect, useState } from "react";
import styles from '../CreateWeek/createWeek.module.css'
import axios from 'axios';
import CurrentWeekWorkers from './SeeWorkersCurrentWeek'

const SeeShiftCurrentWeek = (props) => {

    const [shift, setShift] = useState(props.shift);

    return <div className={styles.shift}>
        <p className={styles.shift_description}>{shift.description}: {shift.startTime} - {shift.endTime}</p>
        <CurrentWeekWorkers workers={shift.workers}></CurrentWeekWorkers>
    </div>
}

export default SeeShiftCurrentWeek