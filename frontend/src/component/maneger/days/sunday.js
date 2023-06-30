import React, { useEffect, useState } from 'react';
import styles from '../createWeek.module.css'
import axios from 'axios'

const Sunday = () => {

    const [sunday, setSunday] = useState({})
    const [sundayChanged, setSundayChanged] = useState(false)

    // create shift and added the _id of her to sunday day
    const addShift = async () => {
        const newShift = {
          description: "אדי משמרת בדיקה",
          startTime: "6:00",
          endTime: "13:00",
          workers: []
        };
      
        try {
          const response = await axios.post("http://localhost:3001/app/addShift", newShift);
          console.log(response.data);
      
          const updatedSunday = {
            ...sunday,
            shifts: [...sunday.shifts, response.data._id]
          };
      
          await axios.put("http://localhost:3001/app/editDay", updatedSunday);
          console.log(updatedSunday);
          setSundayChanged(true)
        } catch (error) {
          console.log(error.message);
        }
    }

    //gets the data of sunday day and set it to sunday useState
    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:3001/app/getDay/649ebff386d5ecb147f51dfc");
            console.log(response.data)
            setSunday(response.data);
        } catch (error) {
            console.error(error);
        }
        };

        fetchData();
    }, [sundayChanged]);

    useEffect(() => {
        console.log(sunday.shifts);
    }, [sunday]);

    return <div>
        <div className={styles.day_container}>
            <h2 className={styles.h2}>{sunday.name}</h2>

            {/* {sunday.shifts && sunday.shifts.map((shift, index) => (
                <div key={shift._id || index}>
                    <div>
                        <p>{shift._id}</p>
                    </div>
                </div>
            ))} */}

            <button
                className={styles.btn}
                onClick={() => {
                    addShift();
                    setSundayChanged(false);
                }}
                >
                Add Shift
            </button>
        </div>
    </div>

}

export default Sunday