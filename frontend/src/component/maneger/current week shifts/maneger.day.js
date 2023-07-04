import React, { useEffect, useState } from 'react'
import styles from '../createWeek/createWeek.module.css'
import axios from 'axios'
import Shift from './maneger_shift'

const ManegerDay = (props) => {

    const [day] = useState(props.day);
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

    const updateShifts = () => {
        getShifts().then((shifts) => {
         setDayShifts(shifts);
     })
     .catch((error) => {
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
                    dayShifts.map((shift) => {return shift ? <Shift getShifts={updateShifts} shift={shift} key={shift._id}></Shift> : null }))
            }

        </div>
    </div>

}

export default ManegerDay