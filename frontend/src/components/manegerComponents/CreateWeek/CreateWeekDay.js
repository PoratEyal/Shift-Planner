import React, { useEffect, useRef, useState } from 'react';
import styles from '../CreateWeek/createWeek.module.css'
import axios from 'axios'
import Shift from './CreateWeekShift';
import moment from 'moment';
import { FcPlus } from "react-icons/fc";

const CreateWeekDay = (props) => {

    const [day, setDay] = useState(props.day);
    const [dayShifts, setDayShifts] = useState(props.day.shifts);
    const [loading, setLoading] = useState(false);

    const [shiftName, setShiftName] = useState('')
    const [shiftStartTime, SetshiftStartTime] = useState('')
    const [shiftEndTime, SetshiftEndTime] = useState('')
    const [clickAddShift, setClickAddShift] = useState(false)
    const defShifts = props.defShifts;
    console.log(defShifts);
    const selectRef = useRef(null);

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
    const deleteShift = (id) => {
        const reqBody = {
            managerId: props.managerId,
            dayId: day._id,
            shiftId: id
        }
        axios.put(`${process.env.REACT_APP_URL}/deleteShiftFromDay/`, reqBody)
            .then(response => {
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

        const startTimeMoment = moment(newShift.startTime, 'HH:mm');
        const endTimeMoment = moment(newShift.endTime, 'HH:mm');

        newShift.startTime = startTimeMoment
        newShift.endTime = endTimeMoment

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

        const startTimeMoment = moment(newShift.startTime, 'HH:mm');
        const endTimeMoment = moment(newShift.endTime, 'HH:mm');

        newShift.startTime = startTimeMoment;
        newShift.endTime = endTimeMoment;

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

    // create shift and added the _id of it to day
    const addShift = () => {
        if (!shiftName || !shiftStartTime || !shiftEndTime) {
            return;
        }

        const newShift = {
            description: shiftName,
            startTime: moment(shiftStartTime, 'HH:mm'),
            endTime: moment(shiftEndTime, 'HH:mm'),
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
            <h2 className={styles.h2}>{day.name} - {moment(day.date).utc().format('DD.MM')}</h2>
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
                        setClickAddShift(!clickAddShift)
                    }}
                >
                    ידנית
                </button>

                {/* <button
                    className={styles.btn}
                    onClick={() => {
                        addEvningShift()
                    }
                    }
                >
                    ערב
                </button> */}

                <button className={styles.btn}>
                    הוספה
                </button>
                <select ref={selectRef} defaultValue="">
                    <option value="" disabled>משמרת</option>
                    {defShifts.map((shift, index) => {
                        console.log(shift);
                        return <option key={index} value={shift}>{shift.description}</option>
                    })}
                </select>
            </div>

            {clickAddShift && (
                <div className={styles.addShift}>
                    <input onChange={(e) => setShiftName(e.target.value)} value={shiftName} className={styles.input} type="text" placeholder="שם משמרת" />
                    <input onChange={(e) => SetshiftStartTime(e.target.value)} value={shiftStartTime} className={styles.input_time_start} type="time" />
                    <input onChange={(e) => SetshiftEndTime(e.target.value)} value={shiftEndTime} className={styles.input_time_end} type="time" />
                    <br></br>
                    <button
                        className={styles.addShift_btn}
                        onClick={() => {
                            addShift()
                            setClickAddShift(!clickAddShift)
                        }}
                    >הוסף משמרת
                    </button>
                </div>
            )}

        </div>
    </div>

}

export default CreateWeekDay