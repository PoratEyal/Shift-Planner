import React, { useEffect, useLayoutEffect, useState } from 'react'
import styles from '../CreateWeek/createWeek.module.css'
import axios from 'axios'
//import ShiftCurrentWeek from './EditShiftCurrentWeek';
import ShiftCurrentWeek from '../CurrentWeek/ShiftCurrentWeek';
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

    // scroll to the current day
    useLayoutEffect(() => {
        const today = moment().format('YYYY-MM-DD');
        if (moment(day.date).format('YYYY-MM-DD') === today && day.name !== "ראשון") {
            // Delay the scroll by 2 seconds
            const scrollTimeout = setTimeout(() => {
                const dayContainer = document.getElementById(`day_${day.date}`);
                if (dayContainer) {
                    const targetPosition = dayContainer.offsetTop - 100;
    
                    // Scroll to the calculated position
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }, 2800);
    
            return () => clearTimeout(scrollTimeout);
        }
    }, [day.data]);

    useEffect(() => {
        updateShifts();
    }, [day]);

    return <div className={`${styles.day_container}`} style={{ margin: '12px' }} id={`day_${day.date}`}>

            <h2 className={styles.h2}>{day.name} - {moment(day.date).utc().format('DD.MM')}</h2>
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
}

export default EditDayCurrentWeek