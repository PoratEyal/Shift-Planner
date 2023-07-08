import React, { useEffect, useState } from 'react'
import styles from './chooseShifts.module.css'
import axios from 'axios'
import UserShift from './UserShift'

const UserDay = (props) => {

    const [day] = useState(props.day);
    const [dayShifts, setDayShifts] = useState(props.day.shifts);
    const [loading, setLoading] = useState(false);

    const getShifts = () => {
        return new Promise((resolve, reject) => {
            let shifts = [];
            setLoading(true)
            if (day.shifts.length >= 0) {
                axios.get(`http://localhost:3001/app/getShiftsOfDay/${day._id}`).then((response) => {
                    shifts = response.data;
                    setLoading(false)
                    resolve(shifts);
                })
                    .catch((error) => {
                        console.error(error);
                        setLoading(false)
                        reject(error);
                    });
            } else {
                setLoading(false)
                resolve(shifts);
            }
        });
    };

    const updateShifts = () => {
        getShifts().then((shifts) => {
         setDayShifts(shifts);
     })
     .catch((error) => {
     });
     };


    useEffect(()=>{
        getShifts()
            .then((shifts) => {
                setDayShifts(shifts);
            })
            .catch((error) => {
            });
    },[day]);

    return <div>
        <div className={styles.day_container}>
            <h2 className={styles.h2}>{day.name}</h2>
            { 
                loading ? (
                    <div className={styles['three-body']}>
                        <div className={styles['three-body__dot']}></div>
                        <div className={styles['three-body__dot']}></div>
                        <div className={styles['three-body__dot']}></div>
                    </div>
                ) : (
                    dayShifts.map((shift) => {return shift ? <UserShift getShifts={updateShifts} shift={shift} dayId={day._id} key={shift._id}></UserShift> : null }))
            }

        </div>
    </div>

}

export default UserDay