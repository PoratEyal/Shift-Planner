import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../createWeek/createWeek.module.css'

const ManegerWorkerList = (props) => {
    
    const [workers, setWorkers] = useState(props.workers)
    const [workerNames, setWorkerNames] = useState([]);
    const [loading, setLoading] = useState(false)
    const [chosen, setChosen] = useState('בחירה')

    useEffect(() => {
        workers.map(worker => {
            axios.get(`http://localhost:3001/app/getUserById/${worker}`)
                .then(response => {
                    setLoading(true)
                    const fullName = response.data.fullName;
                    setWorkerNames(prevWorkerNames => [...prevWorkerNames, fullName]);
                })
                .catch(error => {
                    console.error(error);
                });
        });
        setLoading(true)
    }, []);

    const choseWorker = (fullname) => {
      console.log(fullname)
    }
    
    return (
        <div className={styles.workers_list_delete}>
          {!loading ? (
            <div className={styles.loadingWorkers_manger_page}>
              <div className={styles['three-body']}>
                <div className={styles['three-body__dot']}></div>
                <div className={styles['three-body__dot']}></div>
                <div className={styles['three-body__dot']}></div>
              </div>
            </div>
          ) : (
            workerNames.map((name, index) => (
              <div key={index} className={styles.nameAndDelete}>
                <button onClick={() => choseWorker(name)} className={styles.btn_chose}>{chosen}</button>
                <p className={styles.names}>{name}</p>
              </div>
            ))
          )}
        </div>
      );
      
}

export default ManegerWorkerList;
