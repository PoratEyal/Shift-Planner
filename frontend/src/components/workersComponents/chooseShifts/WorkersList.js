import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './chooseShifts.module.css';
import Swal from 'sweetalert2';
import { FcSynchronize } from "react-icons/fc";
import { AiOutlineMessage } from "react-icons/ai";

const WorkerList = (props) => {

  const [workers] = useState(props.workers)
  const [workerNames, setWorkerNames] = useState([]);

  const [sbWorkers] = useState(props.standBy)
  const [sbWorkersNames, setSbWorkersNames] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if(workers.length == 0){
      setLoading(false)
    }

    sbWorkers.map(worker => {
      const body = {
        id: worker
      }
      axios.post(`${process.env.REACT_APP_URL}/getUserById`, body)
        .then(response => {
          setLoading(false)
          if (response.data?.fullName != null) {
            const worker = response.data;
            setSbWorkersNames(prevWorkerNames => [...prevWorkerNames, worker]);
          }
        })
        .catch(error => {
          setLoading(false)
        });
    });

    workers.map(worker => {
      const body = {
        id: worker
      }
      axios.post(`${process.env.REACT_APP_URL}/getUserById`, body)
        .then(response => {
          setLoading(false)
          if (response.data?.fullName != null && !(props.standBy.includes(response.data._id))) {
            const worker = response.data;
            setWorkerNames(prevWorkerNames => [...prevWorkerNames, worker]);
          }
        })
        .catch(error => {
          setLoading(false)
        });
    });
  }, []);

  const seeMessage = (data) => {
    Swal.fire({
      title: `הודעה מהמנהל`,
      html:
      `<div class="${styles.content}">${data.message}</div>`,
      confirmButtonColor: '#34a0ff',
      confirmButtonText: 'סגור',
      customClass: {
        title: styles.swal2_title,
        content: styles.content
      },
    })
  }

  const getShiftData = (worker, index) => {
    let data = null;
    data = props.shiftData.find(obj => obj.userId === worker._id);
    
    return data ? (
      worker._id !== data.userId ? (
        <div key={index} className={styles.all_data_div}>
          {user._id !== worker._id ? 
            <div>•&nbsp;{worker.fullName}</div>
          :
            <div className={styles.bold_name}>•&nbsp;{worker.fullName}</div>}
        </div>
      )
      :
      (
        <div key={index} className={styles.all_data_div}>
          
          {user._id !== worker._id ? 
            <div className={styles.name}>•&nbsp;{worker.fullName}</div>
          :
            <div className={styles.bold_name}>•&nbsp;{worker.fullName}</div>}

          <div className={styles.hours_message_div}>
            <label>
              {data.end ? getHour(data.end) : getHour(props.endTime)}
              {data.start ? ` - ${getHour(data.start)}` : ` - ${getHour(props.startTime)}`}
            </label>

            {worker._id === user._id ? (
              data.message ? (
                <AiOutlineMessage className={styles.icon} onClick={() => seeMessage(data)}></AiOutlineMessage>
              ) : null
            ) : null}
          </div>

        </div>
      )
    ) : (
      <div key={index} className={styles.all_data_div}>
        {user._id !== worker._id ? 
          <div>•&nbsp;{worker.fullName}</div>
        :
          <div className={styles.bold_name}>•&nbsp;{worker.fullName}</div>}
      </div>
    );
  };

  const getShiftDataSB = (worker, index) => {
    let data = null;
    data = props.shiftData.find(obj => obj.userId === worker._id);
    
    return data ? (
      worker._id !== data.userId ? (
        <div key={index} className={styles.all_data_div}>
          {user._id !== worker._id ? 
            <div className={styles.name_and_icon_div}>
              <FcSynchronize className={styles.sb_icon}></FcSynchronize>
              <label>{worker.fullName}</label>
            </div>
          :
            <div className={styles.name_and_icon_div}>
              <FcSynchronize className={styles.sb_icon}></FcSynchronize>
              <label className={styles.bold_name}>{worker.fullName}</label>
            </div>}
        </div>
      )
      :
      (
        <div key={index} className={styles.all_data_div}>
          
          {user._id !== worker._id ? 
            <div className={styles.name_and_icon_div}>
              <FcSynchronize className={styles.sb_icon}></FcSynchronize>
              <label className={styles.name}>{worker.fullName}</label>
            </div>
          :
            <div className={styles.name_and_icon_div}>
              <FcSynchronize className={styles.sb_icon}></FcSynchronize>
              <label className={styles.bold_name}>{worker.fullName}</label>
            </div>}

          <div className={styles.hours_message_div_SB}>
            <label>
              {data.end ? getHour(data.end) : getHour(props.endTime)}
              {data.start ? ` - ${getHour(data.start)}` : ` - ${getHour(props.startTime)}`}
            </label>

            {worker._id === user._id ? (
              data.message ? (
                <AiOutlineMessage onClick={() => seeMessage(data)}></AiOutlineMessage>
              ) : null
            ) : null}
          </div>

        </div>
      )
    ) : (
      <div key={index} className={styles.all_data_div}>
        {user._id !== worker._id ? 
          <div className={styles.name_and_icon_div}>
            <label><FcSynchronize className={styles.sb_icon}></FcSynchronize></label>
            <labe>{worker.fullName}</labe>
          </div>
        :
          <div className={styles.name_and_icon_div}>
            <FcSynchronize className={styles.sb_icon}></FcSynchronize>
            <label className={styles.bold_name}>{worker.fullName}</label>
          </div>}
      </div>
    );
  };

  const getWorkers = () => {
    return workerNames.map((worker, index) => (
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
        </div>
    )}
  </React.Fragment>
}

export default WorkerList;
