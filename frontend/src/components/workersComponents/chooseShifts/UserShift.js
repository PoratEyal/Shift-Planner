import React, { useEffect, useState } from "react";
import styles from './chooseShifts.module.css';
import axios from 'axios';
import WorkerList from '../CurrentWeek_user/WorkersCurrentWeek';
import moment from "moment";

const UserShift = (props) => {

  const [shift, setShift] = useState(props.shift);
  const data = JSON.parse(localStorage.getItem("user"));
  const [added, setAdded] = useState(false);
  const [addClass, setAddClass] = useState(false);
  const [showWorkers, setShow] = useState(false);
  

  useEffect(() => {
    if (shift.availableWorkers.includes(data._id) || shift.workers.includes(data._id)) {
      setAdded(true);
    }
    if (shift.workers.includes(data._id) && props.weekPublished === true){
      
      setAddClass(true);
      setShow(!showWorkers);
    }
  }, [])

  // add worker to shift
  const addWorkerToShift = () => {
    setAdded(true);
    const updtaedShift = { ...props.shift, availableWorkers: [...shift.availableWorkers, data] }
    const reqBody = {
      managerId: props.managerId,
      dayId: props.dayId,
      shiftId: shift._id,
      workerId: data._id
    }
    axios.put(`${process.env.REACT_APP_URL}/addWorkerToAvial`, reqBody)
      .then(response => {
      })
      .catch(error => {
        console.log(error.response.data.error);
      });
  }

  const removeWorkerFromShift = () => {
    setAdded(false);
    const reqBody = {
      managerId: props.managerId,
      dayId: props.dayId,
      shiftId: shift._id,
      workerId: data._id
    }
    axios.put(`${process.env.REACT_APP_URL}/delWorkerToAvial`, reqBody)
      .then(response => {
      })
      .catch(error => {
        console.log(error.response.data.error);
      });
      if(shift.workers.includes(data._id)){
        axios.put(`${process.env.REACT_APP_URL}/removeWorkerFromWorkrs`, reqBody)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error.response.data.error);
      });
      }
  }

  return <div className={`${styles.shift} ${addClass ? styles.worksHer : ''}`}>
      <div onClick={() => {setShow(!showWorkers)}}>

      <p className={styles.shift_data_p}>
              {shift.description}&nbsp;: {moment(shift.endTime).format('HH:mm')} - {moment(shift.startTime).format('HH:mm')}
      </p>
      </div>
      
      {!props.weekPublished ? (
        added ? (
          <button onClick={removeWorkerFromShift} className={styles.remove_btn}>הסרת בקשה למשמרת</button>
        ) : (
          <button onClick={addWorkerToShift} className={styles.add_btn}>בקשת שיבוץ למשמרת</button>
        )
        ) : ( showWorkers ? <WorkerList managerId={props.managerId} standBy={shift.standBy} workers={shift.workers} shiftData={shift.shiftData} endTime={shift.endTime} startTime={shift.startTime}></WorkerList> : null)
      }

  </div>
}

export default UserShift