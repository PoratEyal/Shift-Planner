import axios from 'axios';
import React, { useRef, useEffect, useState } from 'react';
import styles from '../CreateWeek/createWeek.module.css';
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiAddToQueue } from "react-icons/bi";
import { BiTime } from "react-icons/bi";
import Swal from 'sweetalert2';
import { AiOutlineMessage } from "hh";
import messageContext from './messagesContext';

const CurrentWeekWorkers = (props) => {
  const [workers, setWorker] = useState(props.workers);
  const [availableWorkers, setAvailableWorkers] = useState(props.availableWorkers);
  const [newWorkers, setNewWorkers] = useState([]);
  const [availableWorkersArr, setAvailableWorkersArr] = useState([]);
  const [workersArr, setWorkersArr] = useState([]);
  const [updatedWorkers, setUpdatedWorkers] = useState(false);
  const [loading, setLoading] = useState(true);
  const selectRef = useRef(null);
  const weekMessages = React.useContext(messageContext)


  console.log(props.shift._id)


  useEffect(() => {
    if (workers.length == 0) {
      setLoading(false)
    }

    workers.map(worker => {
      const reqBody = {
        id: worker
      }
      axios
        .post(`${process.env.REACT_APP_URL}/getUserById`, reqBody)
        .then(response => {
          setLoading(false);
          const workerData = response.data;
          if (workerData && workerData.fullName) {
            setWorkersArr(prevWorkers => [...prevWorkers, workerData]);
          }
        })
        .catch(error => {
          setLoading(false);
        });
    });

    availableWorkers.map(worker => {
      const reqBody = {
        id: worker
      }
      axios
        .post(`${process.env.REACT_APP_URL}/getUserById`, reqBody)
        .then(response => {
          setLoading(false);
          const workerData = response.data;
          if (workerData && workerData.fullName && !(workers.includes(workerData._id))) {
            setAvailableWorkersArr(prevWorkers => [...prevWorkers, workerData]);
          }
        })
        .catch(error => {
          setLoading(false);
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

  // get the time that the manager set to the worker.
  // if didnt set - he can update the hours of the worker in the specific shift
  const editHours = async (worker) => {
    let currentMessage = null;

    // get the hours that the manager added in the past
    await axios.put(`${process.env.REACT_APP_URL}/getMessageToWorker`,
      {
        workerId: worker._id,
        shiftId: props.shift._id,
        dayId: props.dayId,
        managerId: props.managerId
      }).then(response => {
        currentMessage = response.data;
        if (currentMessage.start) {
          const startTime = new Date(currentMessage.start);
          currentMessage.start = startTime.toTimeString().slice(0, 5);
        }
        if (currentMessage.end) {
          const endTime = new Date(currentMessage.end);
          currentMessage.end = endTime.toTimeString().slice(0, 5);
        }
      }).catch(err => { });

    // added the new hours to the worker
    Swal.fire({
      title: 'עריכת שעות',
      html: `<form class="${styles.swal2_content}">
              <div>
                <input type='time' id='startTime' value=${currentMessage ? (currentMessage.start ? currentMessage.start : "") : ""}></input>
                <label>:שעת התחלה</label>
              </div>
              <div>
                <input type='time' id='endTime' value=${currentMessage ? (currentMessage.end ? currentMessage.end : "") : ""}></input>
                <label>&#8198;&nbsp;&nbsp;&nbsp;&nbsp;:שעת סיום</label>
              </div>
            </form>`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'אישור',
      cancelButtonText: 'ביטול',
      customClass: {
        popup: styles.swal2_popup,
        content: styles.swal2_content
      },
      inputAttributes: {
        dir: 'rtl',
        autofocus: false
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (Swal.getPopup().querySelector('#startTime').value !== "" || Swal.getPopup().querySelector('#endTime').value !== "") {
          const reqBody = {
            message: currentMessage ? currentMessage.message : "",
            startTime: getTime(Swal.getPopup().querySelector('#startTime').value),
            endTime: getTime(Swal.getPopup().querySelector('#endTime').value),
            workerId: worker._id,
            shiftId: props.shift._id,
            dayId: props.dayId,
            managerId: props.managerId
          }
          axios.put(`${process.env.REACT_APP_URL}/WorkerShiftMessage`, reqBody)
        }
      }
    })
  }

  // if the worker sent message will pop alert with the his message
  // the manager can send message to the user for the specific shift
  const seeMessage = async (worker) => {
    let message = null;
    let currentMessage = null;

    // get the message that the manager wrote if he was
    await axios.put(`${process.env.REACT_APP_URL}/getMessageToWorker`,
      {
        workerId: worker._id,
        shiftId: props.shift._id,
        dayId: props.dayId,
        managerId: props.managerId
      }).then(response => {
        currentMessage = response.data;
        if (currentMessage.start) {
          const startTime = new Date(currentMessage.start);
          currentMessage.start = startTime.toTimeString().slice(0, 5);
        }
        if (currentMessage.end) {
          const endTime = new Date(currentMessage.end);
          currentMessage.end = endTime.toTimeString().slice(0, 5);
        }
      }).catch(err => { });

    const body = {
      weekId: props.weekId,
      userId: worker._id
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_URL}/getMessageOfUser`, body).catch(() => { })
      message = response.data.message;
      Swal.fire({
        title: `${message ? worker.fullName + " שלח/ה הודעה" : ''}`,
        html: `<form class="${styles.swal2_content}">
                  <p>${message ? message : ''}</p>
                  <h2>כתיבת הודעה ל${worker.fullName}</h2>
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
          content: styles.swal2_content,
          input: styles.swal2_input
        },
        inputAttributes: {
          dir: 'rtl'
        }
      }).then((result) => {
        if (result.isConfirmed && result.value !== "") {
          const reqBody = {
            message: result.value,
            startTime: currentMessage.start ? getTime(currentMessage.start) : "",
            endTime: currentMessage.end ? getTime(currentMessage.end) : "",
            workerId: worker._id,
            shiftId: props.shift._id,
            dayId: props.dayId,
            managerId: props.managerId
          }
          axios.put(`${process.env.REACT_APP_URL}/WorkerShiftMessage`, reqBody)
        }
      })
    } catch (error) {
      Swal.fire({
        title: 'כתיבת הודעה',
        input: 'text',
        inputValue: currentMessage ? currentMessage.message : "",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'אישור',
        cancelButtonText: 'ביטול',
        customClass: {
          popup: styles.swal2_popup
        },
        inputAttributes: {
          dir: 'rtl',
        }
      }).then((result) => {
        if (result.isConfirmed) {
          if (result.value !== "") {
            const reqBody = {
              message: result.value,
              startTime: currentMessage.start ? getTime(currentMessage.start) : "",
              endTime: currentMessage.end ? getTime(currentMessage.end) : "",
              workerId: worker._id,
              shiftId: props.shift._id,
              dayId: props.dayId,
              managerId: props.managerId
            }
            axios.put(`${process.env.REACT_APP_URL}/WorkerShiftMessage`, reqBody)
          }
        }
      })
    }
  };

  const hasMessage = (id) => {
    if(weekMessages){
    for(let i = 0; i < weekMessages.length; i++){
      if(weekMessages[i].worker === id){
        return true;
      }
    }}
    return false;
  }
  return (
    <React.Fragment>

      {loading ?
        (
          <div className={styles['three-body']}>
            <div className={styles['three-body__dot']}></div>
            <div className={styles['three-body__dot']}></div>
            <div className={styles['three-body__dot']}></div>
          </div>
        ) : (
          <div className={styles.workers_list_delete}>
            {workersArr.map((worker) => (
              <div key={worker._id} className={styles.nameAndDelete}>
                <div>
                  <RiDeleteBin6Line className={styles.icon_delete} onClick={() => removeWorker(worker._id)}></RiDeleteBin6Line>
                  <BiTime onClick={() => editHours(worker)} className={styles.icon_edit}></BiTime>
                  {
                    hasMessage(worker._id) ?
                    <AiOutlineMessage onClick={() => seeMessage(worker)} className={styles.icon_edit}></AiOutlineMessage>
                  :
                  null
                  }
                </div>
                {worker.fullName && <p className={styles.names}>{worker.fullName}</p>}
              </div>
            ))}

            {availableWorkersArr.map((worker) => (
              <div key={worker._id} className={styles.nameAndDelete}>
                <div>
                  <BiAddToQueue className={styles.icon_add} onClick={() => choseWorker(worker._id)}></BiAddToQueue>
                  <BiTime onClick={() => editHours(worker)} className={styles.icon_edit}></BiTime>
                  <AiOutlineMessage onClick={() => seeMessage(worker)} className={styles.icon_edit}></AiOutlineMessage>
                </div>
                {worker.fullName && <p className={styles.names}>{worker.fullName}</p>}
              </div>
            ))}
          </div>
        )}

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
