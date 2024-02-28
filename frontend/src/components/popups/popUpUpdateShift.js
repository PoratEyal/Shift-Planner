import React, { useState } from 'react';
import moment from 'moment';
import styles from './popUpUpdateShift.module.css';
import axios from "axios";
import Swal from 'sweetalert2';

const PopUpEditShift = (props) => {

    const [description, setDescription] = useState(props.name);
    const [startTime, setStartTime] = useState(moment(props.startTime).utc().format('HH:mm'));
    const [endTime, setEndTime] = useState(moment(props.endTime).utc().format('HH:mm'));
    const [amountOfWorkers, setAmountOfWorkers] = useState(props.amountOfWorkers);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const reqBody={
            managerId: props.userId,
            shiftId: props.shiftId,
            name: description,
            startTime: startTime,
            endTime: endTime,
            numberOfWorkers: amountOfWorkers
        }
        const response = await axios.put(`${process.env.REACT_APP_URL}/changeShift`, reqBody);
        if(response.data){
            Swal.fire({
                title: 'המשמרת עודכנה',
                icon: 'success',
                confirmButtonColor: '#34a0ff',
                confirmButtonText: 'סגירה'
            });
        }
    }

    return (
        <div className={styles.editShift}>
            <form onSubmit={handleSubmit}>

                <div className={styles.input_div}>
                    <label>שם המשמרת</label>
                    <input
                    className={styles.input_edit}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    type="text"
                    />
                </div>
                
                <div className={styles.input_div}>
                    <label>שעת התחלה</label>
                    <input
                        className={styles.input_time_start}
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        type="time"
                    />
                </div>

                <div className={styles.input_div}>
                    <label>שעת סיום</label>
                    <input
                        className={styles.input_time_end}
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        type="time"
                    />
                </div>

                <div className={styles.input_div}>
                    <label>כמות עובדים במשמרת</label>
                    <input
                        className={styles.input_time_start}
                        value={amountOfWorkers}
                        onChange={(e) => setAmountOfWorkers(e.target.value)}
                        type="number"
                    />
                </div>
                <div className={styles.btn_div}>
                    <button className={styles.edit_shift_btn} type="submit">
                        לחצו לעדכון המשמרת
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PopUpEditShift;
