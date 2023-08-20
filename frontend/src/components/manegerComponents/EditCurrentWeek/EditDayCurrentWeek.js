import React, { useEffect, useState } from 'react'
import styles from '../CreateWeek/createWeek.module.css'
import axios from 'axios'
import ShiftCurrentWeek from './EditShiftCurrentWeek';
import moment from "moment";

const EditDayCurrentWeek = (props) => {

    const [day, setDay] = useState(props.day);
    const [dayShifts, setDayShifts] = useState(props.day.shifts);
    const [loading, setLoading] = useState(false);

    // get the sifts of the day
    const getShifts = () => {
        return new Promise((resolve, reject) => {
            let shifts = [];
            setLoading(true)
            if (day.shifts.length >= 0) {
                const reqBody= {
                    managerId: props.managerId,
                    dayId: day._id
                }
                axios.post(`${process.env.REACT_APP_URL}/getShiftsOfDay`, reqBody)
                .then((response) => {
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
        updateShifts();
    },[day]);

    return <div>
        <div className={styles.day_container}>

            <h2 className={styles.h2}>{day.name} - {moment(day.date).format('DD.MM')}</h2>
            {
                loading ? (
                    <div className={styles['three-body']}>
                        <div className={styles['three-body__dot']}></div>
                        <div className={styles['three-body__dot']}></div>
                        <div className={styles['three-body__dot']}></div>
                    </div>
                ) : (
                    (dayShifts?.length ?? 0) === 0 ? (
                        <div className={styles.no_shifts_messge}>אין משמרות ליום זה</div>
                      ) : (
                        dayShifts.map((shift) => (
                          shift ? (
                            <ShiftCurrentWeek
                                weekId={props.weekId}
                                managerId={props.managerId}
                                weekPublished={props.weekPublished}
                                getShifts={updateShifts}
                                shift={shift}
                                dayId={day._id}
                                key={shift._id}
                                setDay={setDay}
                            ></ShiftCurrentWeek>
                          ) : null
                        ))
                      ))
            }

        </div>
    </div>

}

export default EditDayCurrentWeek