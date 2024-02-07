import React, { useState } from "react";
import styles from './seeCurrentWeek.module.css';
import CurrentWeekWorkers from './SeeWorkersCurrentWeek';
import moment from "moment";
import { FcPrevious } from "react-icons/fc";
import { FcExpand } from "react-icons/fc";

const SeeShiftCurrentWeek = (props) => {

    const [shift] = useState(props.shift);
    const [showWorkers, setShow] = useState(props.openShift);

    return <div className={styles.shift}>
          <p className={styles.shift_description}>
            {shift.description}&nbsp;: {moment(shift.endTime).format('HH:mm')} - {moment(shift.startTime).format('HH:mm')}
            
            <label  className={styles.icon_container}>
              <input type="checkbox" onClick={() => {setShow(!showWorkers)}}></input >
              <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg" className={styles.chevron_down}>
                <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
              </svg>
            </label>
            
            {/* {!showWorkers ? 
              <FcPrevious className={styles.under_icon}></FcPrevious>
            : 
              <FcExpand className={styles.under_icon}></FcExpand>} */}
          </p>
        { showWorkers ?<CurrentWeekWorkers managerId={props.managerId} standBy={shift.standBy} workers={shift.workers} shiftData={shift.shiftData} endTime={shift.endTime} startTime={shift.startTime}></CurrentWeekWorkers> : null }
    </div>
}

export default SeeShiftCurrentWeek