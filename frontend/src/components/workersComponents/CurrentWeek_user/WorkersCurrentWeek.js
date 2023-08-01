import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './currentWeekUser.module.css';



const WorkersCurrentWeek = (props) => {
    
  const [workers] = useState(props.workers);
  const [workersArr, setWorkersArr] = useState([]);
  
  // get all the workers
  useEffect(() => {
    workers.forEach(workerId => {
      const body = {
        id: workerId
      }
      axios.post(`${process.env.REACT_APP_URL}/getUserById`, body)
        .then(response => {
          const fetchedWorker = response.data;
          if (fetchedWorker && fetchedWorker.fullName) {
            setWorkersArr(prevWorkers => [...prevWorkers, fetchedWorker]);
          }
        })
        .catch(error => {
          console.error(error);
        });
    });
  }, [workers]);
  
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

export default WorkersCurrentWeek;