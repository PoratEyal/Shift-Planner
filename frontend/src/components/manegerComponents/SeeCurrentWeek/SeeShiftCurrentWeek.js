import React, { useEffect, useState } from "react";
import styles from '../CreateWeek/createWeek.module.css'
import CurrentWeekWorkers from './SeeWorkersCurrentWeek'

const SeeShiftCurrentWeek = (props) => {

    const [shift, setShift] = useState(props.shift);
    const [showWorkers, setShow] = useState(false);

    return <div className={styles.shift} onClick={() => {setShow(!showWorkers)}}>
        <p className={styles.shift_description}>{shift.description}&nbsp;: {shift.endTime} - {shift.startTime}</p>
        { showWorkers ?<CurrentWeekWorkers managerId={props.managerId} workers={shift.workers}></CurrentWeekWorkers> : null }
    </div>
}

export default SeeShiftCurrentWeek