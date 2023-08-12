import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import styles from '../CreateWeek/createWeek.module.css';
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiAddToQueue } from "react-icons/bi";
import Swal from 'sweetalert2';
import { FaEdit } from "react-icons/fa";


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

  const getTime = (timeString) => {
    const [selectedHours, selectedMinutes] = timeString.split(":").map(Number);
    let i = new Date();
    i.setHours(selectedHours, selectedMinutes, 0, 0);
    return i;
  }

  // if the worker sent message will pop alert with the his message
    const seeMessage = async (worker) => {
      let message = null;

      const body = {
        weekId: props.weekId,
        userId: worker._id
      };
  
      try {
        const response = await axios.post(`${process.env.REACT_APP_URL}/getMessageOfUser`, body);
        message = response.data.message;
        Swal.fire({
          title: `${message ? worker.fullName + " שלח/ה הודעה" : ''}`,
          html: `<form class="${styles.swal2_content}">
                  <label>${message ? message : ''}</label>
                  <h2>בחירת שעות</h2>
                  <div>
                    <input type='time' id='startTime'></input>
                    <label>:שעת התחלה</label>
                  </div>
                  <div>
                    <input type='time' id='endTime'></input>
                    <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:שעת סיום</label>
                  </div>
                  <h2>כתיבת הודעה</h2>
                </form>`,
          input: 'text',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'אישור',
          cancelButtonText: 'ביטול',
          customClass: {
            popup: styles.swal2_popup,
            title: styles.swal2_title,
            content: styles.swal2_content,
            input: styles.swal2_input
          },
        }).then((result) => {
          if (result.isConfirmed) {
            if (Swal.getPopup().querySelector('#startTime').value !== "" || Swal.getPopup().querySelector('#endTime').value !== "" || result.value !== "") {
              const reqBody = {
                message: result.value,
                startTime: getTime(Swal.getPopup().querySelector('#startTime').value),
                endTime: getTime(Swal.getPopup().querySelector('#endTime').value),
                workerId: worker._id,
                shiftId: props.shift._id,
                dayId: props.dayId,
                managerId: props.managerId
              }
              console.log(reqBody)
              axios.put(`${process.env.REACT_APP_URL}/WorkerShiftMessage`, reqBody).then(response => {
                console.log(response.data);
              })
            }
  
          }
        })
      } catch (error) {
        Swal.fire({
          html: `<form class="${styles.swal2_content}">
                  <h2>בחירת שעות</h2>
                  <div>
                    <input type='time' id='startTime'></input>
                    <label>:שעת התחלה</label>
                  </div>
                  <div>
                    <input type='time' id='endTime'></input>
                    <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:שעת סיום</label>
                  </div>
                  <h2>כתיבת הודעה</h2>
                </form>`,
          input: 'text',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'אישור',
          cancelButtonText: 'ביטול',
          customClass: {
            popup: styles.swal2_popup,
            title: styles.swal2_title,
            content: styles.swal2_content,
            input: styles.swal2_input
          },
        }).then((result) => {
          if (result.isConfirmed) {
            if (Swal.getPopup().querySelector('#startTime').value !== "" || Swal.getPopup().querySelector('#endTime').value !== "" || result.value !== "") {
              const reqBody = {
                message: result.value,
                startTime: getTime(Swal.getPopup().querySelector('#startTime').value),
                endTime: getTime(Swal.getPopup().querySelector('#endTime').value),
                workerId: worker._id,
                shiftId: props.shift._id,
                dayId: props.dayId,
                managerId: props.managerId
              }
              console.log(reqBody)
              axios.put(`${process.env.REACT_APP_URL}/WorkerShiftMessage`, reqBody).then(response => {
                console.log(response.data);
              })
            }
  
          }
        })
      }
      
  };

  return (
    <React.Fragment>
      <div className={styles.workers_list_delete}>
        {workersArr.map((worker, index) => (
          <div key={worker._id} className={styles.nameAndDelete}>
            <div>
              <RiDeleteBin6Line className={styles.icon_delete} onClick={() => removeWorker(worker._id)}></RiDeleteBin6Line>
              <FaEdit onClick={() => seeMessage(worker)} className={styles.icon_edit}></FaEdit>
            </div>
            {worker.fullName && <p className={styles.names}>{worker.fullName}</p>}
          </div>
        ))}

        {availableWorkersArr.map((worker, index) => (
          <div key={index} className={styles.nameAndDelete}>
            <div>
              <BiAddToQueue className={styles.icon_add} onClick={() => choseWorker(worker._id)}></BiAddToQueue>
              <FaEdit onClick={() => seeMessage(worker)} className={styles.icon_edit}></FaEdit>
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
