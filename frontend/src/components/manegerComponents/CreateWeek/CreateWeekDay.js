import React, { useEffect, useState } from 'react';
import styles from '../CreateWeek/createWeek.module.css'
import axios from 'axios'
import Shift from './CreateWeekShift';

const CreateWeekDay = (props) => {

    const [day, setDay] = useState(props.day);
    const [dayShifts, setDayShifts] = useState(props.day.shifts);
    const [loading, setLoading] = useState(false);

    const [shiftName, setShiftName] = useState('')
    const [shiftStartTime, SetshiftStartTime] = useState('')
    const [shiftEndTime, SetshiftEndTime] = useState('')
    const [clickAddShift, setClickAddShift] = useState(false)

    // get the sifts of the day
    const getShifts = () => {
        return new Promise((resolve, reject) => {
            setLoading(true);
            let shifts = [];
            const reqBody = {
                managerId: props.managerId,
                dayId: day._id
            }
            if (day.shifts.length >= 0) {
                axios.post(`${process.env.REACT_APP_URL}/getShiftsOfDay`, reqBody)
                    .then((response) => {
                        shifts = response.data;
                        setLoading(false);
                        resolve(shifts);
                    })
                    .catch((error) => {
                        console.error(error);
                        setLoading(false);
                        reject(error);
                    });
            } else {
                setLoading(false);
                resolve(shifts);
            }
        });
    };

    // put he data from getShifts func into dayShifts state
    const updateShifts = () => {
        getShifts().then((shifts) => {
            setDayShifts(shifts);
        })
            .catch((error) => {
            });
    };

    useEffect(() => {
        updateShifts();
    }, [day], [dayShifts]);

    // delete shift
    const deleteShift = (id) =>{
        const reqBody = {
            managerId: props.managerId,
            dayId: day._id,
            shiftId: id
        }
        axios.put(`${process.env.REACT_APP_URL}/deleteShiftFromDay/`, reqBody)
        .then(response =>{
            updateShifts();
        })
    }

    // create morning shift and added the _id of her to day
    const addMorningShift = () => {

        const newShift = {
            description: "משמרת בוקר",
            startTime: "7:00",
            endTime: "15:00",
            workers: []
        };
        const reqBody = {
            managerId: props.managerId,
            newShift: newShift,
            dayId: day._id
        }
        axios.put(`${process.env.REACT_APP_URL}/addShiftToDay`, reqBody)
            .then((response) => {
                const updatedDay = response.data.day.find(d => d._id === day._id);
                setDay(updatedDay);

            })
            .catch((error) => {
                console.log(error.message);
            });
    }

    // create evnig shift and added the _id of her to day
    const addEvningShift = () => {
        const newShift = {
            description: "משמרת ערב",
            startTime: "15:00",
            endTime: "23:00",
            workers: []
        };
        const reqBody = {
            managerId: props.managerId,
            newShift: newShift,
            dayId: day._id
        }
        try {

            axios.put(`${process.env.REACT_APP_URL}/addShiftToDay`, reqBody)
            .then((response) => {
                const updatedDay = response.data.day.find(d => d._id === day._id);
                setDay(updatedDay);
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    // create shift and added the _id of her to day
    const addShift = () => {
        const newShift = {
            description: shiftName,
            startTime: shiftStartTime,
            endTime: shiftEndTime,
            workers: []
        };

        const reqBody = {
            managerId: props.managerId,
            newShift: newShift,
            dayId: day._id
        }
        try {

            axios.put(`${process.env.REACT_APP_URL}/addShiftToDay`, reqBody).then((response) => {
                const updatedDay = response.data.day.find(d => d._id === day._id);
                setDay(updatedDay);
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
                    dayShifts.map((shift) => { return shift ? <Shift deleteShift={deleteShift} shift={shift} key={shift._id} managerId={props.managerId}></Shift> : null }))
            }

            <div className={styles.buttons}>
                <button
                    className={styles.btn}
                    onClick={() => {
                        addMorningShift()
                    }
                    }
                >
                    הוסף משמרת בוקר
                </button>

                <button
                    className={styles.btn}
                    onClick={() => {
                        addEvningShift()
                    }
                    }
                >
                    הוסף משמרת ערב
                </button>

                <button
                    className={styles.btn}
                    onClick={() => {
                        setClickAddShift(!clickAddShift)
                    }}
                >
                    הוסף משמרת
                </button>
            </div>

            {clickAddShift && (
                <div className={styles.addShift}>
                    <input onChange={(e) => setShiftName(e.target.value)} value={shiftName} className={styles.input} type="text" placeholder="שם משמרת" />
                    <input onChange={(e) => SetshiftStartTime(e.target.value)} value={shiftStartTime} className={styles.input} type="text" placeholder="זמן התחלה" />
                    <input onChange={(e) => SetshiftEndTime(e.target.value)} value={shiftEndTime} className={styles.input} type="text" placeholder="זמן סיום" />
                    <br></br>
                    <button
                        className={styles.addShift_btn}
                        onClick={() => {
                            addShift()
                            setClickAddShift(!clickAddShift)
                        }}
                    >הוסף
                    </button>
                </div>
            )}

        </div>
    </div>

}

export default CreateWeekDay