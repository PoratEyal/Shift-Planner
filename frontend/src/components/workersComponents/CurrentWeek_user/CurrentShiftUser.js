import React, { useEffect, useState } from "react";
import styles from './currentWeekUser.module.css';
import { BiSolidWinkSmile } from "react-icons/bi";
import WorkersCurrentWeek from "./WorkersCurrentWeek";

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

    return (
        <div className={`${styles.shift} ${addClass ? styles.worksHer : ''}`} onClick={() => {setShow(!showWorkers)}}>
            <p className={styles.shift_name}>{shift.description}&nbsp;: {shift.endTime} - {shift.startTime}</p>
            {showWorkers ? <WorkersCurrentWeek managerId={props.managerId} workers={shift.workers}></WorkersCurrentWeek> : null}
        </div>
    );
}

export default CurrentShiftUser