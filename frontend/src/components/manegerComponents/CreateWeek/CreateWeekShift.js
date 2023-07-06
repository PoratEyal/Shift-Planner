import React, { useEffect, useState } from "react";
import styles from './createWeek.module.css'
import axios from 'axios';

const CreateWeekShift = (props) => {

    const [shift, setShift] = useState(props.shift);

    const deleteShift = () => {
      console.log(shift._id);
     props.deleteShift(shift._id);  
    }





    return <div className={styles.shift}>
        <p className={styles.shift_name}>{shift.description}</p>
        <p>משעה - {shift.startTime} עד {shift.endTime}</p>
        <button className={styles.btn_delete} onClick={deleteShift}>מחיקת משמרת</button>
    </div>
}

export default CreateWeekShift