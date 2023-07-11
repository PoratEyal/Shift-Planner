import React, { useEffect, useState } from "react";
import styles from './chooseShifts.module.css'
import axios from 'axios';
import WorkerList from './WorkersList'

const UserShift = (props) => {

  const [shift, setShift] = useState(props.shift);
  const data = JSON.parse(localStorage.getItem("user"));
  const [added, setAdded] = useState(false);
  const [addClass, setAddClass] = useState(false)

  useEffect(() => {
    if (shift.availableWorkers.includes(data._id) || shift.workers.includes(data._id)) {
      setAdded(true);
    }
    if (shift.workers.includes(data._id) && props.weekPublished === true){
      setAddClass(true)
    }
  }, [])

  const addWorkerToShift = () => {
    setAdded(true);
    const updtaedShift = { ...props.shift, availableWorkers: [...shift.availableWorkers, data] }
    const reqBody = {
      dayId: props.dayId,
      shiftId: shift._id,
      workerId: data._id
    }
    axios.put('http://localhost:3001/app/addWorkerToAvial', reqBody)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error.response.data.error);
      });
  }

  const removeWorkerFromShift = () => {
    setAdded(false);
    //const updtaedShift = { ...props.shift, availableWorkers: [...shift.availableWorkers, data] }
    const reqBody = {
      dayId: props.dayId,
      shiftId: shift._id,
      workerId: data._id
    }
    axios.put('http://localhost:3001/app/delWorkerToAvial', reqBody)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error.response.data.error);
      });
      if(shift.workers.includes(data._id)){
        axios.put('http://localhost:3001/app/removeWorkerFromWorkrs', reqBody)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error.response.data.error);
      });
      }
  }

  return <div className={`${styles.shift} ${addClass ? styles.worksHer : ''}`}>
    <p className={styles.shift_data_p}>{shift.description}: {shift.startTime} - {shift.endTime}</p>
    
    {
  !props.weekPublished ? (
    added ? (
      <button onClick={removeWorkerFromShift} className={styles.add_btn}>הסר</button>
    ) : (
      <button onClick={addWorkerToShift} className={styles.add_btn}>הוסף את עצמך</button>
    )
  ) : <WorkerList workers={shift.workers}></WorkerList>
}

  </div>
}

export default UserShift