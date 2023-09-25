import React, { useEffect, useRef, useState } from 'react';
import styles from '../CreateWeek/createWeek.module.css'
import axios from 'axios'
import Shift from './CreateWeekShift';
import moment from 'moment';

const CreateWeekDay = (props) => {

    const [day, setDay] = useState(props.day);
    const [dayShifts, setDayShifts] = useState(props.day.shifts);
    const [loading, setLoading] = useState(false);

    const [shiftName, setShiftName] = useState('')
    const [shiftStartTime, SetshiftStartTime] = useState('')
    const [shiftEndTime, SetshiftEndTime] = useState('')
    const [clickAddShift, setClickAddShift] = useState(false)
    const defShifts = props.defShifts;
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

    const addDefShift = (shiftId) => {
         try {
            const shift = props.defShifts.find(shift => String(shift._id) === shiftId)
        console.log();
        const newShift = {
            description: shift.description,
            startTime: moment(moment(shift.startTime).utc().format('HH:mm'), 'HH:mm'),
            endTime: moment(moment(shift.endTime).utc().format('HH:mm'), 'HH:mm'),
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

            <div className={styles.specific_shift_div}>
                {/* <button onClick={() => { addDefShift(selectRef.current.value) }}>
                        הוספה
                </button> */}         
                <select
                    ref={selectRef}
                    defaultValue=""
                    onChange={(e) => {
                        if (e.target.value === "") {
                            setClickAddShift(!clickAddShift);
                            e.target.value = "";
                        } else {
                            addDefShift(e.target.value);
                            e.target.value = "";
                        }
                    }}
                    >
                    <option value="" disabled>הוספת משמרת</option>
                    {defShifts.map((shift, index) => {
                        return <option key={index} value={shift._id}>{shift.description}</option>
                    })}
                    <option value="">משמרת ידנית</option>
                </select>
            </div>

            {clickAddShift && (
                <div className={styles.addShift}>
                    <input onChange={(e) => setShiftName(e.target.value)} value={shiftName} className={styles.input} type="text" placeholder="שם משמרת" />
                    <input onChange={(e) => SetshiftStartTime(e.target.value)} value={shiftStartTime} className={styles.input_time_start} type="time" />
                    <input onChange={(e) => SetshiftEndTime(e.target.value)} value={shiftEndTime} className={styles.input_time_end} type="time" />
                    <br></br>
                    <div className={styles.addShift_div}>
                        <button
                            className={styles.addShift_btn}
                            onClick={() => {
                                addShift()
                                setClickAddShift(!clickAddShift)
                            }}
                        >הוספה
                        </button>
                        <button
                            className={styles.addShift_cancel_btn}
                            onClick={() => {
                                addShift()
                                setClickAddShift(!clickAddShift)
                            }}
                        >ביטול
                        </button>
                    </div>

                </div>
            )}

        </div>
    </div>

}

export default CreateWeekDay