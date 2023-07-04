import React, { useEffect, useState } from "react";
import styles from '../CreateWeek/createWeek.module.css'
import axios from 'axios';
import CurrentWeekWorkers from './CurrentWeekWorkers'

const ShiftCurrentWeek = (props) => {

    const [shift, setShift] = useState(props.shift);
    //const data = JSON.parse(localStorage.getItem("user"));

    const addWorkerShift = (workerId) => {
        const index = shift.availableWorkers.findIndex(x => x === workerId)
        const arrTmp = [...shift.availableWorkers]
        arrTmp.splice(index, 1)
        console.log(arrTmp)
        const newShift = {
            _id: shift._id,
            description: shift.description,
            startTime: shift.startTime,
            endTime: shift.endTime,
            workers: [...shift.workers, workerId],
            availableWorkers: arrTmp
        }
        try {
            axios.put("http://localhost:3001/app/updateShift", newShift)
            .then((response) => {
                console.log(response.data)
                //window.location.reload();
            });
        } catch (error) {
            console.log(error.message);
        }

    }

    const removeWorkerShift = (workerId) => {
        const index = shift.workers.findIndex(x => x === workerId)
        const arrTmp = [...shift.workers]
        arrTmp.splice(index, 1)
        const newShift = {
            _id: shift._id,
            description: shift.description,
            startTime: shift.startTime,
            endTime: shift.endTime,
            workers: arrTmp,
            availableWorkers: [...shift.availableWorkers, workerId]
        }
        try {
            axios.put("http://localhost:3001/app/updateShift", newShift)
            .then((response) => {
                console.log(response.data)
                //window.location.reload();
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    return <div className={styles.shift}>
        <p className={styles.shift_name}>{shift.description}</p>
        <p>משעה - {shift.startTime} עד {shift.endTime}</p>
        <CurrentWeekWorkers removeWorkerShift={removeWorkerShift} addWorkerShift={addWorkerShift} workers={shift.workers} availableWorkers={shift.availableWorkers}></CurrentWeekWorkers>
    </div>
}

export default ShiftCurrentWeek