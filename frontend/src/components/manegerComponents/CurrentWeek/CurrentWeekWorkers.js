import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import styles from "./CurrentWeek.module.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiTime } from "react-icons/bi";
import Swal from "sweetalert2";
import { AiOutlineMessage } from "react-icons/ai";
import messageContext from "./messagesContext";
import { FiMoreHorizontal } from "react-icons/fi";
import { AiOutlineSync } from "react-icons/ai";

const CurrentWeekWorkers = (props) => {
    const [workers] = useState(props.workers);
    const [availableWorkers] = useState(props.availableWorkers);

    const [newWorkers, setNewWorkers] = useState([]);

    const [availableWorkersArr, setAvailableWorkersArr] = useState([]);
    const [workersArr, setWorkersArr] = useState([]);

    const [sbWorkers, setSbWorkers] = useState(props.shift.standBy);
    const [sbWorkersArr, setSbWorkersArr] = useState([]);

    const [updatedWorkers, setUpdatedWorkers] = useState(false);
    const [loading, setLoading] = useState(true);

    // select option
    const [openOptions, setOpenOptions] = useState(null);
    const [isDivVisible, setDivVisible] = useState(false);
    const divRef = useRef(null);

    const selectRef = useRef("");
    const selectreF = useRef("");

    const weekMessages = React.useContext(messageContext);

    useEffect(() => {
        if (workers.length == 0) {
            setLoading(false);
        }

        workers.map((worker) => {
            const reqBody = {
                id: worker,
            };
            axios
                .post(`${process.env.REACT_APP_URL}/getUserById`, reqBody)
                .then((response) => {
                    setLoading(false);
                    const workerData = response.data;
                    if (workerData && workerData.fullName && !sbWorkers.includes(workerData._id)) {
                        setWorkersArr((prevWorkers) => [...prevWorkers, workerData]);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                });
        });

        availableWorkers.map((worker) => {
            const reqBody = {
                id: worker,
            };
            axios
                .post(`${process.env.REACT_APP_URL}/getUserById`, reqBody)
                .then((response) => {
                    setLoading(false);
                    const workerData = response.data;
                    if (
                        workerData &&
                        workerData.fullName &&
                        !workers.includes(workerData._id) &&
                        !sbWorkers.includes(workerData._id)
                    ) {
                        setAvailableWorkersArr((prevWorkers) => [...prevWorkers, workerData]);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                });
        });

        sbWorkers.map((worker) => {
            const reqBody = {
                id: worker,
            };
            axios
                .post(`${process.env.REACT_APP_URL}/getUserById`, reqBody)
                .then((response) => {
                    setLoading(false);
                    const workerData = response.data;
                    if (workerData && workerData.fullName) {
                        setSbWorkersArr((prevWorkers) => [...prevWorkers, workerData]);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                });
        });

        const reqBody = {
            workers: [...workers, ...availableWorkers],
            manager: props.managerId,
        };

        axios
            .post(`${process.env.REACT_APP_URL}/getAllWorkers`, reqBody)
            .then((response) => {
                setNewWorkers(response.data);
            })
            .catch((err) => {});
    }, []);

    const choseWorker = (id) => {
        props.addWorkerShift(id);
        setUpdatedWorkers(!updatedWorkers);
    };

    const removeWorker = (id) => {
        Swal.fire({
            title: "? האם להסיר את העובד",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34a0ff",
            cancelButtonColor: "#d33",
            confirmButtonText: "אישור",
            cancelButtonText: "ביטול",
            customClass: {
                popup: styles.swal2_popup,
                title: styles.swal2_title,
            },
        }).then((result) => {
            if (result.isConfirmed) {
                props.removeWorkerShift(id);
                setUpdatedWorkers(!updatedWorkers);
            }
        });
    };

    const delSbworker = (id) => {
        Swal.fire({
            title: "? האם להסיר מכוננות",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#34a0ff",
            cancelButtonColor: "#d33",
            confirmButtonText: "אישור",
            cancelButtonText: "ביטול",
            customClass: {
                popup: styles.swal2_popup,
                title: styles.swal2_title,
            },
        }).then(async (result) => {
            if (result.isConfirmed) {
                await props.delSb(id);
                setUpdatedWorkers(!updatedWorkers);
            }
        });
    };

    const getTime = (timeString) => {
        const [selectedHours, selectedMinutes] = timeString.split(":").map(Number);
        let i = new Date();
        i.setHours(selectedHours, selectedMinutes, 0, 0);
        return i;
    };

    // get the time that the manager set to the worker.
    // if didnt set - he can update the hours of the worker in the specific shift
    const editHours = async (worker) => {
        let currentMessage = null;

        // get the hours that the manager added in the past
        await axios
            .put(`${process.env.REACT_APP_URL}/getMessageToWorker`, {
                workerId: worker._id,
                shiftId: props.shift._id,
                dayId: props.dayId,
                managerId: props.managerId,
            })
            .then((response) => {
                currentMessage = response.data;
                if (currentMessage.start) {
                    const startTime = new Date(currentMessage.start);
                    currentMessage.start = startTime.toTimeString().slice(0, 5);
                }
                if (currentMessage.end) {
                    const endTime = new Date(currentMessage.end);
                    currentMessage.end = endTime.toTimeString().slice(0, 5);
                }
            })
            .catch((err) => {});

        // added the new hours to the worker
        Swal.fire({
            title: "בחירת שעות",
            html: `<form class="${styles.swal2_content}">
              <div>
                <input type='time' id='startTime' value=${
                    currentMessage ? (currentMessage.start ? currentMessage.start : "") : ""
                }></input>
                <label>:שעת התחלה</label>
              </div>
              <div>
                <input type='time' id='endTime' value=${
                    currentMessage ? (currentMessage.end ? currentMessage.end : "") : ""
                }></input>
                <label>&#8198;&nbsp;&nbsp;&nbsp;&nbsp;:שעת סיום</label>
              </div>
            </form>`,
            showCancelButton: true,
            confirmButtonColor: "#34a0ff",
            cancelButtonColor: "#d33",
            confirmButtonText: "אישור",
            cancelButtonText: "ביטול",
            customClass: {
                popup: styles.swal2_popup,
                content: styles.swal2_content,
            },
            inputAttributes: {
                dir: "rtl",
                autofocus: false,
            },
        }).then((result) => {
            if (result.isConfirmed) {
                if (
                    Swal.getPopup().querySelector("#startTime").value !== "" ||
                    Swal.getPopup().querySelector("#endTime").value !== ""
                ) {
                    const reqBody = {
                        message: currentMessage ? currentMessage.message : "",
                        startTime: getTime(Swal.getPopup().querySelector("#startTime").value),
                        endTime: getTime(Swal.getPopup().querySelector("#endTime").value),
                        workerId: worker._id,
                        shiftId: props.shift._id,
                        dayId: props.dayId,
                        managerId: props.managerId,
                    };
                    axios
                        .put(`${process.env.REACT_APP_URL}/WorkerShiftMessage`, reqBody)
                        .then(() => {
                            Swal.fire({
                                title: "השעות נבחרו בהצלחה",
                                icon: "success",
                                confirmButtonColor: "#34a0ff",
                                confirmButtonText: "אישור",
                                customClass: {
                                    popup: styles.swal2_popup,
                                    title: styles.swal2_title,
                                },
                            });
                        });
                }
            }
        });
    };

    const getWorkerMessage = (id) => {
        if (weekMessages) {
            for (let i = 0; i < weekMessages.length; i++) {
                if (weekMessages[i].worker === id) {
                    return weekMessages[i];
                }
            }
        }
        return null;
    };

    // if the worker sent message will pop alert with the his message
    const seeMessage = async (worker) => {
        let message = null;
        message = await getWorkerMessage(worker._id);

        if (message) {
            Swal.fire({
                title: `${worker.fullName} שלח/ה הודעה`,
                html: `<form class="${styles.swal2_content}">
                  <p>${message.message}</p>
                </form>`,
                confirmButtonColor: "#34a0ff",
                confirmButtonText: "סגור",
                customClass: {
                    popup: styles.swal2_popup,
                    content: styles.swal2_content,
                    input: styles.swal2_input,
                    title: styles.swal2_title,
                },
                inputAttributes: {
                    dir: "rtl",
                },
            });
        }
    };

    // manager write messagwe to the worker
    const writeMessage = async (worker) => {
        let currentMessage = null;

        // get the message that the manager wrote if he was
        await axios
            .put(`${process.env.REACT_APP_URL}/getMessageToWorker`, {
                workerId: worker._id,
                shiftId: props.shift._id,
                dayId: props.dayId,
                managerId: props.managerId,
            })
            .then((response) => {
                currentMessage = response.data;
                if (currentMessage.start) {
                    const startTime = new Date(currentMessage.start);
                    currentMessage.start = startTime.toTimeString().slice(0, 5);
                }
                if (currentMessage.end) {
                    const endTime = new Date(currentMessage.end);
                    currentMessage.end = endTime.toTimeString().slice(0, 5);
                }
            })
            .catch((err) => {});

        try {
            Swal.fire({
                title: `כתיבת הודעה ל${worker.fullName}`,
                input: "text",
                inputValue: currentMessage ? currentMessage.message : "",
                showCancelButton: true,
                confirmButtonColor: "#34a0ff",
                cancelButtonColor: "#d33",
                confirmButtonText: "אישור",
                cancelButtonText: "ביטול",
                customClass: {
                    popup: styles.swal2_popup,
                    title: styles.swal2_title,
                },
                inputAttributes: {
                    dir: "rtl",
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    if (result.value !== "") {
                        const reqBody = {
                            message: result.value,
                            workerId: worker._id,
                            shiftId: props.shift._id,
                            dayId: props.dayId,
                            managerId: props.managerId,
                        };
                        axios
                            .put(`${process.env.REACT_APP_URL}/WorkerShiftMessage`, reqBody)
                            .then(() => {
                                Swal.fire({
                                    title: "ההודעה נשלחה בהצלחה",
                                    icon: "success",
                                    confirmButtonColor: "#34a0ff",
                                    confirmButtonText: "אישור",
                                    customClass: {
                                        popup: styles.swal2_popup,
                                        title: styles.swal2_title,
                                    },
                                });
                            });
                    }
                }
            });
        } catch (error) {}
    };

    // checkes if the worker has a message. if yes return true, else return false
    const hasMessage = (id) => {
        if (weekMessages) {
            for (let i = 0; i < weekMessages.length; i++) {
                if (weekMessages[i].worker === id) {
                    return true;
                }
            }
        }
        return false;
    };

    // when click on the ... icon - set those two states
    const options = (workerId) => {
        setOpenOptions(workerId);
        setDivVisible(true);
    };

    // control on the close and open the option select
    useEffect(() => {
        function handleOutsideClick(event) {
            if (divRef.current && !divRef.current.contains(event.target)) {
                setDivVisible(false);
            }
        }

        if (isDivVisible) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [isDivVisible]);

    return (
        <React.Fragment>
            {loading ? (
                <div className={styles["three-body"]}>
                    <div className={styles["three-body__dot"]}></div>
                    <div className={styles["three-body__dot"]}></div>
                    <div className={styles["three-body__dot"]}></div>
                </div>
            ) : (
                <div className={styles.workers_list_delete}>
                    {workersArr.map((worker, index) => (
                        <div key={index} className={styles.nameAndDelete}>
                            <div className={styles.label_edit_select}>
                                <FiMoreHorizontal
                                    onClick={() => options(worker._id)}
                                    className={styles.icon_edit}
                                ></FiMoreHorizontal>

                                {/* <RiDeleteBin6Line className={styles.icon_delete} onClick={() => removeWorker(worker._id)}></RiDeleteBin6Line> */}

                                {openOptions === worker._id && isDivVisible ? (
                                    <div ref={divRef} className={styles.edit_div_options}>
                                        <div className={styles.edit_div_flex}>
                                            <label onClick={() => editHours(worker)}>
                                                בחירת שעות
                                            </label>
                                            <BiTime
                                                className={styles.icon_edit_select}
                                                onClick={() => editHours(worker)}
                                            ></BiTime>
                                        </div>

                                        <div className={styles.edit_div_flex}>
                                            <label onClick={() => writeMessage(worker)}>
                                                כתיבת הודעה
                                            </label>
                                            <AiOutlineMessage
                                                className={styles.icon_edit_select}
                                                onClick={() => writeMessage(worker)}
                                            ></AiOutlineMessage>
                                        </div>

                                        <div className={styles.edit_div_flex}>
                                            <label onClick={() => props.addSB(worker._id)}>
                                                כוננות
                                            </label>
                                            <AiOutlineSync
                                                className={styles.icon_edit_select}
                                                onClick={() => props.addSB(worker._id)}
                                            ></AiOutlineSync>
                                        </div>

                                        <div className={styles.edit_div_flex}>
                                            <label onClick={() => removeWorker(worker._id)}>
                                                מחיקת עובד
                                            </label>
                                            <RiDeleteBin6Line
                                                className={styles.icon_edit_select}
                                                onClick={() => removeWorker(worker._id)}
                                            ></RiDeleteBin6Line>
                                        </div>
                                    </div>
                                ) : null}

                                {hasMessage(worker._id) ? (
                                    <AiOutlineMessage
                                        onClick={() => seeMessage(worker)}
                                        className={styles.icon_message_alert}
                                    ></AiOutlineMessage>
                                ) : null}
                            </div>

                            <div className={styles.name_role_div}>
                                <label>
                                    {worker.fullName && (
                                        <p className={styles.names}>{worker.fullName}</p>
                                    )}
                                </label>
                                {worker.role ? (
                                    <div className={styles.role_sb_div}>({worker.role.name})</div>
                                ) : null}
                            </div>
                        </div>
                    ))}

                    {sbWorkersArr.map((worker, index) => (
                        <div key={index} className={styles.nameAndDelete}>
                            <div className={styles.label_edit_select}>
                                <FiMoreHorizontal
                                    onClick={() => options(worker._id)}
                                    className={styles.icon_edit}
                                ></FiMoreHorizontal>

                                {openOptions === worker._id && isDivVisible ? (
                                    <div ref={divRef} className={styles.edit_div_options}>
                                        <div className={styles.edit_div_flex}>
                                            <label
                                                className={styles.text_edit_select}
                                                onClick={() => editHours(worker)}
                                            >
                                                בחירת שעות
                                            </label>
                                            <BiTime
                                                className={styles.icon_edit_select}
                                                onClick={() => editHours(worker)}
                                            ></BiTime>
                                        </div>

                                        <div className={styles.edit_div_flex}>
                                            <label
                                                className={styles.text_edit_select}
                                                onClick={() => writeMessage(worker)}
                                            >
                                                כתיבת הודעה
                                            </label>
                                            <AiOutlineMessage
                                                className={styles.icon_edit_select}
                                                onClick={() => writeMessage(worker)}
                                            ></AiOutlineMessage>
                                        </div>

                                        <div className={styles.edit_div_flex}>
                                            <label
                                                className={styles.text_edit_select}
                                                onClick={() => delSbworker(worker._id)}
                                            >
                                                הסרת כוננות
                                            </label>
                                            <AiOutlineSync
                                                className={styles.icon_edit_select}
                                                onClick={() => delSbworker(worker._id)}
                                            ></AiOutlineSync>
                                        </div>
                                    </div>
                                ) : null}

                                {hasMessage(worker._id) ? (
                                    <AiOutlineMessage
                                        onClick={() => seeMessage(worker)}
                                        className={styles.icon_message_alert}
                                    ></AiOutlineMessage>
                                ) : null}
                            </div>

                            <div className={styles.name_role_div}>
                                <label>
                                    {worker.fullName && (
                                        <p className={styles.names}>{worker.fullName}</p>
                                    )}
                                </label>
                                {worker.role ? (
                                    <div className={styles.role_sb_div}>
                                        (כוננות ,{worker.role.name})
                                    </div>
                                ) : (
                                    <div className={styles.role_sb_div}>(כוננות)</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className={styles.add_available_worker_div}>
                <label>הוספת עובד שביקש את המשמרת</label>

                <select
                    className={styles.add_specific_worker_select}
                    ref={selectreF}
                    defaultValue=""
                    onChange={() => choseWorker(selectreF.current.value)}
                >
                    <option value="" disabled>
                        הוספת עובד שביקש את המשמרת
                    </option>
                    {availableWorkersArr.map((elem, index) => (
                        <option key={index} value={elem._id}>
                            {elem.fullName}
                        </option>
                    ))}
                </select>
            </div>

            <div className={styles.add_specific_worker_div}>
                <label>הוספת עובד למשמרת</label>

                <select
                    className={styles.add_specific_worker_select}
                    ref={selectRef}
                    defaultValue=""
                    onChange={() => choseWorker(selectRef.current.value)}
                >
                    <option value="" disabled>
                        הוספת עובד למשמרת
                    </option>
                    {newWorkers.map((elem, index) => (
                        <option key={index} value={elem._id}>
                            {elem.fullName}
                        </option>
                    ))}
                </select>
            </div>
        </React.Fragment>
    );
};

export default CurrentWeekWorkers;
