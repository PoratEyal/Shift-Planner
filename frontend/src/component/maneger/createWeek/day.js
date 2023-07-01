import React, { useEffect, useState } from 'react';
import styles from '../createWeek/createWeek.module.css'
import axios from 'axios'
import Shift from '../createWeek/shift';

const Day = (props) => {

    const [day, setDay] = useState(props.day);
    const [dayShifts, setDayShifts] = useState([]);
    const [loading, setLoading] = useState(false);
    const getShifts = () => {
        return new Promise((resolve, reject) => {
            let shifts = [];
            setLoading(true)
            if (day.shifts.length > 0) {
                const shiftRequests = day.shifts.map((shiftId) =>
                    axios.get(`http://localhost:3001/app/getShiftById/${shiftId}`)
                );

                axios.all(shiftRequests).then((responses) => {
                    shifts = responses.map((response) => response.data);
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

    useEffect(() => {
        getShifts()
            .then((shifts) => {
                setDayShifts(shifts);
            })
            .catch((error) => {
            });
    }, []);
    useEffect(()=>{
        getShifts()
            .then((shifts) => {
                setDayShifts(shifts);
            })
            .catch((error) => {
            });
    },[day]);

    // create shift and added the _id of her to day
    const addShift = () => {
        const newShift = {
            description: "משמרת ערב",
            startTime: "13:00",
            endTime: "20:00",
            workers: []
        };

        try {
            
            axios.post("http://localhost:3001/app/addShift", newShift).then((response) => {
                let updatedShifts = [...day.shifts, response.data._id];
                const updatedDay = { ...day, shifts: updatedShifts };
                setDay(updatedDay);
                axios.put("http://localhost:3001/app/editDay", updatedDay);
                props.getDays();
            });
        } catch (error) {
            console.log(error.message);
        }
    }

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
                    dayShifts.map((shift) => {return shift ? <Shift shift={shift} key={shift._id}></Shift> : null }))
            }
            <button
                className={styles.btn}
                onClick={() => {
                    addShift()}
                }
            >
                הוסף משמרת
            </button>
        </div>
    </div>

}

export default Day