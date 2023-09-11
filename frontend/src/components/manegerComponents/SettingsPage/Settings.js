import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from './settingsPage.module.css';
import PageLayout from './/..//..//layout/PageLayout';
import Swal from 'sweetalert2';

const SettingsPage = (props) =>{

    //const [user, setUser] = useState(null);
    const [defShifts, setDefShifts] = useState(null);
    let name = useRef();
    let startTime = useRef();
    let endTime = useRef();

    useEffect(() =>{
        const user = JSON.parse(localStorage.getItem('user'));
        axios.post(`${process.env.REACT_APP_URL}/getDefShifts`, {
            managerId: user._id
        }).then((response) => {
            setDefShifts(response.data);
            console.log(response.data);
        })
    }, []);

    const clickHandle = () => {
        const nameValue = name.current.value;
        const startTimeValue = startTime.current.value;
        const endTimeValue = endTime.current.value;
    
        if (!nameValue || !startTimeValue || !endTimeValue) {
            Swal.fire({
              title: 'יש למלא את כל השדות',
              text: "",
              icon: 'warning',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'סגירה'
            });
            return;
        }
        console.log(nameValue);
        console.log(startTimeValue);
        console.log(endTimeValue);
    }    

    return <PageLayout text='הגדרות'>
        <div className={styles.container}>
            <h2 className={styles.h2}>בנית משמרת</h2>
            <form className={styles.userForm}>
                <div>
                    <input className={styles.input} type="text" ref={name}></input>
                    <label className={styles.label_name}>שם משמרת</label>
                </div>

                <div>
                    <input className={styles.input} type="time" ref={startTime}></input>
                    <label className={styles.label_start}>זמן התחלה</label>
                </div>

                <div>
                    <input className={styles.input} type="time" ref={endTime}></input>
                    <label className={styles.label_end}>זמן סיום</label>
                </div>
            </form>

            <button className={styles.btn} onClick={clickHandle}>אישור</button>
        </div>
    </PageLayout>
}

export default SettingsPage