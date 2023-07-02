import React, { useState } from "react";
import styles from '../../maneger/createWeek/createWeek.module.css'
import axios from 'axios';

const UserShift = (props) => {

    const [shift, setShift] = useState(props.shift);
    const data = JSON.parse(localStorage.getItem("user"));
    const fullName = data.fullName;

    const addWorkerToShift = async () => {

        console.log(fullName)
        try {
            const updtaedShift = {
                _id: shift._id,
                description: shift.description,
                startTime: shift.startTime,
                endTime: shift.endTime,
                workers: [...shift.workers, data]
            }
            console.log(updtaedShift)
            await axios.put('http://localhost:3001/app/updateShift', updtaedShift)
              .then(response => {
                props.getShifts()
              })
              .catch(error => {
                console.log(error.response.data.error);
              });
          } catch (error) {
            console.log(error.message);
          }
    }

    return <div className={styles.shift}>
        <p className={styles.shift_name}>{shift.description}</p>
        <p>משעה - {shift.startTime} עד {shift.endTime}</p>
        <div className={styles.workers_list}>
            {shift.workers
            ? shift.workers.map((worker, index) => (
            <p key={index}>{fullName} •</p>
            ))
            : null}
        </div>
        <button onClick={addWorkerToShift} className={styles.add_btn}>הוסף את עצמך</button>
    </div>
}

export default UserShift