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
      let currentMessage = null;
      
      await axios.put(`${process.env.REACT_APP_URL}/getMessageToWorker`, 
      {
        workerId: worker._id,
        shiftId: props.shift._id,
        dayId: props.dayId,
        managerId: props.managerId
      }).then(response => {
        currentMessage = response.data;
        if(currentMessage.start){
        const startTime = new Date(currentMessage.start);
        currentMessage.start = startTime.toTimeString().slice(0, 5);
      }
      if(currentMessage.end){
        const endTime = new Date(currentMessage.end);
      currentMessage.end = endTime.toTimeString().slice(0, 5);
      }
      }).catch(err => {
      });
      const body = {
        weekId: props.weekId,
        userId: worker._id
      };
  
      try {
        const response = await axios.post(`${process.env.REACT_APP_URL}/getMessageOfUser`, body).catch(() => {})
        message = response.data.message;
        Swal.fire({
          title: `${message ? worker.fullName + " שלח/ה הודעה" : ''}`,
          html: `<form class="${styles.swal2_content}">
                  <label>${message ? message : ''}</label>
                  <h2>עריכת שעות</h2>
                  <div>
                    <input type='time' id='startTime' value=${currentMessage ? (currentMessage.start ? currentMessage.start : "") : ""}></input>
                    <label>:שעת התחלה</label>
                  </div>
                  <div>
                    <input type='time' id='endTime' value=${currentMessage ? (currentMessage.end ? currentMessage.end : "" ) : ""}></input>
                    <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:שעת סיום</label>
                  </div>
                  <h2>כתיבת הודעה</h2>
                </form>`,
          input: 'text',
          inputValue: currentMessage ? currentMessage.message : "",
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
          inputAttributes: {
            dir: 'rtl'
          }
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
              axios.put(`${process.env.REACT_APP_URL}/WorkerShiftMessage`, reqBody).then(response => {
               
              })
            }
  
          }
        })
      } catch (error) {
        Swal.fire({
          html: `<form class="${styles.swal2_content}">
                  <h2>עריכת שעות</h2>
                  <div>
                    <input type='time' id='startTime' value=${currentMessage ? (currentMessage.start ? currentMessage.start : "") : ""}></input>
                    <label>:שעת התחלה</label>
                  </div>
                  <div>
                    <input type='time' id='endTime' value=${currentMessage ? (currentMessage.end ? currentMessage.end : "" ) : ""}></input>
                    <label>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:שעת סיום</label>
                  </div>
                  <h2>כתיבת הודעה</h2>
                </form>`,
          input: 'text',
          inputValue: currentMessage ? currentMessage.message : "",
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
          inputAttributes: {
            dir: 'rtl'
          }
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
              axios.put(`${process.env.REACT_APP_URL}/WorkerShiftMessage`, reqBody).then(response => {
                console.log(response.data);
              })
            }
  
          }
        })
      }
      
      currentMessage = null;
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
