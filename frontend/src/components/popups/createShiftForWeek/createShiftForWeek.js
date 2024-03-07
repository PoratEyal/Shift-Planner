import React, { useState } from 'react';
import moment from 'moment';
import styles from '../updateShift/popUpUpdateShift.module.css';
import axios from "axios";
import Swal from 'sweetalert2';
import { AiOutlineClose } from "react-icons/ai";
import { useRef } from "react";

const CreateShiftForWeek = (props) => {

    const [isOpen, setIsOpen] = useState(true);

    let name = useRef();
    let startTime = useRef();
    let endTime = useRef();
    let amountOfWorkers = useRef();

    // create shift and added the _id of it to day
    const addShift = (event) => {
        event.preventDefault();

        const nameValue = name.current.value;
        const startTimeValue = startTime.current.value;
        const endTimeValue = endTime.current.value;
        const amountOfWorkersValue = amountOfWorkers.current.value;

        if (!nameValue || !startTimeValue || !endTimeValue || !amountOfWorkersValue) {
            Swal.fire({
                title: 'יש למלא את כל השדות',
                text: "",
                icon: 'warning',
                confirmButtonColor: '#34a0ff',
                confirmButtonText: 'סגירה'
            });
            return;
        }

        const newShift = {
            description: nameValue,
            startTime: moment(startTimeValue, 'HH:mm'),
            endTime: moment(endTimeValue, 'HH:mm'),
            workers: [],
            amountOfWorkers: amountOfWorkersValue
        };

        const reqBody = {
            managerId: props.managerId,
            newShift: newShift,
            dayId: props.dayId
        }

        try {
            axios.put(`${process.env.REACT_APP_URL}/addShiftToDay`, reqBody).then((response) => {
                const updatedDay = response.data.day.find(d => d._id === props.dayId);
                props.updateDay(updatedDay);
                props.onClose()
                setIsOpen(false);
            });
        } catch (error) {
            console.log(error.message);
        }        
    }

    if (!isOpen) {
        return null; // If isOpen is false, don't render anything
    }

    return (
        <div className={styles.editShift}>

            <AiOutlineClose className={styles.close_icon} onClick={() => props.onClose()}></AiOutlineClose>

            <form onSubmit={addShift}>
                <div className={styles.input_div}>
                    <label>שם המשמרת</label>
                    <input
                    className={styles.input_edit}
                    type="text"
                    ref={name}
                    />
                </div>
                
                <div className={styles.input_div}>
                    <label>שעת התחלה</label>
                    <input
                        className={styles.input_time_start}
                        type="time"
                        ref={startTime}
                    />
                </div>

                <div className={styles.input_div}>
                    <label>שעת סיום</label>
                    <input
                        className={styles.input_time_end}
                        type="time"
                        ref={endTime}
                    />
                </div>

                <div className={styles.input_div}>
                    <label>כמות עובדים במשמרת</label>
                    <input
                        className={styles.input_time_start}
                        type="number"
                        ref={amountOfWorkers}
                    />
                </div>
                <div className={styles.btn_div}>
                    <button className={styles.edit_shift_btn} type="submit">
                        להוספת המשמרת
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateShiftForWeek;
