import React, { useState } from "react";
import styles from '../createWeek/createWeek.module.css'
import axios from 'axios';
import ManegerWorkerList from '../current week shifts/maneger_workerList'

const MamegerShifts = (props) => {

    const [shift, setShift] = useState(props.shift);
    const data = JSON.parse(localStorage.getItem("user"));

    return <div className={styles.shift}>
        <p className={styles.shift_name}>{shift.description}</p>
        <p>משעה - {shift.startTime} עד {shift.endTime}</p>
        <ManegerWorkerList workers={shift.workers}></ManegerWorkerList>
    </div>
}

export default MamegerShifts