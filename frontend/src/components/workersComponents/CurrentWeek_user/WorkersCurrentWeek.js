import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./currentWeekUser.module.css";
import Swal from "sweetalert2";
import { AiOutlineMessage } from "react-icons/ai";
import { BiTime } from "react-icons/bi";

const WorkersCurrentWeek = (props) => {
    const [workers] = useState(props.workers);
    const [workersArr, setWorkersArr] = useState([]);

    const [sbWorkers] = useState(props.standBy);
    const [sbWorkersNames, setSbWorkersNames] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const [loading, setLoading] = useState(true);

    // get all the workers
    useEffect(() => {
        if (workers.length == 0) {
            setLoading(false);
        }

        sbWorkers.map((worker) => {
            const body = {
                id: worker,
            };
            axios
                .post(`${process.env.REACT_APP_URL}/getUserById`, body)
                .then((response) => {
                    setLoading(false);
                    if (response.data?.fullName != null) {
                        const worker = response.data;
                        setSbWorkersNames((prevWorkerNames) => [...prevWorkerNames, worker]);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                });
        });

        workers.forEach((workerId) => {
            const body = {
                id: workerId,
            };
            axios
                .post(`${process.env.REACT_APP_URL}/getUserById`, body)
                .then((response) => {
                    setLoading(false);
                    const fetchedWorker = response.data;
                    if (
                        fetchedWorker &&
                        fetchedWorker.fullName &&
                        !props.standBy.includes(response.data._id)
                    ) {
                        setWorkersArr((prevWorkers) => [...prevWorkers, fetchedWorker]);
                    }
                })
                .catch((error) => {
                    setLoading(false);
                    console.error(error);
                });
        });
    }, []);

    const seeMessage = (data) => {
        Swal.fire({
            title: `הודעה מהמנהל`,
            html: `<div class="${styles.content}">${data.message}</div>`,
            confirmButtonColor: "#34a0ff",
            confirmButtonText: "סגור",
            customClass: {
                title: styles.swal2_title,
                content: styles.content,
            },
        });
    };

    const showTime = (workerId) => {
        const data = props.shiftData.find((obj) => obj.userId === workerId);
        Swal.fire({
            title: "שעות עבודה לעובד",
            text: data.end
                ? `${getHour(data.end)}${
                      data.start ? ` - ${getHour(data.start)}` : ` - ${getHour(props.startTime)}`
                  }`
                : `${getHour(props.endTime)}${
                      data.start ? ` - ${getHour(data.start)}` : ` - ${getHour(props.startTime)}`
                  }`,
            confirmButtonColor: "#34a0ff",
            confirmButtonText: "סגירה",
        });
    };

    const getShiftData = (worker, index) => {
        let data = null;
        data = props.shiftData.find((obj) => obj.userId === worker._id);

        return data ? (
            worker._id !== data.userId ? (
                <div key={index} className={styles.all_data_div}>
                    {user._id !== worker._id ? (
                        <div key={index} className={styles.all_data_div_clear}>
                            <div className={styles.name}>•&nbsp;{worker.fullName}</div>
                            <div>
                                {worker.role ? (
                                    <div className={styles.role_div}> - {worker.role.name}</div>
                                ) : null}
                            </div>
                        </div>
                    ) : (
                        <div key={index} className={styles.all_data_div_clear}>
                            <div className={styles.bold_name}>•&nbsp;{worker.fullName}</div>
                            <div>
                                {worker.role ? (
                                    <div className={styles.role_div}> - {worker.role.name}</div>
                                ) : null}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div key={index} className={styles.all_data_div}>
                    {user._id !== worker._id ? (
                        <div key={index} className={styles.all_data_div_clear}>
                            <div className={styles.name}>•&nbsp;{worker.fullName}</div>
                            <div>
                                {worker.role ? (
                                    <div className={styles.role_div}> - {worker.role.name}</div>
                                ) : null}
                            </div>
                        </div>
                    ) : (
                        <div key={index} className={styles.all_data_div_clear}>
                            <div className={styles.bold_name}>•&nbsp;{worker.fullName}</div>
                            <div>
                                {worker.role ? (
                                    <div className={styles.role_div}> - {worker.role.name}</div>
                                ) : null}
                            </div>
                        </div>
                    )}

                    <div className={styles.hours_message_div}>
                        <div className={styles.alert_div}>
                            {data.end || data.start ? (
                                <div>
                                    <BiTime
                                        className={styles.icon}
                                        onClick={() => showTime(worker._id)}
                                    />
                                </div>
                            ) : null}

                            <div>
                                {worker._id === user._id ? (
                                    data.message ? (
                                        <AiOutlineMessage
                                            className={styles.icon_message}
                                            onClick={() => seeMessage(data)}
                                        ></AiOutlineMessage>
                                    ) : null
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            )
        ) : (
            <div key={index} className={styles.all_data_div}>
                {user._id !== worker._id ? (
                    <div key={index} className={styles.all_data_div_clear}>
                        <div className={styles.name}>•&nbsp;{worker.fullName}</div>
                        <div>
                            {worker.role ? (
                                <div className={styles.role_div}> - {worker.role.name}</div>
                            ) : null}
                        </div>
                    </div>
                ) : (
                    <div key={index} className={styles.all_data_div_clear}>
                        <div className={styles.bold_name}>•&nbsp;{worker.fullName}</div>
                        <div>
                            {worker.role ? (
                                <div className={styles.role_div}> - {worker.role.name}</div>
                            ) : null}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const getShiftDataSB = (worker, index) => {
        let data = null;
        data = props.shiftData.find((obj) => obj.userId === worker._id);

        return data ? (
            worker._id !== data.userId ? (
                <div key={index} className={styles.all_data_div}>
                    {user._id !== worker._id ? (
                        <div key={index} className={styles.all_data_div_clear}>
                            <div className={styles.name}>•&nbsp;{worker.fullName}</div>
                            <div>
                                {worker.role ? (
                                    <div className={styles.role_div}>
                                        - כוננות ,{worker.role.name}
                                    </div>
                                ) : (
                                    <div className={styles.role_div}>- כוננות</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div key={index} className={styles.all_data_div_clear}>
                            <div className={styles.bold_name}>•&nbsp;{worker.fullName}</div>
                            <div>
                                {worker.role ? (
                                    <div className={styles.role_div}>
                                        - כוננות ,{worker.role.name}
                                    </div>
                                ) : (
                                    <div className={styles.role_div}>- כוננות</div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div key={index} className={styles.all_data_div}>
                    {user._id !== worker._id ? (
                        <div key={index} className={styles.all_data_div_clear}>
                            <div className={styles.name}>•&nbsp;{worker.fullName}</div>
                            <div>
                                {worker.role ? (
                                    <div className={styles.role_div}>
                                        - כוננות ,{worker.role.name}
                                    </div>
                                ) : (
                                    <div className={styles.role_div}>- כוננות</div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div key={index} className={styles.all_data_div_clear}>
                            <div className={styles.bold_name}>•&nbsp;{worker.fullName}</div>
                            <div>
                                {worker.role ? (
                                    <div className={styles.role_div}>
                                        - כוננות ,{worker.role.name}
                                    </div>
                                ) : (
                                    <div className={styles.role_div}>- כוננות</div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className={styles.hours_message_div}>
                        <div className={styles.alert_div}>
                            {data.end || data.start ? (
                                <div>
                                    <BiTime
                                        className={styles.icon}
                                        onClick={() => showTime(worker._id)}
                                    />
                                </div>
                            ) : null}

                            <div>
                                {worker._id === user._id ? (
                                    data.message ? (
                                        <AiOutlineMessage
                                            className={styles.icon_message}
                                            onClick={() => seeMessage(data)}
                                        ></AiOutlineMessage>
                                    ) : null
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            )
        ) : (
            <div key={index} className={styles.all_data_div}>
                {user._id !== worker._id ? (
                    <div key={index} className={styles.all_data_div_clear}>
                        <div className={styles.name}>•&nbsp;{worker.fullName}</div>
                        <div>
                            {worker.role ? (
                                <div className={styles.role_div}>- כוננות ,{worker.role.name}</div>
                            ) : (
                                <div className={styles.role_div}>- כוננות</div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div key={index} className={styles.all_data_div_clear}>
                        <div className={styles.bold_name}>•&nbsp;{worker.fullName}</div>
                        <div>
                            {worker.role ? (
                                <div className={styles.role_div}>- כוננות ,{worker.role.name}</div>
                            ) : (
                                <div className={styles.role_div}>- כוננות</div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const getWorkers = () => {
        return workersArr.map((worker, index) => getShiftData(worker, index));
    };

    const getSB = () => {
        return sbWorkersNames.map((worker, index) => getShiftDataSB(worker, index));
    };

    const getHour = (dateTime) => {
        const time = new Date(dateTime);
        dateTime = time.toTimeString().slice(0, 5);
        return dateTime;
    };

    return (
        <React.Fragment>
            {loading ? (
                <div className={styles["three-body"]}>
                    <div className={styles["three-body__dot"]}></div>
                    <div className={styles["three-body__dot"]}></div>
                    <div className={styles["three-body__dot"]}></div>
                </div>
            ) : (
                <div className={styles.workers_showList}>
                    {getWorkers()}
                    {getSB()}
                </div>
            )}
        </React.Fragment>
    );
};

export default WorkersCurrentWeek;
