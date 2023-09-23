import axios from 'axios';
import { useEffect, useState } from 'react';
import React from 'react';
import styles from './seeCurrentWeek.module.css';
import { BiTime } from "react-icons/bi";
import { AiOutlineMessage } from "react-icons/ai";
import Swal from 'sweetalert2';

const SeeWorkersCurrentWeek = (props) => {

  const [workers] = useState(props.workers)
  const [workersArr, setWorkersArr] = useState([]);
  const [sbWorkers] = useState(props.standBy);
  const [sbWorkersNames, setSbWorkersNames] = useState([]);
  const [loading, setLoading] = useState(true);

  // get all the workers
  useEffect(() => {
    if (workers.length == 0) {
      setLoading(false)
    }
    sbWorkers.map(worker => {
      const body = {
        id: worker
      }
      axios.post(`${process.env.REACT_APP_URL}/getUserById`, body)
        .then(async (response) => {
          if (response.data?.fullName != null) {
            const worker = response.data;
            setSbWorkersNames(prevWorkerNames => [...prevWorkerNames, worker]);
            setLoading(false)
          }
        })
        .catch(error => {
          setLoading(false)
        });
    });
    workers.map(async (worker) => {
      const reqBody = {
        id: worker
      };
      await axios.post(`${process.env.REACT_APP_URL}/getUserById`, reqBody)
        .then(async(response) => {
          const workerData = response.data;
          if (workerData && workerData.fullName && !(props.standBy.includes(response.data._id))) { 
            setWorkersArr(prevWorkers => [...prevWorkers, workerData]);
            setLoading(false);
          }
        })
        .catch(error => {
          setLoading(false);
        })
    });
  }, []);

  const showTime = (workerId) => {
    const data = props.shiftData.find(obj => obj.userId === workerId);
    Swal.fire({
      title: 'שעות עבודה לעובד',
      text: data.end ? `${getHour(data.end)}${data.start ? ` - ${getHour(data.start)}` : ` - ${getHour(props.startTime)}`}` : `${getHour(props.endTime)}${data.start ? ` - ${getHour(data.start)}` : ` - ${getHour(props.startTime)}`}`,
      confirmButtonColor: '#34a0ff',
      confirmButtonText: 'סגירה',
    });
  };

  const showMessage = (workerId) => {
    const data = props.shiftData.find(obj => obj.userId === workerId);
    Swal.fire({
      title: 'הודעה לעובד',
      text: data.message,
      confirmButtonColor: '#34a0ff',
      confirmButtonText: 'סגירה',
    });
  }

  const getShiftData = (worker, index) => {
    let data = null;
    data = props.shiftData.find(obj => obj.userId === worker._id)
    return data ?
      worker._id !== data.userId ?
        <div key={index} className={styles.all_data_div_clear}>
          <div className={styles.name}>•&nbsp;{worker.fullName}</div>
          <div>
            {worker.role ? <div className={styles.role_div}> - {worker.role.name}</div> :null}
          </div>
        </div>
        :
        <div key={index} className={styles.all_data_div}>
          <div className={styles.name_role_div}>
            <div className={styles.name}>•&nbsp;{worker.fullName}</div>

            <div>
            {worker.role ? <div className={styles.role_div}>&nbsp;- {worker.role.name}</div> :null}
            </div>
          </div>

          <div className={styles.alert_div}>
            {data.end || data.start ?
              <div>
                <BiTime className={styles.icon} onClick={() => showTime(worker._id)} />
              </div> : null}
            
            {data.message ?
              <div>
                <AiOutlineMessage className={styles.icon} onClick={() => showMessage(worker._id)} />
              </div>: null}
          </div>

        </div>
        :
        <div key={index} className={styles.all_data_div_clear}>
          <div className={styles.name}>•&nbsp;{worker.fullName}</div>
          <div>
          {worker.role ? <div className={styles.role_div}> - {worker.role.name}</div> :null}
          </div>
        </div>
  }

  const getShiftDataSB = (worker, index) => {
    let data = null;
    data = props.shiftData.find(obj => obj.userId === worker._id)
    return data ?
      worker._id !== data.userId ?
        <div key={index} className={styles.all_data_div_clear}>
          <div className={styles.name}>•&nbsp;{worker.fullName}</div>
          <div>
            {worker.role ? <div className={styles.role_div}>- כוננות ,{worker.role.name}</div>
            :
            <div className={styles.role_div}>- כוננות</div>
            }
          </div>
        </div>
        :
        <div key={index} className={styles.all_data_div}>
          <div className={styles.name_role_div}>
            <div className={styles.name}>•&nbsp;{worker.fullName}</div>

            <div>
              {worker.role ? <div className={styles.role_div}>- כוננות ,{worker.role.name}</div>
              :
              <div className={styles.role_div}>- כוננות</div>
              }
            </div>
          </div>

          <div className={styles.alert_div}>
            {data.end || data.start ?
              <div>
                <BiTime className={styles.icon} onClick={() => showTime(worker._id)} />
              </div> : null}
            
            {data.message ?
              <div>
                <AiOutlineMessage className={styles.icon} onClick={() => showMessage(worker._id)} />
              </div>: null}
          </div>

        </div>
        :
        <div key={index} className={styles.all_data_div_clear}>
          <div className={styles.name}>•&nbsp;{worker.fullName}</div>
          <div>
            {worker.role ? <div className={styles.role_div}>- כוננות ,{worker.role.name}</div>
            :
            <div className={styles.role_div}>- כוננות</div>
            }
          </div>
        </div>
  }

  const getWorkers = () => {
    return workersArr.map((worker, index) => (
      getShiftData(worker, index)
    ))
  }

  const getSB = () => {
    return sbWorkersNames.map((worker, index) => (
      getShiftDataSB(worker, index)
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
          {getWorkers()}
          {getSB()}
        </div>)}
  </React.Fragment>

}

export default SeeWorkersCurrentWeek;