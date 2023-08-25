import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './currentWeekUser.module.css';
import Swal from 'sweetalert2';
import { AiOutlineMessage } from "react-icons/ai";

const WorkersCurrentWeek = (props) => {
    
  const [workers] = useState(props.workers);
  const [workersArr, setWorkersArr] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(true)
  
  // get all the workers
  useEffect(() => {
    if(workers.length == 0){
      setLoading(false)
    }

    workers.forEach(workerId => {
      const body = {
        id: workerId
      }
      axios.post(`${process.env.REACT_APP_URL}/getUserById`, body)
        .then(response => {
          setLoading(false)
          const fetchedWorker = response.data;
          if (fetchedWorker && fetchedWorker.fullName) {
            setWorkersArr(prevWorkers => [...prevWorkers, fetchedWorker]);
          }
        })
        .catch(error => {
          setLoading(false)
          console.error(error);
        });
    });
  }, []);

  const seeMessage = (data) => {
    Swal.fire({
      title: `הודעה מהמנהל`,
      text: data.message,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'סגור',
      customClass: {
        popup: styles.swal2_popup,
        title: styles.swal2_title,
        content: styles.swal2_content,
      },
    })
  }

  const getShiftData = (worker, index) =>{
    let data = null;
    data = props.shiftData.find(obj => obj.userId === worker._id)
    return data ?
          (worker._id !== data.userId ?
            <div key={index} className={styles.all_data_div}>
              {user._id !== worker._id ? 
                <div>•&nbsp;{worker.fullName}</div>
              :
                <div className={styles.bold_name}>•&nbsp;{worker.fullName}</div>}
            </div>

            :

            <div key={index} className={styles.all_data_div}>
              {user._id !== worker._id ? 
                <div className={styles.name}>•&nbsp;{worker.fullName}</div>
              :
                <div className={styles.bold_name}>•&nbsp;{worker.fullName}</div>}

              <div className={styles.hours_message_div}>
                {worker._id === user._id ?  (data.message ? <AiOutlineMessage onClick={() => seeMessage(data)}></AiOutlineMessage> : null) : null}
                
                <label>
                  {data.end ? getHour(data.end) : getHour(props.endTime)}
                  {data.start ? ` - ${getHour(data.start)}` : ` - ${getHour(props.startTime)}`}
                </label>
              </div>
            </div>)

        : <div key={index} className={styles.all_data_div}>
            {user._id !== worker._id ? 
              <div>•&nbsp;{worker.fullName}</div>
            :
              <div className={styles.bold_name}>•&nbsp;{worker.fullName}</div>}
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
      </div>
  )}
</React.Fragment>
  
}

export default WorkersCurrentWeek;