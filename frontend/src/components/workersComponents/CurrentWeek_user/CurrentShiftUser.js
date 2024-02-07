import React, { useEffect, useState } from "react";
import styles from './currentWeekUser.module.css';
import WorkersCurrentWeek from "./WorkersCurrentWeek";
import moment from "moment";

const CurrentShiftUser = (props) => {

    const [shift] = useState(props.shift);
    const [userId, setUserId] = useState("");
    const [addClass, setAddClass] = useState(false)
    const [showWorkers, setShow] = useState(false);
    
    useEffect(() => {
        const newdata = JSON.parse(localStorage.getItem("user"));
        setUserId(newdata._id);
    
        if (shift.workers.includes(newdata._id)) {
            setAddClass(true);
            setShow(true);
        } else {
            setAddClass(false);
        }
    }, [shift, userId]);

    return <div className={`${styles.shift} ${addClass ? styles.worksHer : ''}`}>
            <div>
            <p  className={styles.shift_name}>
                {shift.description}&nbsp;: {moment(shift.endTime).format('HH:mm')} - {moment(shift.startTime).format('HH:mm')}

                <label className={styles.icon_container}>
                    <input type="checkbox" onClick={() => {setShow(!showWorkers)}}></input >
                    <svg viewBox="0 0 512 512" height="1em" xmlns="http://www.w3.org/2000/svg" className={styles.chevron_down}>
                        <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path>
                    </svg>
                </label>
                {/* {showWorkers ? <FcExpand className={styles.under_icon}></FcExpand> : <FcPrevious className={styles.under_icon}></FcPrevious>} */}
            </p>
            </div>
            {showWorkers ? <WorkersCurrentWeek managerId={props.managerId} standBy={shift.standBy} workers={shift.workers} shiftData={shift.shiftData} endTime={shift.endTime} startTime={shift.startTime}></WorkersCurrentWeek> : null}
        </div>
}

export default CurrentShiftUser