import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './chooseShifts.module.css';
import Swal from 'sweetalert2';
import { AiOutlineMessage } from "react-icons/ai";

const WorkerList = (props) => {

  const [workers, setWorkers] = useState(props.workers)
  const [workerNames, setWorkerNames] = useState([]);
  const [loading, setLoading] = useState(null)

  // get the user fullname and show him in the list of the workers for this shift
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

  const seeMessage = () => {
    Swal.fire({
      title: `הודעה מהמנהל`,
      text: props.shiftData.message,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'סגור',
      customClass: {
        popup: styles.swal2_popup,
        title: styles.swal2_title,
        content: styles.swal2_content,
      },
    })
  }

  const getHour = (dateTime) => {
    const time = new Date(dateTime);
    dateTime = time.toTimeString().slice(0, 5);
    return dateTime 
  }
  
  return <div className={styles.workers_showList}>
    {
      workerNames.map((worker, index) => (
        props.shiftData ?
          (worker._id !== props.shiftData.userId ?
            <div key={index} className={styles.all_data_div}>
                <div>•&nbsp;{worker.fullName}</div>
            </div>
            :
            <div key={index} className={styles.all_data_div}>
                <div className={styles.name}>•&nbsp;{worker.fullName}</div>

                <div className={styles.hours_message_div}>
                  <label>
                    {props.shiftData.start ? getHour(props.shiftData.start) : null}
                    {props.shiftData.end ? ` - ${getHour(props.shiftData.end)}` : null}
                  </label>
                  
                  {props.shiftData.message ?<AiOutlineMessage onClick={() => seeMessage(worker)}></AiOutlineMessage>: null}
                </div>
            </div>)
          : <div key={index} className={styles.all_data_div}>
                <div>•&nbsp;{worker.fullName}</div>
          </div>
      ))
    }
  </div>
}

export default WorkerList;
