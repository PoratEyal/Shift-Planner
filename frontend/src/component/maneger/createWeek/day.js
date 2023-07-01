import React, { useEffect, useState } from 'react';
import styles from '../createWeek/createWeek.module.css'
import axios from 'axios'
import Shift from '../createWeek/shift';

const Day = (props) => {

    const [day, setDay] = useState(props.day);
    const [dayChanged, setDayChanged] = useState(false);
    const [dayShifts, setDayShifts] = useState([]);

    const getShifts = () => {     
            let shifts = [];
            if(day.shifts.length > 0){
                for(let i =0; i < day.shifts.length; i++){
                     axios.get(`http://localhost:3001/app/getShiftById/${day.shifts[i]}`).then((response) => {
                        shifts.push(response.data)
                    });
                }
            }
            console.log(shifts);
            return shifts;
    };

    useEffect(() => {
        let shifts = getShifts();
        setDayShifts(shifts);
    }, []);

    // create shift and added the _id of her to day
    const addShift = async () => {
        const newShift = {
          description: "אדי משמרת בדיקה",
          startTime: "6:00",
          endTime: "13:00",
          workers: []
        };
      
        try {
          const response = await axios.post("http://localhost:3001/app/addShift", newShift);
          const updatedDay = {
            ...day,
            shifts: [...day.shifts, response.data._id]
          };
          await axios.put("http://localhost:3001/app/editDay", updatedDay);
          setDayChanged(true)
        } catch (error) {
          console.log(error.message);
        }
    }

    //gets the data of the day and set it to the useState
    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/app/getDay/${props.day._id}`);
            setDay(response.data);
        } catch (error) {
            console.error(error);
        }
        };

        fetchData();
    }, [dayChanged]);

    useEffect(() => {
    }, [day]);

    return <div>
        <div className={styles.day_container}>
            <h2 className={styles.h2}>{day.name}</h2>
            {
                [...dayShifts].length === 0 ? (
                    <div className={styles['three-body']}>
                    <div className={styles['three-body__dot']}></div>
                    <div className={styles['three-body__dot']}></div>
                    <div className={styles['three-body__dot']}></div>
                    </div>
                  ) : (
                [...dayShifts].map((shift) => {return shift ? <Shift shift={shift} key={shift._id}></Shift> : null}))
            }

            <button
                className={styles.btn}
                onClick={() => {
                    addShift();
                    setDayChanged(false);
                }}
                >
                Add Shift
            </button>
        </div>
    </div>

}

export default Day