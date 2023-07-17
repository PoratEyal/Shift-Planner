import React, { useEffect, useRef, useState } from "react";
import styles from '../CreateWeek/createWeek.module.css'
import axios from 'axios';
import CurrentWeekWorkers from './CurrentWeekWorkers'
import Swal from 'sweetalert2';


const ShiftCurrentWeek = (props) => {

    const [shift, setShift] = useState(props.shift);
    const [showWorkers, setShow] = useState(true);
    const [newWorkers, setWorkers] = useState(null);

    const selectRef = useRef(null)

    const addWorkerShift = (workerId) => {
        const reqBody = {
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
    useEffect(() => {
        const reqBody = {
            workers: [...shift.workers, ...shift.availableWorkers]
        }
        axios.post(`${process.env.REACT_APP_URL}/getAllWorkers`, reqBody).then(response => {
            console.log(response.data);
            setWorkers(response.data);
        }).catch(err => {
            console.log(err)
        });

    }, [])

    const removeWorkerShift = (workerId) => {
        const reqBody = {
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


    return <div style={{backgroundColor: "green"}}>
        <div className={styles.shift} >
            <div onClick={() => { setShow(!showWorkers) }}>


                <p className={styles.shift_description}>{shift.description}&nbsp;: {shift.endTime} - {shift.startTime}</p>
            </div>

            {showWorkers ? <CurrentWeekWorkers
                weekPublished={props.weekPublished}
                removeWorkerShift={removeWorkerShift}
                addWorkerShift={addWorkerShift}
                workers={shift.workers}
                availableWorkers={shift.availableWorkers}>
            </CurrentWeekWorkers> : null}


            <div className={styles.addWroker_div}>
                {(
                    newWorkers ?
                        <select className={styles.select_choose_worker} ref={selectRef}>

                            {
                                newWorkers.map((elem, index) => {
                                    return <option key={index} value={elem._id} selected={index === 0}>{elem.fullName}</option>
                                })
                            }

                        </select>
                        : null)
                }
            </div>

            <div onClick={() => { addWorkerShift( selectRef.current.value) }}>
                <img className={styles.plus_btn} src="addWorker.png"></img>
            </div>
        </div>
    </div>
}

export default ShiftCurrentWeek