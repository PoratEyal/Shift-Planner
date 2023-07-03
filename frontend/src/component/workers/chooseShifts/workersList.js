import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from '../../maneger/createWeek/createWeek.module.css'

const WorkerList = (props) => {
    
    const [workers, setWorkers] = useState(props.workers)
    const [workerNames, setWorkerNames] = useState([]);

    useEffect(() => {
        workers.map(worker => {
            axios.get(`http://localhost:3001/app/getUserById/${worker}`)
                .then(response => {
                    const fullName = response.data.fullName;
                    setWorkerNames(prevWorkerNames => [...prevWorkerNames, fullName]);
                })
                .catch(error => {
                    console.error(error);
                });
        });
    }, []);
    
    return <div className={styles.workers_list}>
        {workerNames.map((name, index) => (
            <p key={index}>{name} •</p>
        ))}
    </div>
}

export default WorkerList;
