import React, {useState } from "react";
import styles from './CurrentWeek.module.css'
import axios from 'axios';
import CurrentWeekWorkers from './CurrentWeekWorkers';
import moment from "moment";

const ShiftCurrentWeek = (props) => {

    const [shift, setShift] = useState(props.shift);
    
    const addWorkerShift = (workerId) => {
        const reqBody = {
            managerId: props.managerId,
            dayId: props.dayId,
            shiftId: shift._id,
            workerId: workerId
        }
        axios.put(`${process.env.REACT_APP_URL}/addWorkerToWorkrs`, reqBody)
            .then((response) => {
                props.setDay(response.data);
            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    const addWorkerToStandBy = (workerId) => {
        const reqBody = {
            managerId: props.managerId,
            dayId: props.dayId,
            shiftId: shift._id,
            workerId: workerId
        }
        axios.put(`${process.env.REACT_APP_URL}/addWorkerToStandBy`, reqBody).then((response) => {
            props.setDay(response.data);
        })
        .catch((error) => {
            console.log(error.message);
        });
    }

    const removeWorkerShift = (workerId) => {
        const reqBody = {
            managerId: props.managerId,
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
            <div>
                <p className={styles.shift_description}>
                    {shift.description}&nbsp;: {moment(shift.endTime).format('HH:mm')} - {moment(shift.startTime).format('HH:mm')}
                </p>
            </div>

            <CurrentWeekWorkers
                weekId={props.weekId}
                shift ={shift}
                dayId={props.dayId}
                managerId={props.managerId}
                weekPublished={props.weekPublished}
                removeWorkerShift={removeWorkerShift}
                addWorkerShift={addWorkerShift}
                workers={shift.workers}
                availableWorkers={shift.availableWorkers}>
            </CurrentWeekWorkers>
        </div>
    </div>
}

export default ShiftCurrentWeek