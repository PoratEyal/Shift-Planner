import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DayCurrentWeek from './DayCurrentWeek'
import styles from './CurrentWeek.module.css'
import { BiSolidHome } from "react-icons/bi";
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ManagerContext } from '../ManagerHomePage';
import { useContext } from 'react';
import { FaMagic } from "react-icons/fa";
import messageContext from './messagesContext';
import { FcAdvertising } from "react-icons/fc";
import { FcApproval } from "react-icons/fc";

const CurrentWeek = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);
    const [weekPublished, setWeekPublished] = useState(null)
    const [weekVisible, setWeekVisible] = useState(null)
    const [workers, setWorkers] = useState(null);
    const [promentToAi, setPromentToAi] = useState('');
    const [loadingAi, setLoadingAi] = useState(false);
    const [weekAi, setWeekAi] = useState(false);
    const [weekMessages, setMessages] = useState(null);
    const [workersCount, setWorkersCount] = useState(null);

    const managerContext = useContext(ManagerContext);
    const managerId = managerContext.getUser();

    // get all the _id's of the workers and all their messages
    const getWorkers = async () => {
        try {
            const body = {
                job: managerId
            }
            const response = await axios.post(`${process.env.REACT_APP_URL}/getMyWorkers`, body);
            setWorkers(response.data.map(item => item._id))

            setPromentToAi
                (`Data of all the week: ${JSON.stringify(week)}
            Return me json with all the shiftsId, workers and availableWorkers fields.
            • Do not write any explanation before or after the Json
            • Double check that you provided all the shiftsId that include into the data of the week.
            example to how your answer should look:
            {
                "shifts": [
                    {
                        "_id": "64e330568c240c5df3653937",
                        "workers": [real time data],
                        "availableWorkers": [real time data]
                    },
                ]
            },`)

        } catch (error) {
            console.error(error);
        }
    };

    // get all the days in the week (from the specific manager)
    const getDays = () => {
        const managerId = managerContext.getUser();
        const reqbody = {
            id: managerId
        }
        axios.post(`${process.env.REACT_APP_URL}/getNextWeek`, reqbody)
            .then((response) => {
                setWeek(response.data);
                setWeekAi(response.data.usedAi)
                setWeekPublished(response.data.publishScheduling)
                setWeekVisible(response.data.visible)
            }).then(() => {
                axios.post(`${process.env.REACT_APP_URL}/getUserMessagesOfWeek`, { weekId: week._id })
                    .then(response => {
                        setMessages(response.data)
                    }).catch(err => console.log(err));
            }).catch(err => console.log(err));
    }

    useEffect(() => {
        getDays();
        getWorkers();
        workersCountHandle();
    }, [weekPublished, weekVisible, promentToAi]);
    
    // show alert, if the manager select "yes" - week publish
    const publishSchedule = () => {
        Swal.fire({
            title: 'האם ברצונך לפרסם את השיבוצים לשבוע הבא',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ביטול',
            confirmButtonColor: '#34a0ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'פרסום'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'השיבוצים פורסמו',
                    icon: 'success',
                    confirmButtonColor: '#34a0ff',
                    confirmButtonText: 'סגירה'
                })
                editPublishSchedule()
            }
        })
    }

    // set next week to published
    const editPublishSchedule = async () => {
        try {
            const reqbody = {
                id: managerId
            }
            await axios.put(`${process.env.REACT_APP_URL}/setNextWeekPublished`, reqbody)
                .then((response) => {
                    setWeekPublished(true)
                });
        } catch (error) {
            console.log(error.message);
        }
    }

    // set next week to usedAi = true
    const usedAiToTrue = async () => {
        try {
            const reqbody = {
                id: managerId
            }
            await axios.put(`${process.env.REACT_APP_URL}/setNextWeekAiTrue`, reqbody);
        } catch (error) {
            console.log(error.message);
        }
    }

    // if the AI procces get error - show this alert
    const errorAlertToAI = () => {
        Swal.fire({
            title: 'המערכת נתקלה בשגיאה',
            text: 'אנא נסו שנית',
            icon: 'error',
            confirmButtonColor: '#34a0ff',
            confirmButtonText: 'אישור'
        });
    }

    // return the count of the workers of the manager
    const workersCountHandle = async () => {
        const body = {
            managerId: managerId
        };
        
        try {
            const response = await axios.put(`${process.env.REACT_APP_URL}/workersCountOfManager`, body);
            setWorkersCount(response.data);
        } catch (error) {
            console.log(error.message);
        }
    }

    // when clicking on the button - שיבוץ אוטומטי the user get alert - 
    // if he press אישור the func called to the sendMessage func
    const clickAi = () => {
        Swal.fire({
            title: 'שיבוץ עובדים אוטומטי',
            html:
            `<form class="${styles.AI_content}">
                <div>
                   ביצוע הפעולה מוגבל לפעם אחת בשבוע 
                </div>
                <div>
                    פעולה זו יכולה לקחת עד כדקה  
                </div>
                <div>
                    אנא בחרו כמות עובדים שתרצו לשבץ במשמרות בין 1- ${workersCount} 
                </div>
            </form>`,
            input: 'number',
            inputAttributes: {
                min: 1,
                max: workersCount,
                dir: 'rtl'
            },
            inputPlaceholder: `בחירת כמות עובדים`,
            showCancelButton: true,
            cancelButtonText: 'ביטול',
            confirmButtonColor: '#34a0ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'אישור',
            inputValidator: (value) => {
                if (!value || value < 1 || value > workersCount) {
                    return 'אנא הזינו מספר עובדים בין 1 ל- ' + workersCount;
                }
            },
            customClass: {
                popup: styles.swal2_popup,
                content: styles.AI_content
            }
        })
        .then((result) => {
            if (result.isConfirmed) {
                sendMessage(result.value);
            }
        });      
    }

    // send a prompt to the gpt api and return workers
    // refresh the page
    const sendMessage = async (numberOfWorkers) => {
        console.log(numberOfWorkers)

        setLoadingAi(true);
        console.log(promentToAi)
        try {
            // Send the first message to AI
            const response = await axios.post(
                `${process.env.REACT_APP_URL}/sendMessegeAPI`,
                {
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: promentToAi },
                    ],
                }
            );
            console.log(`response 1 - ${response.data}`);

            // Send the second message to AI
            const response2 = await axios.post(
                `${process.env.REACT_APP_URL}/sendMessegeAPI`,
                {
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        {
                            role: 'user',
                            content:
                                `Data: 
                        ${response.data}
                        Move all existing availableWorkers IDs to workers field.
                        Double check that you moved all the availableWorkers IDs from the availableWorkers array to the workers array.
                        Do not display the "availableWorkers" field in the retured Json.
                        Do not write any explanation before or after the Json`},
                    ],
                }
            );
            console.log(`response 2 - ${response2.data}`);

            // prompt for the seconed message to the api
            const finelMessage =
                `Data: ${response.data}.
                AllWorkersArray: ${JSON.stringify(workers)}.
                Add the workers id from AllWorkersArray to the workers array in the shifts based on those rules:
                • Workers array should contain ${numberOfWorkers} workers. not more and not less.
                • Use all the worker ids from AllWorkersArray more then once in the json.
                • Try to add ids from AllWorkersArray in the json equally.
                • Avoid repeating the same worker ID within the same workers array.

                Return me this json data
                Do not write any explanation before or after the Json`;

            console.log(finelMessage)

            // Send the thired message to AI
            const response3 = await axios.post(
                `${process.env.REACT_APP_URL}/sendMessegeAPI`,
                {
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: finelMessage },
                    ],
                }
            );
            console.log(`response 3 - ${response3.data}`);

            try {
                // Extract and parse the JSON response from AI
                const startIndex = response3.data.indexOf('{');
                const endIndex = response3.data.lastIndexOf('}');

                if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                    const jsonString = response3.data.substring(startIndex, endIndex + 1);

                    try {
                        const jsonData = JSON.parse(jsonString);
                        console.log(jsonData);

                        // Update shifts using parsed JSON data
                        const updateResponse = await axios.put(`${process.env.REACT_APP_URL}/updateShiftsOfWeek`, {
                            weekId: week._id,
                            object: jsonData,
                        });

                        console.log("Update response:", updateResponse.data);
                        setLoadingAi(false);
                        //usedAiToTrue();
                        window.location.reload();
                    } catch {
                        setLoadingAi(false);
                        console.error("Error making or updating the week: ");
                        errorAlertToAI();
                    }
                } else {
                    console.error('Invalid JSON response format');
                    setLoadingAi(false);
                    errorAlertToAI();
                }
            } catch (parseError) {
                setLoadingAi(false);
                console.error('Error parsing JSON: ', parseError);
                errorAlertToAI();
            }
        } catch (error) {
            setLoadingAi(false);
            console.error('Error sending message: ', error);
            errorAlertToAI();
        }
    };

    return <React.Fragment>
            <div className={styles.nav_container}>
                <div className={styles.name}>שיבוץ עובדים לשבוע הבא</div>

                <div className={styles.spacer}></div>

                <div className={styles.nav_btn_div}>
                    {weekAi === false && weekPublished === false ?
                        <button className={styles.i2} onClick={clickAi}>
                            {loadingAi ? <FaMagic className={styles.ai_icon_loading}></FaMagic> : <FaMagic className={styles.magic_icon}></FaMagic>}
                        </button>
                    : null}
                    <Link className={styles.i1} to="/managerHomePage"><button><BiSolidHome></BiSolidHome></button></Link>   
                </div>
            </div>

            {/* {weekAi === false && weekPublished === false ?
                    <div className={styles.ai_div}>
                        <button className={styles.ai_btn} onClick={clickAi}>
                            {loadingAi ? <label className={styles.ai_icon_loading}><FaMagic></FaMagic></label> : <label className={styles.ai_icon}><FaMagic></FaMagic></label>}
                            {loadingAi ? <label>...השיבוץ מתבצע</label> : <label>שיבוץ אוטומטי</label>}
                        </button>
                    </div> : null} */}

            <div style={{ marginTop: '65px' }} className={styles.container}>

                {weekPublished === true ?
                    <div className={styles.published_div}>
                    <button visible='false'>
                        <FcApproval className={styles.icon_publishd}></FcApproval>
                        <label>השבוע פורסם</label>
                    </button>
                </div> : null}

                {weekPublished === false && !loadingAi?
                    <div className={styles.publish_div}>
                        <button onClick={publishSchedule}>
                        <FcAdvertising className={styles.icon_publish}></FcAdvertising>
                        <label>פרסום שבוע</label>
                        </button>
                    </div> : null}

                <div style={{marginBottom: '50px'}} className={loadingAi ? styles.container_disabled : null}>
                    {
                        week ? week.day.map((day) => {
                            return (
                                <messageContext.Provider value={weekMessages}>
                                    <DayCurrentWeek weekId={week._id} day={day} key={day._id} getDays={getDays} managerId={managerId}></DayCurrentWeek>
                                </messageContext.Provider>
                            )
                        }) : null
                    }
                </div>

            </div>
    </React.Fragment>
}

export default CurrentWeek;