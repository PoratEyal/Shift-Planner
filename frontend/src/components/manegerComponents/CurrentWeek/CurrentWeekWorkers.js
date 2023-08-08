import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import styles from '../CreateWeek/createWeek.module.css';
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiOutlineMessage } from "react-icons/ai";
import { BiAddToQueue } from "react-icons/bi";
import Swal from 'sweetalert2';

const CurrentWeekWorkers = (props) => {
  const [workers, setWorker] = useState(props.workers);
  const [availableWorkers, setAvailableWorkers] = useState(props.availableWorkers);
  const [newWorkers, setNewWorkers] = useState([]); // Initialize newWorkers as an empty array

  const [availableWorkersArr, setAvailableWorkersArr] = useState([]);
  const [workersArr, setWorkersArr] = useState([]);

  const [updatedWorkers, setUpdatedWorkers] = useState(false);

  const selectRef = useRef(null);

  // get all the workers
  useEffect(() => {
    workers.map(worker => {
      const reqBody = {
        id: worker
      }
      axios
        .post(`${process.env.REACT_APP_URL}/getUserById`, reqBody)
        .then(response => {
          const workerData = response.data;
          if (workerData && workerData.fullName) {
            setWorkersArr(prevWorkers => [...prevWorkers, workerData]);
          }
        })
        .catch(error => {
          console.error(error);
        });
    });

    availableWorkers.map(worker => {
      const reqBody = {
        id: worker
      }
      axios
        .post(`${process.env.REACT_APP_URL}/getUserById`, reqBody)
        .then(response => {
          const workerData = response.data;
          if (workerData && workerData.fullName && !(workers.includes(workerData._id))) {
            setAvailableWorkersArr(prevWorkers => [...prevWorkers, workerData]);
          }
        })
        .catch(error => {
          console.error(error);
        });
    });

    const reqBody = {
      workers: [...workers, ...availableWorkers],
      manager: props.managerId
    };

    axios
      .post(`${process.env.REACT_APP_URL}/getAllWorkers`, reqBody)
      .then(response => {
        setNewWorkers(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  const choseWorker = (id) => {
    props.addWorkerShift(id);
    setUpdatedWorkers(!updatedWorkers);
  };

  const removeWorker = (id) => {
    props.removeWorkerShift(id);
    setUpdatedWorkers(!updatedWorkers);
  };

  // if the worker sent message will pop alert with the his message
  const seeMessage = (worker) => {
    const body = {
      weekId: props.weekId,
      userId: worker._id
    }

    axios.post(`${process.env.REACT_APP_URL}/getMessageOfUser`, body)
    .then(response => {
      Swal.fire({
        title: `${worker.fullName}: ${response.data.message}`,
        text: '',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'סגור'
      })
    })
    .catch(error => {
      console.error(error);
    });
  };

  return (
    <React.Fragment>
      <div className={styles.workers_list_delete}>
        {workersArr.map((worker, index) => (
          <div key={worker._id} className={styles.nameAndDelete}>
            <div>
              <RiDeleteBin6Line className={styles.icon_delete} onClick={() => removeWorker(worker._id)}></RiDeleteBin6Line>
              <AiOutlineMessage onClick={() => seeMessage(worker)} className={styles.icon_message}></AiOutlineMessage>
            </div>
            {worker.fullName && <p className={styles.names}>{worker.fullName}</p>}
          </div>
        ))}

        {availableWorkersArr.map((worker, index) => (
          <div key={index} className={styles.nameAndDelete}>
            <div>
              <BiAddToQueue className={styles.icon_add} onClick={() => choseWorker(worker._id)}></BiAddToQueue>
              <AiOutlineMessage onClick={() => seeMessage(worker)} className={styles.icon_message}></AiOutlineMessage>
            </div>
            {worker.fullName && <p className={styles.names}>{worker.fullName}</p>}
          </div>
        ))}
      </div>
      
      <div className={styles.add_specific_worker_div}>
          <div>
            <button onClick={() => { choseWorker(selectRef.current.value) }} className={styles.add_specific_worker_btn}>הוספה</button>
          </div>

          <select className={styles.add_specific_worker_select} ref={selectRef} defaultValue="">
            <option value="" disabled>בחר עובד</option>
            {newWorkers.map((elem, index) => (
              <option key={index} value={elem._id}>{elem.fullName}</option>
            ))}
          </select>
      </div>

    </React.Fragment>
  );
};

export default CurrentWeekWorkers;
