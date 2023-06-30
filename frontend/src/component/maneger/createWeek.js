import React, { useEffect, useState } from 'react';
import styles from '../maneger/createWeek.module.css'
import axios from 'axios'

const CreateWeek = () => {

    const [sunday, setSunday] = useState('')

    const addShift = async () => {
        const newShift = {
            description:"משמרת בדיקה",
            startTime:"6:00",
            endTime:"13:00",
            workers:[]
        }
        try {
            await axios.post("http://localhost:3001/app/addShift", newShift)
              .then(response => {
                console.log(response.data);
              })
              .catch(error => {
                console.log(error.response.data.error);
              });
          } catch (error) {
            console.log(error.message);
        }

        try {
            setSunday({
                _id:sunday._id,
                name:sunday.name,
                shifts:[newShift._id]
            })
            await axios.put('http://localhost:3001/app/editDay', sunday)
              .then(response => {
                console.log(response.data);
              })
              .catch(error => {
                console.log(error.response.data.error);
              });
          } catch (error) {
            console.log(error.message);
        }

    }

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
    }, []);

    return <div>
        <div className={styles.day_container}>
            <h2 className={styles.h2}>{sunday.name}</h2>

            {Array.isArray(sunday) && sunday.shifts.length > 0 ? (
                sunday.shifts.map((shift) => (
                    <div key={shift._id}>
                        <div>
                            <p>{shift.description}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p>no shifts right now</p>
            )}

            <button
                className={styles.btn}
                onClick={addShift}
                >Add Shift
            </button>
        </div>
    </div>
}

export default CreateWeek