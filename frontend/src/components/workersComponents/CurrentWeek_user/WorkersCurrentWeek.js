import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './currentWeekUser.module.css';



const WorkersCurrentWeek = (props) => {
    
    const [workers] = useState(props.workers)

    const [workersArr, setWorkersArr] = useState([]);

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
    }, []);
    
    return (
      <div className={styles.workers_showList}>
        {workersArr.map((worker, index) => (
            <div key={index} className={styles.nameAndDelete}>
              <p className={styles.names}>{worker.fullName}&nbsp; •</p>
            </div>
          ))}
      </div>
    );
      
}

export default WorkersCurrentWeek;