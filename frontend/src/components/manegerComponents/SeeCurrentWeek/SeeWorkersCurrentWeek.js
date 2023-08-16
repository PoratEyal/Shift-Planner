import axios from 'axios';
import { useEffect, useState } from 'react';
import React from 'react';
import styles from './workers.module.css';

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

    const getShiftData = (worker, index) =>{
      let data = null;
      data = props.shiftData.find(obj => obj.userId === worker._id)
      return data ?
          (worker._id !== data.userId ?
            <div key={index} className={styles.all_data_div}>
              <div>•&nbsp;{worker.fullName}</div>
            </div>
            :
            <div key={index} className={styles.all_data_div}>
              <div className={styles.name}>•&nbsp;{worker.fullName}</div>
  
              <div className={styles.hours_message_div}>
                <label>
                  {data.end ? getHour(data.end) : getHour(props.endTime)}
                  {data.start ? ` - ${getHour(data.start)}` : ` - ${getHour(props.startTime)}`}
                </label>
              </div>
            </div>)
          : <div key={index} className={styles.all_data_div}>
            <div>•&nbsp;{worker.fullName}</div>
          </div>
    }

    const getHtml = () => {
      return workersArr.map((worker, index) => (
        getShiftData(worker, index)
      ))
    }

    const getHour = (dateTime) => {
      const time = new Date(dateTime);
      dateTime = time.toTimeString().slice(0, 5);
      return dateTime 
    }
    
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
          {getHtml()}
        </div>)}
    </React.Fragment>

}

export default SeeWorkersCurrentWeek;