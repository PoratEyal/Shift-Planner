import axios from 'axios';
import { useEffect, useState } from 'react';
import React from 'react';
import styles from './workers.module.css';
import { FcSynchronize } from "react-icons/fc";

const SeeWorkersCurrentWeek = (props) => {

  const [workers] = useState(props.workers)
  const [workersArr, setWorkersArr] = useState([]);
  const [sbWorkers] = useState(props.standBy);
  const [sbWorkersNames, setSbWorkersNames] = useState([]);
  
  const [grouped, setGrouped] = useState([]);
  const [groupedKeys, setKeys] = useState([]);
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
          setLoading(false)
          if (response.data?.fullName != null) {
            const worker = response.data;
            setGrouped(await groupByIntegerField(grouped, worker));
            setSbWorkersNames(prevWorkerNames => [...prevWorkerNames, worker]);
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
          setLoading(false);
          const workerData = response.data;
          if (workerData && workerData.fullName && !(props.standBy.includes(response.data._id))) { 
            setGrouped(await groupByIntegerField(grouped, workerData));
            setWorkersArr(prevWorkers => [...prevWorkers, workerData]);
          }
        })
        .catch(error => {
          setLoading(false);
          console.error(error);
        })
    });
  }, []);
  const groupByIntegerField = async (grouped, workerData) => {
    const fieldValue = workerData['role'];
    if (fieldValue) {
      const reqBody = {
        id: fieldValue
      }
      const result = await axios.post(`${process.env.REACT_APP_URL}/getRoleWithId`, reqBody)
      if (!grouped[result.data]) {
        setKeys(groupedKeys => [...groupedKeys, result.data]);
        grouped[result.data] = [];
      }
      grouped[result.data].push(workerData);
    }
    return grouped
  };

  console.log(grouped);
  console.log(groupedKeys);

  const getShiftData = (worker, index) => {
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

  const getShiftDataSB = (worker, index) => {
    let data = null;
    data = props.shiftData.find(obj => obj.userId === worker._id)
    return data ?
      (worker._id !== data.userId ?
        <div key={index} className={styles.all_data_div}>
          <div className={styles.name_and_icon_div}>
            <FcSynchronize className={styles.sb_icon}></FcSynchronize>
            <label className={styles.name}>{worker.fullName}</label>
          </div>
        </div>
        :
        <div key={index} className={styles.all_data_div}>
          <div className={styles.name_and_icon_div}>
            <FcSynchronize className={styles.sb_icon}></FcSynchronize>
            <label className={styles.name}>{worker.fullName}</label>
          </div>

          <div className={styles.hours_message_div}>
            <label>
              {data.end ? getHour(data.end) : getHour(props.endTime)}
              {data.start ? ` - ${getHour(data.start)}` : ` - ${getHour(props.startTime)}`}
            </label>
          </div>
        </div>)
      : <div key={index} className={styles.all_data_div}>
        <div className={styles.name_and_icon_div}>
          <FcSynchronize className={styles.sb_icon}></FcSynchronize>
          <label className={styles.name}>{worker.fullName}</label>
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