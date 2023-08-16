import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../CreateWeek/createWeek.module.css'
import React from 'react';

const SeeWorkersCurrentWeek = (props) => {
    
    const [workers, setWorkers] = useState(props.workers)
    const [workersArr, setWorkersArr] = useState([]);
    const [loading, setLoading] = useState(true);

    // get all the workers
    useEffect(() => {
      if(workers.length == 0){
        setLoading(false)
      }
      workers.map(worker => {
        const reqBody = {
          id: worker
        };
    
        axios.post(`${process.env.REACT_APP_URL}/getUserById`, reqBody)
          .then(response => {
            setLoading(false);
            const workerData = response.data;
            if (workerData && workerData.fullName) {
              setWorkersArr(prevWorkers => [...prevWorkers, workerData]);
            }
          })
          .catch(error => {
            setLoading(false);
            console.error(error);
          })
      });
    }, []);
    
    return <React.Fragment>
      {loading ? 
      (
        <div className={styles['three-body']}>
            <div className={styles['three-body__dot']}></div>
            <div className={styles['three-body__dot']}></div>
            <div className={styles['three-body__dot']}></div>
        </div>
      ) : (
      <div className={styles.workers_showList}>
        {workersArr.map((worker, index) => (
          <div key={index} className={styles.nameAndDelete}>
            {worker.fullName && <p className={styles.names}>{worker.fullName}&nbsp;•</p>}
          </div>
        ))}
      </div>
      )}
    </React.Fragment>
}

export default SeeWorkersCurrentWeek;