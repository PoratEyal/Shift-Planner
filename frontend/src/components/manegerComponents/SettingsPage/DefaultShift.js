import { useEffect, useRef, useState } from "react";
import moment from "moment";
import styles from './settingsPage.module.css';
import axios from "axios";
import Swal from 'sweetalert2';

const DefaultShift = (props) => {
    const [shift, setShift] = useState(props.shift);
    const [clickAddShift, setClickAddShift] = useState(false);
    let name = useRef();
    let startTime = useRef();
    let endTime = useRef();


    useEffect(() => {
        setShift(props.shift)
    }, [])

    const saveHandler = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const reqBody={
            managerId: user._id,
            shiftId: shift._id,
            name: name.current.value,
            startTime: startTime.current.value,
            endTime: endTime.current.value
        }
        const response = await axios.put(`${process.env.REACT_APP_URL}/changeShift`, reqBody);
        if(response.data){
            setShift(response.data)
            Swal.fire({
                title: 'המשמרת עודכנה',
                icon: 'success',
                confirmButtonColor: '#34a0ff',
                confirmButtonText: 'סגירה'
            });
        }
    }

    return <div className={styles.shifts}>

        <label className={styles.label}>
            {moment(shift.endTime).utc().format('HH:mm')} - {moment(shift.startTime).utc().format('HH:mm')} : {shift.description}
        </label>

        <div className={styles.icons_div}>
            <button className={styles.delete_btn} onClick={() => {props.delete(shift._id)}}>
                מחיקה
            </button>

            <label className={styles.spacer}></label>

            <button className={styles.edit_btn} onClick={() => {setClickAddShift(!clickAddShift)}}>
                עריכה
            </button>
        </div>

        {clickAddShift && (
            <div className={styles.editShift}>
                <input className={styles.input_edit} defaultValue={shift.description} type="text" placeholder="שם משמרת" ref={name} />
                <input className={styles.input_time_start} defaultValue={moment(shift.startTime).utc().format('HH:mm')} type="time" ref={startTime} />
                <input className={styles.input_time_end} defaultValue={moment(shift.endTime).utc().format('HH:mm')} type="time" ref={endTime} />
                <br></br>
                <button
                    className={styles.edit_shift_btn}
                    onClick={() => {
                        saveHandler()
                        setClickAddShift(!clickAddShift)
                    }}
                >אישור
                </button>
            </div>
        )}
    </div>
}
export default DefaultShift