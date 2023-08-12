import axios from 'axios';
import { useEffect, useState } from 'react';
import styles from './chooseShifts.module.css';
import Swal from 'sweetalert2';
import { FaEdit } from "react-icons/fa";

const WorkerList = (props) => {

  const [workers, setWorkers] = useState(props.workers)
  const [workerNames, setWorkerNames] = useState([]);
  const [loading, setLoading] = useState(null)

  // get the user fullname and show him in the list of the workers for this shift
  useEffect(() => {
    console.log(props.shiftData)
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
      confirmButtonText: 'אישור',
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
            <div key={index} className={styles.nameAndDelete}>
              <p className={styles.names}>{worker.fullName}&nbsp;•</p>
            </div>
            :
            <div key={index} className={styles.nameAndDelete}>
              <p className={styles.names}>
                {props.shiftData.message ?<FaEdit onClick={() => seeMessage(worker)} className={styles.icon_edit}></FaEdit>: null}
                {props.shiftData.end ?  (getHour(props.shiftData.end) +":שעת סיום"): null}
                {props.shiftData.start? (getHour(props.shiftData.start) +":שעת התחלה") : null}
                {worker.fullName}&nbsp;•</p>
            </div>)
          : <div key={index} className={styles.nameAndDelete}>
            <p className={styles.names}>{worker.fullName}&nbsp;•</p>
          </div>
      ))
    }
  </div>
}

export default WorkerList;
