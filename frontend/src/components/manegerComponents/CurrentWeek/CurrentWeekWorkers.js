import axios from 'axios';
import React from 'react';
import { useEffect, useState } from 'react';
import styles from '../CreateWeek/createWeek.module.css'

const CurrentWeekWorkers = (props) => {
    
    const [workers, setWorkers] = useState(props.workers)
    const [availableWorkers, setAvailableWorkers] = useState(props.availableWorkers)

    const [availableWorkersArr, setAvailableWorkersArr] = useState([]);
    const [workersArr, setWorkersArr] = useState([]);

    const [updatedWorkers, setUpdatedWorkers] = useState(false)

    // get all the workers
    useEffect(() => {
      workers.map(worker => {
            axios.get(`${process.env.REACT_APP_URL}/getUserById/${worker}`)
                .then(response => {
                    const worker = response.data;
                    setWorkersArr(prevWorker => [...prevWorker, worker]);
                })
                .catch(error => {
                    console.error(error);
                });
        });
        availableWorkers.map(worker => {
            axios.get(`${process.env.REACT_APP_URL}/getUserById/${worker}`)
                .then(response => {
                    const worker = response.data;
                    setAvailableWorkersArr(prevWorker => [...prevWorker, worker])
                  })
                .catch(error => {
                    console.error(error);
                });
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
    
    return <React.Fragment>
      <div className={styles.workers_list_delete}>

        {workersArr.map((worker, index) => (
            <div key={index} className={styles.nameAndDelete}>
              <button onClick={() => removeWorker(worker._id)} className={styles.btn_chosen}>הסרה</button>
              <p className={styles.names}>{worker.fullName}</p>
            </div>
          ))}

          {availableWorkersArr.map((worker, index) => (
            <div key={index} className={styles.nameAndDelete}>
              <button onClick={() => choseWorker(worker._id)} className={styles.btn_chose}>בחירה</button>
              <p className={styles.names}>{worker.fullName}</p>
            </div>
          ))}

        </div>
        
        {/* <div className={styles.workers_showList}>
          {workersArr.map((worker, index) => (
              <div key={index} className={styles.nameAndDelete}>
                <p className={styles.names}>{worker.fullName}&nbsp; •</p>
              </div>
            ))}
        </div> */}
      </React.Fragment>
}

export default CurrentWeekWorkers;
