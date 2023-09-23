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
            <div  onClick={() => {setShow(!showWorkers)}}>
            <p  className={styles.shift_name}>
                {shift.description}&nbsp;: {moment(shift.endTime).format('HH:mm')} - {moment(shift.startTime).format('HH:mm')}
            </p>
            </div>
            {showWorkers ? <WorkersCurrentWeek managerId={props.managerId} standBy={shift.standBy} workers={shift.workers} shiftData={shift.shiftData} endTime={shift.endTime} startTime={shift.startTime}></WorkersCurrentWeek> : null}
        </div>
}

export default CurrentShiftUser