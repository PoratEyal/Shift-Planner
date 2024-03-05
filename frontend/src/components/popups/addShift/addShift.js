import React, { useState } from 'react';
import moment from 'moment';
import styles from '../updateShift/popUpUpdateShift.module.css';
import axios from "axios";
import Swal from 'sweetalert2';
import { AiOutlineClose } from "react-icons/ai";
import { useRef } from "react";

const PopUpAddShift = (props) => {

    const [isOpen, setIsOpen] = useState(true);

    let name = useRef();
    let startTime = useRef();
    let endTime = useRef();
    let amountOfWorkers = useRef();

    const clickHandle = async () => {
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
        else {
            const user = JSON.parse(localStorage.getItem('user'));
            const reqBody = {
                managerId: user._id,
                name: nameValue,
                startTime: startTimeValue,
                endTime: endTimeValue,
                amountOfWorkers: amountOfWorkersValue
            }
            console.log(reqBody)
            await axios.put(`${process.env.REACT_APP_URL}/addNewShift`, reqBody)
            setIsOpen(false);
        }
    }

    const handleClose = () => {
        props.onClose(); // Set isOpen to false to close the component
    }

    if (!isOpen) {
        return null; // If isOpen is false, don't render anything
    }

    return (
        <div className={styles.editShift}>

            <AiOutlineClose className={styles.close_icon} onClick={handleClose}></AiOutlineClose>

            <form onSubmit={clickHandle}>
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
                        לחצו להוספת המשמרת
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PopUpAddShift;
