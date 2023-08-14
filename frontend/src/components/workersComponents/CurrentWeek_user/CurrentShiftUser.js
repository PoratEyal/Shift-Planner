import React, { useEffect, useState } from "react";
import styles from './currentWeekUser.module.css';
import WorkersCurrentWeek from "./WorkersCurrentWeek";
import moment from "moment";

const CurrentShiftUser = (props) => {

    const [shift] = useState(props.shift);
    const [userId, setUserId] = useState("");
    const [addClass, setAddClass] = useState(false)
    const [showWorkers, setShow] = useState(false);
    const [shiftData, setShiftData] = useState(null);
    
    useEffect(() => {
        const newdata = JSON.parse(localStorage.getItem("user"));
        setUserId(newdata._id);
    
        if (shift.workers.includes(newdata._id)) {
            //setShiftData(shift.shiftData.find(obj => obj.userId === newdata._id));
            setAddClass(true);
            setShow(true);
        } else {
            setAddClass(false);
        }
    }, [shift, userId]);

    return (
        <div className={`${styles.shift} ${addClass ? styles.worksHer : ''}`} onClick={() => {setShow(!showWorkers)}}>
            <p className={styles.shift_name}>
              {shift.description}&nbsp;: {moment(shift.endTime).format('HH:mm')} - {moment(shift.startTime).format('HH:mm')}
            </p>
            {showWorkers ? <WorkersCurrentWeek managerId={props.managerId} workers={shift.workers} shiftData={shift.shiftData} endTime={shift.endTime} startTime={shift.startTime}></WorkersCurrentWeek> : null}
        </div>
    );
}

export default CurrentShiftUser