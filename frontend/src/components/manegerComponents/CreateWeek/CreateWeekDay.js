import React, { useEffect, useRef, useState } from 'react';
import styles from '../CreateWeek/createWeek.module.css'
import axios from 'axios'
import Shift from './CreateWeekShift';
import moment from 'moment';
import LoadingAnimation from '../../loadingAnimation/loadingAnimation';
import PopUpCreateShift from '../../popups/createShiftForWeek/createShiftForWeek'

const CreateWeekDay = (props) => {

    const [day, setDay] = useState(props.day);
    const [dayShifts, setDayShifts] = useState(props.day.shifts);
    const [loading, setLoading] = useState(false);

    const [shiftName, setShiftName] = useState('')
    const [shiftStartTime, SetshiftStartTime] = useState('')
    const [shiftEndTime, SetshiftEndTime] = useState('')
    const defShifts = props.defShifts;
    const selectRef = useRef(null);

    const [isBackdropVisible, setIsBackdropVisible] = useState(false);
    const [clickAddShift, setClickAddShift] = useState(false);

    const toggleBackdrop = () => {
        setIsBackdropVisible(!isBackdropVisible);
    };

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
            const newShift = {
                description: shift.description,
                startTime: moment(moment(shift.startTime).utc().format('HH:mm'), 'HH:mm'),
                endTime: moment(moment(shift.endTime).utc().format('HH:mm'), 'HH:mm'),
                amountOfWorkers: shift.amountOfWorkers,
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

    const updateDay = (updatedDay) => {
        setDay(updatedDay);
    };

    return <div>
        <div className={styles.day_container}>
            
            <h2 className={styles.h2}>{day.name} - {moment(day.date).utc().format('DD.MM')}</h2>
            
            {loading ? 
                <LoadingAnimation></LoadingAnimation>
            : 
                (dayShifts.map((shift) => { return shift ? <Shift deleteShift={deleteShift} shift={shift} key={shift._id} managerId={props.managerId}></Shift> : null }))
            }

            <div className={styles.specific_shift_div}>  
                <label>הוספת משמרת</label>      
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
                    <option value="">הוספת משמרת ידנית</option>
                </select>
            </div>

            {clickAddShift && (
                <React.Fragment>
                    <div className={`${styles.backdrop} ${isBackdropVisible ? styles.visible : ''}`} onClick={() => {setClickAddShift(false); toggleBackdrop();}}></div>
                    <PopUpCreateShift
                        managerId={props.managerId}
                        dayId={day._id}
                        updateDay={updateDay}
                        onClose={() => {setClickAddShift(false); toggleBackdrop();}}
                    />
                </React.Fragment>
            )}

        </div>
    </div>

}

export default CreateWeekDay