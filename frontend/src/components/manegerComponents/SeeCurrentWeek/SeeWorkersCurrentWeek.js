import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../CreateWeek/createWeek.module.css'

const SeeWorkersCurrentWeek = (props) => {
    
    const [workers, setWorkers] = useState(props.workers)

    const [workersArr, setWorkersArr] = useState([]);

    // get all the workers
    useEffect(() => {
      workers.map(worker => {
        const reqBody = {
          id: worker
        }
        axios
          .post(`${process.env.REACT_APP_URL}/getUserById`, reqBody)
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
    }, []);
    
    return (
      <div className={styles.workers_showList}>
        {workersArr.map((worker, index) => (
          <div key={index} className={styles.nameAndDelete}>
            {worker.fullName && <p className={styles.names}>{worker.fullName}&nbsp;•</p>}
          </div>
        ))}
      </div>
    );
      
}

export default SeeWorkersCurrentWeek;