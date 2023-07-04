import React, { useEffect, useState } from "react";
import styles from '../../maneger/createWeek/createWeek.module.css'
import axios from 'axios';
import WorkerList from "./workersList";

const UserShift = (props) => {

  const [shift, setShift] = useState(props.shift);
  const data = JSON.parse(localStorage.getItem("user"));
  const [added, setAdded] = useState(false);



  useEffect(() => {
    if(shift.availableWorkers.includes(data._id)){
      setAdded(true);
    }
  }, [])
  const addWorkerToShift = () => {
    setAdded(true);
    const updtaedShift = { ...props.shift, availableWorkers: [...shift.availableWorkers, data] }
    //console.log(updtaedShift.workers);
    axios.put('http://localhost:3001/app/updateShift', updtaedShift)
      .then(response => {
        setShift(updtaedShift);
      })
      .catch(error => {
        console.log(error.response.data.error);
      });
  }
  const removeWorkerFromShift = () => {
    const updtaedShift = {...shift};
    const userIndex = shift.availableWorkers.indexOf(data._id);
    updtaedShift.availableWorkers.splice(userIndex, 1);
    setAdded(false);
    axios.put('http://localhost:3001/app/updateShift', updtaedShift)
      .then(response => {
        setShift(updtaedShift);        
      })
      .catch(error => {
        console.log(error.response.data.error);
      });
  }

  return <div className={styles.shift}>
    <p className={styles.shift_name}>{shift.description}</p>
    <p>משעה - {shift.startTime} עד {shift.endTime}</p>
    {/* <WorkerList workers={shift.workers}></WorkerList> */}


    {
      added ? <button onClick={removeWorkerFromShift} className={styles.add_btn}>הסר</button> : <button onClick={addWorkerToShift} className={styles.add_btn}>הוסף את עצמך</button>
    }
    
  </div>
}

export default UserShift