import React, {useState } from "react";
import styles from '../CreateWeek/createWeek.module.css'
import axios from 'axios';
import CurrentWeekWorkers from './CurrentWeekWorkers'

const ShiftCurrentWeek = (props) => {

    const [shift, setShift] = useState(props.shift);
    const [showWorkers, setShow] = useState(true);

    const addWorkerShift = (workerId) => {
        const reqBody = {
            //managerId: props.managerId,
            dayId: props.dayId,
            shiftId: shift._id,
            workerId: workerId
        }
        axios.put(`${process.env.REACT_APP_URL}/addWorkerToWorkrs`, reqBody)
            .then((response) => {
                console.log(response.data);
                props.setDay(response.data);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    const removeWorkerShift = (workerId) => {
        const reqBody = {
            //managerId: props.managerId,
            dayId: props.dayId,
            shiftId: shift._id,
            workerId: workerId
        }
        axios.put(`${process.env.REACT_APP_URL}/WorkersToAvail`, reqBody)
            .then((response) => {
                props.setDay(response.data);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    return <div>
        <div className={styles.shift} >
            <div onClick={() => { setShow(!showWorkers) }}>
                <p className={styles.shift_description}>{shift.description}&nbsp;: {shift.endTime} - {shift.startTime}</p>
            </div>

            {showWorkers ? <CurrentWeekWorkers
                managerId={props.managerId}
                weekPublished={props.weekPublished}
                removeWorkerShift={removeWorkerShift}
                addWorkerShift={addWorkerShift}
                workers={shift.workers}
                availableWorkers={shift.availableWorkers}>
            </CurrentWeekWorkers> : null}
        </div>
    </div>
}

export default ShiftCurrentWeek