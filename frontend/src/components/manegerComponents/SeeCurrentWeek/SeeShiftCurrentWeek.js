import React, { useState } from "react";
import styles from './seeCurrentWeek.module.css';
import CurrentWeekWorkers from './SeeWorkersCurrentWeek';
import moment from "moment";
import { FcPrevious } from "react-icons/fc";
import { FcExpand } from "react-icons/fc";

const SeeShiftCurrentWeek = (props) => {

    const [shift] = useState(props.shift);
    const [showWorkers, setShow] = useState(props.openShift);

    return <div className={styles.shift} onClick={() => {setShow(!showWorkers)}}>
          <p className={styles.shift_description}>
            {shift.description}&nbsp;: {moment(shift.endTime).format('HH:mm')} - {moment(shift.startTime).format('HH:mm')}
            {!showWorkers ? <FcPrevious className={styles.under_icon}></FcPrevious> : <FcExpand className={styles.under_icon}></FcExpand>}
          </p>
        { showWorkers ?<CurrentWeekWorkers managerId={props.managerId} standBy={shift.standBy} workers={shift.workers} shiftData={shift.shiftData} endTime={shift.endTime} startTime={shift.startTime}></CurrentWeekWorkers> : null }
    </div>
}

export default SeeShiftCurrentWeek