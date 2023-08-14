import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './chooseShifts.module.css';
import Swal from 'sweetalert2';
import { AiOutlineMessage } from "react-icons/ai";

const WorkerList = (props) => {

  const [workers, setWorkers] = useState(props.workers)
  const [workerNames, setWorkerNames] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(null)
  useEffect(() => {
    workers.map(worker => {
      const body = {
        id: worker
      }
      axios.post(`${process.env.REACT_APP_URL}/getUserById`, body)
        .then(response => {
          setLoading(true)
          if (response.data?.fullName != null) {
            const worker = response.data;
            setWorkerNames(prevWorkerNames => [...prevWorkerNames, worker]);
          }
        })
        .catch(error => {
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

              {worker._id === user._id ?  (data.message ? <AiOutlineMessage onClick={() => seeMessage(data)}></AiOutlineMessage> : null) : null}
            </div>
          </div>)
        : <div key={index} className={styles.all_data_div}>
          <div>•&nbsp;{worker.fullName}</div>
        </div>
  }


  const getHtml = () => {
    return workerNames.map((worker, index) => (
      getShiftData(worker, index)
    ))
  }
  const getHour = (dateTime) => {
    const time = new Date(dateTime);
    dateTime = time.toTimeString().slice(0, 5);
    return dateTime
  }

  return <div className={styles.workers_showList}>
    {
      getHtml()
    }
  </div>
}

export default WorkerList;
