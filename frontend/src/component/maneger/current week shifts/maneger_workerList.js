import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../createWeek/createWeek.module.css'

const ManegerWorkerList = (props) => {
    
    const [workers, setWorkers] = useState(props.workers)
    const [availableWorkers, setAvailableWorkers] = useState(props.availableWorkers)

    const [availableWorkersArr, setAvailableWorkersArr] = useState([]);
    const [workersArr, setWorkersArr] = useState([]);

    const [loading, setLoading] = useState(false)

    // get all the workers
    useEffect(() => {
      workers.map(worker => {
            axios.get(`http://localhost:3001/app/getUserById/${worker}`)
                .then(response => {
                    setLoading(true)
                    const worker = response.data;
                    setWorkersArr(prevWorkerNames => [...prevWorkerNames, worker]);
                })
                .catch(error => {
                    console.error(error);
                });
        });
        setLoading(true)
    }, []);

    // get all the available workers
    useEffect(() => {
      availableWorkers.map(worker => {
            axios.get(`http://localhost:3001/app/getUserById/${worker}`)
                .then(response => {
                    setLoading(true)
                    const worker = response.data;
                    setAvailableWorkersArr([...availableWorkersArr, worker])
                  })
                .catch(error => {
                    console.error(error);
                });
        });
        setLoading(true)
    }, []);

    const choseWorker = (id) => {
      console.log(id)
      props.addWorkerShift(id)
    }

    const removeWorker = (id) => {
      console.log(id)
      props.removeWorkerShift(id)
    }
    
    return (
      <div className={styles.workers_list_delete}>

        {workersArr.map((worker, index) => (
            <div key={index} className={styles.nameAndDelete}>
              <button onClick={() => removeWorker(worker._id)} className={styles.btn_chosen}>הסר</button>
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
    );
      
}

export default ManegerWorkerList;
