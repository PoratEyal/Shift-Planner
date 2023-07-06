import React, { useEffect, useState } from "react";
import styles from './currentWeekUser.module.css';
import { BiSolidWinkSmile } from "react-icons/bi";

const CurrentShiftUser = (props) => {

    const [shift, setShift] = useState(props.shift);
    const [userId, setUserId] = useState("");
    const [addClass, setAddClass] = useState(false)

    useEffect(() => {
        const newdata = JSON.parse(localStorage.getItem("user"));
        setUserId(newdata._id);
    
        if (shift.workers.includes(newdata._id)) {
            setAddClass(true);
        } else {
            setAddClass(false);
        }
    }, [shift, userId]);

    return (
        <div className={`${styles.shift} ${addClass ? styles.worksHer : ''}`}>
            <p className={styles.shift_name}>{shift.description}</p>
            <p>משעה - {shift.startTime} עד {shift.endTime}</p>
            {addClass ? <h3><BiSolidWinkSmile className={styles.icon}></BiSolidWinkSmile><label>&nbsp;משמרת נעימה</label></h3> : null}
        </div>
    );
}

export default CurrentShiftUser