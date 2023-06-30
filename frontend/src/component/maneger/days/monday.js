import React, { useEffect, useState } from 'react';
import styles from '../createWeek.module.css'
import axios from 'axios'

const Monday = () => {

    const [monday, setMonday] = useState({})
    const [mondayChanged, setMondayChanged] = useState(false)

    // create shift and added the _id of her to monday day
    const addShift = async () => {
        const newShift = {
          description: "7 משמרת בדיקה",
          startTime: "6:00",
          endTime: "13:00",
          workers: []
        };
      
        try {
          const response = await axios.post("http://localhost:3001/app/addShift", newShift);
      
          const updatedMonday = {
            ...monday,
            shifts: [...monday.shifts, response.data._id]
          };
      
          await axios.put("http://localhost:3001/app/editDay", updatedMonday);
          setMondayChanged(true)
        } catch (error) {
          console.log(error.message);
        }
    }

    //gets the data of monday day and set it to sunday useState
    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:3001/app/getDay/649ebff786d5ecb147f51dfe");
            setMonday(response.data);
        } catch (error) {
            console.error(error);
        }
        };

        fetchData();
    }, [mondayChanged]);

    // useEffect(() => {
    //     console.log(monday.shifts);
    // }, [monday]);

    return <div>
        <div className={styles.day_container}>
            <h2 className={styles.h2}>{monday.name}</h2>

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
                    setMondayChanged(false);
                }}
                >
                Add Shift
            </button>
        </div>
    </div>

}

export default Monday