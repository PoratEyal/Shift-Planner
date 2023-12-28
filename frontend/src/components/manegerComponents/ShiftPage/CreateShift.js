import { useRef } from "react";
import axios from "axios";
import styles from './createShift.module.css';
import PageLayout from './/..//..//layout/PageLayout';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const CreateShift = () => {

    const navigate = useNavigate();

    let name = useRef();
    let startTime = useRef();
    let endTime = useRef();

    const clickHandle = async () => {
        const nameValue = name.current.value;
        const startTimeValue = startTime.current.value;
        const endTimeValue = endTime.current.value;

        if (!nameValue || !startTimeValue || !endTimeValue) {
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
                endTime: endTimeValue
            }
            await axios.put(`${process.env.REACT_APP_URL}/addNewShift`, reqBody)
            navigate('/defShifts')
        }
    }

    return <PageLayout text='יצירת משמרת קבועה'>
        <div className={styles.container}>
            <form className={styles.userForm}> 
                <div className={styles.input_div}>
                    <label className={styles.label}>שם משמרת</label>
                    <input placeholder="משמרת בוקר" className={styles.input} type="text" ref={name}></input>
                </div>

                <div className={styles.input_div}>
                    <label className={styles.label}>שעת התחלת משמרת</label>
                    <input className={styles.input_time} type="time" ref={startTime}></input>
                </div>

                <div className={styles.input_div}>
                    <label className={styles.label}>שעת סיום משמרת</label>
                    <input className={styles.input_time2} type="time" ref={endTime}></input>
                </div>
            </form>

            <div className={styles.btn_div}>
                <button className={styles.btn} onClick={clickHandle}>אישור</button>
                <button className={styles.btn_cancel} onClick={() => navigate('/defShifts')}>ביטול</button>
            </div>
        </div>
    </PageLayout>
}

export default CreateShift;