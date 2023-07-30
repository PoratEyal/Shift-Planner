import axios from 'axios';
import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import styles from '../CreateWeek/createWeek.module.css'

const CurrentWeekWorkers = (props) => {

  const [workers, setWorker] = useState(props.workers)
  const [availableWorkers, setAvailableWorkers] = useState(props.availableWorkers)
  const [newWorkers, setWorkers] = useState(null);

  const [availableWorkersArr, setAvailableWorkersArr] = useState([]);
  const [workersArr, setWorkersArr] = useState([]);

  const [updatedWorkers, setUpdatedWorkers] = useState(false)

  const selectRef = useRef(null);
  useEffect(() => {
    workers.map(worker => {
      axios
        .get(`${process.env.REACT_APP_URL}/getUserById/${worker}`)
        .then(response => {
          const workerData = response.data;
          if (workerData && workerData.fullName) {
            setWorkersArr(prevWorkers => [...prevWorkers, workerData]);
          }
        })
        .catch(error => {
          console.error(error);
        });
    });

    availableWorkers.map(worker => {
      axios
        .get(`${process.env.REACT_APP_URL}/getUserById/${worker}`)
        .then(response => {
          const workerData = response.data;
          if (workerData && workerData.fullName && !(workers.includes(workerData._id))) {
            setAvailableWorkersArr(prevWorkers => [...prevWorkers, workerData]);
          }
        })
        .catch(error => {
          console.error(error);
        });
    });

    const user = localStorage.getItem("user");

    const reqBody = {
      workers: [...workers, ...availableWorkers],
      manager: user._id
    }
    axios.post(`${process.env.REACT_APP_URL}/getAllWorkers`, reqBody).then(response => {

      setWorkers(response.data);
    }).catch(err => {
      console.log(err)
    });
  }, []);

  const choseWorker = (id) => {
    props.addWorkerShift(id)
    setUpdatedWorkers(!updatedWorkers)
  }

  const removeWorker = (id) => {
    props.removeWorkerShift(id)
    setUpdatedWorkers(!updatedWorkers)
  }

  return (
    <React.Fragment>
      <div className={styles.workers_list_delete}>

        {workersArr.map((worker, index) => (
          <div key={index} className={styles.nameAndDelete}>
            <button onClick={() => removeWorker(worker._id)} className={styles.btn_chosen}>
              הסרה
            </button>
            {worker.fullName && <p className={styles.names}>{worker.fullName}</p>}
          </div>
        ))}

        {availableWorkersArr.map((worker, index) => (

          <div key={index} className={styles.nameAndDelete}>
            <button onClick={() => choseWorker(worker._id)} className={styles.btn_chose}>
              בחירה
            </button>
            {worker.fullName && <p className={styles.names}>{worker.fullName}</p>}
          </div>
        ))}

      </div>

      <div className={styles.addWroker_div}>
        {(
          newWorkers ?
            <select className={styles.select_choose_worker} ref={selectRef}>

              {
                newWorkers.map((elem, index) => {
                  return <option key={index} value={elem._id} selected={index === 0}>{elem.fullName}</option>
                })
              }

            </select>
            : null)
        }
        <div onClick={() => { choseWorker(selectRef.current.value) }}>
          <img className={styles.plus_btn} src="addWorker.png"></img>
        </div>
      </div>
    </React.Fragment>
  );
}

export default CurrentWeekWorkers;
