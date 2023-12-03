import React, { useEffect, useState } from 'react'
import styles from './chooseShifts.module.css'
import axios from 'axios'
import UserShift from './UserShift';
import moment from "moment";

const UserDay = (props) => {

    const [day] = useState(props.day);
    const [dayShifts, setDayShifts] = useState(props.day.shifts);
    const [loading, setLoading] = useState(false);

    const getShifts = () => {
        return new Promise((resolve, reject) => {
            let shifts = [];
            setLoading(true)
            if (day.shifts.length >= 0) {
                const body = {
                    dayId: day._id,
                    managerId: props.managerId
                }
                axios.post(`${process.env.REACT_APP_URL}/getShiftsOfDay`, body).then((response) => {
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
            <div className={styles.h2_div}>
                <h2 className={styles.h2}>{day.name} - {moment(day.date).utc().format('DD.MM')}</h2>
            </div>

            { 
                loading ? (
                    <div className={styles['three-body']}>
                        <div className={styles['three-body__dot']}></div>
                        <div className={styles['three-body__dot']}></div>
                        <div className={styles['three-body__dot']}></div>
                    </div>
                ) : (
                dayShifts?.length === 0 ? (
                    <div className={styles.no_shifts_message}>אין משמרות ליום זה</div>
                ) : (    
                dayShifts.map((shift) => {return shift ? <UserShift 
                    managerId={props.managerId}
                    weekPublished={props.weekPublished}
                    getShifts={updateShifts} shift={shift}
                    dayId={day._id}
                    key={shift._id}></UserShift> : null }))
                )}
        </div>
    </div>

}

export default UserDay