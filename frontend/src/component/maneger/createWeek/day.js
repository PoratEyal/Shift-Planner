import React, { useEffect, useState } from 'react';
import styles from '../createWeek/createWeek.module.css'
import axios from 'axios'
import Shift from '../createWeek/shift';

const Day = (props) => {

    const [day, setDay] = useState(props.day);
    const [dayShifts, setDayShifts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [shiftName, setShiftName] = useState('')
    const [shiftStartTime, SetshiftStartTime] = useState('')
    const [shiftEndTime, SetshiftEndTime] = useState('')
    const [clickAddShift, setClickAddShift] = useState(false)

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
            
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , []);

    useEffect(()=>{
        getShifts()
            .then((shifts) => {
                setDayShifts(shifts);
            })
            .catch((error) => {
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
    },[day]);

    // create morning shift and added the _id of her to day
    const addMorningShift = () => {
        const newShift = {
            description: "משמרת בוקר",
            startTime: "7:00",
            endTime: "15:00",
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

    // create evnig shift and added the _id of her to day
    const addEvningShift = () => {
        const newShift = {
            description: "משמרת ערב",
            startTime: "15:00",
            endTime: "23:00",
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

    // create shift and added the _id of her to day
    const addShift = () => {
        const newShift = {
            description: shiftName,
            startTime: shiftStartTime,
            endTime: shiftEndTime,
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
                    dayShifts.map((shift) => {return shift ? <Shift getShifts={updateShifts} shift={shift} key={shift._id}></Shift> : null }))
            }

            <div className={styles.buttons}>
                <button
                    className={styles.btn}
                    onClick={() => {
                        addMorningShift()}
                    }
                >
                    הוסף משמרת בוקר
                </button>

                <button
                    className={styles.btn}
                    onClick={() => {
                        addEvningShift()}
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

export default Day