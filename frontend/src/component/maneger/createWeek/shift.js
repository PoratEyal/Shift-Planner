import React, { useState } from "react";
import styles from '../createWeek/createWeek.module.css'

const Shift = (props) => {

    const [shift, setShift] = useState(props.shift);

    return <div className={styles.shift}>
        <p>{shift.description}</p>
        <p>משעה - {shift.startTime} עד {shift.endTime}</p>
        {/* <p>workers:</p>
        {
           shift.workers ? shift.workers.map((worker) => {return <p>worker</p>}) : null
        } */}
    </div>
}

export default Shift