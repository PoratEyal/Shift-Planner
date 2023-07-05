import React, { useEffect, useState } from "react";
import styles from './currentWeekUser.module.css';

const CurrentShiftUser = (props) => {

    const [shift, setShift] = useState(props.shift);
    const [userId, setUserId] = useState("");
    const [addClass, setAddClass] = useState(false)

    useEffect(() => {
        const newdata = JSON.parse(localStorage.getItem("user"));
        setUserId(newdata._id);

        if (shift.workers.includes(userId)) {
            setAddClass(true)
        }
    }, [])

    return (
        <div className={`${styles.shift} ${addClass ? styles.worksHer : ''}`}>
            <p className={styles.shift_name}>{shift.description}</p>
            <p>משעה - {shift.startTime} עד {shift.endTime}</p>
            {addClass ? <p>משמרת נעימה</p> : null}
        </div>
    );
}

export default CurrentShiftUser