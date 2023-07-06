import React, { useEffect, useState } from "react";
import styles from '../CreateWeek/createWeek.module.css'
import axios from 'axios';
import CurrentWeekWorkers from './CurrentWeekWorkers'

const ShiftCurrentWeek = (props) => {

    const [shift, setShift] = useState(props.shift);




    const addWorkerShift = (workerId) => {
        const index = shift.availableWorkers.findIndex(x => x === workerId)
        shift.availableWorkers.splice(index, 1);
        shift.workers.push(workerId);

        const reqBody = {
            dayId: props.dayId,
            shiftId: shift._id,
            workerId: workerId
        }
        axios.put("http://localhost:3001/app/addWorkerToWorkrs", reqBody)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }


    const removeWorkerShift = (workerId) => {
        const index = shift.workers.findIndex(x => x === workerId)
        shift.workers.splice(index, 1);
        shift.availableWorkers.push(workerId);

        const reqBody = {
            dayId: props.dayId,
            shiftId: shift._id,
            workerId: workerId
        }
        axios.put("http://localhost:3001/app/removeWorkerFromWorkrs", reqBody)
            .then((response) => {
                console.log(response.data)
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    return <div className={styles.shift}>
        <p className={styles.shift_name}>{shift.description}</p>
        <p>משעה - {shift.startTime} עד {shift.endTime}</p>
        <CurrentWeekWorkers removeWorkerShift={removeWorkerShift} addWorkerShift={addWorkerShift} workers={shift.workers} availableWorkers={shift.availableWorkers}></CurrentWeekWorkers>
    </div>
}

export default ShiftCurrentWeek