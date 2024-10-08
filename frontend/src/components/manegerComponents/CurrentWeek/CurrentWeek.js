import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DayCurrentWeek from './DayCurrentWeek'
import styles from './CurrentWeek.module.css'
import Swal from 'sweetalert2';
import { ManagerContext } from '../ManagerHomePage';
import { useContext } from 'react';
import { FaMagic } from "react-icons/fa";
import messageContext from './messagesContext';
import { FcAdvertising } from "react-icons/fc";
import { FcInspection } from "react-icons/fc";
import PageLayout from './/..//..//layout/PageLayout';
import { FcApproval } from "react-icons/fc";

const CurrentWeek = () => {

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
            Return me json with all the shiftsId, workers, amountOfWorkers and availableWorkers fields.
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
            }).catch(() => {});
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
                • בעת לחיצה על אישר, יופעל מנגנון השיבוץ האוטומטי, אנא התעזר בסבלנות, פעולה זו יכולה לקחת עד כדקה.
                </div>
            </form>`,
            showCancelButton: true,
            cancelButtonText: 'ביטול',
            confirmButtonColor: '#34a0ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'אישור',
            customClass: {
                popup: styles.swal2_popup,
                content: styles.AI_content
            }
        })
        .then((result) => {
            if (result.isConfirmed) {
                sendMessage();
            }
        });     
    }

    // send a prompt to the gpt api and return workers
    // refresh the page
    const sendMessage = async () => {
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

            // prompt for the seconed message to the api
            const finelMessage =
                `Data: 
                ${response.data}
                look at the number of the amountOfWorkers field and Move this nimber of availableWorkers IDs (If there is) to workers field.

                AllWorkersArray: ${JSON.stringify(workers)}.
                If you didnt get the amountOfWorkers number of the shift from the availableWorkers Add the workers id from AllWorkersArray to the workers array in the shifts based on those rules:
                
                • Workers array should contain the specific amountOfWorkers of the shift. not more and not less.
                • Use all the worker ids from AllWorkersArray more then once in the json.
                • Try to add ids from AllWorkersArray in the json equally.
                • Avoid repeating the same worker ID within the same workers array!

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

    return <PageLayout text='שיבוצים לשבוע הבא'>
            <div style={{ marginTop: '65px' }} className={styles.container}>

                {weekAi === false && weekPublished === false ? (
                    !loadingAi ? (
                        <button className={styles.btn_ai} onClick={clickAi}>
                            <FaMagic />
                            <label>שיבוץ אוטומטי</label>
                        </button>
                    ) : (
                        <button className={styles.btn_ai_block} onClick={clickAi}>
                            <label>השיבוץ בתהליך</label>
                        </button>
                    )
                    ) : null}

                {weekPublished === true ?
                    <div className={styles.published_div}>
                    <button visible='false'>
                        <FcApproval className={styles.icon_publishd}></FcApproval>
                        <label>השבוע פורסם בהצלחה</label>
                    </button>
                </div> : null}

                {weekPublished === false && !loadingAi?
                    <div className={styles.publish_div}>
                        <button onClick={publishSchedule}>
                            <FcAdvertising className={styles.icon_publish}></FcAdvertising>
                            <label>פרסום שבוע</label>
                        </button>
                    </div>
                : null}

                <div style={{marginBottom: '60px'}} className={loadingAi ? styles.container_disabled : null}>
                    {
                        week ? 
                            week.day.map((day) => {
                                return <messageContext.Provider value={weekMessages} key={day._id}>
                                        <DayCurrentWeek weekId={week._id} day={day}  getDays={getDays} managerId={managerId}></DayCurrentWeek>
                                    </messageContext.Provider>
                            })
                        :null}
                </div>

                {loadingAi ?
                <div className={styles.spinnerContainer}>
                    <div className={styles.spinner}></div>
                    <div className={styles.loader}>
                        <div className={styles.words}>
                            <span className={styles.word}></span>
                            <span className={styles.word}>טוען שבוע</span>
                            <span className={styles.word}>טוען ימים</span>
                            <span className={styles.word}>טוען משמרות</span>
                            <span className={styles.word}>טוען עובדים</span>
                            <span className={styles.word}>טוען בקשות עובדים</span>
                            <span className={styles.word}>מאמת נתונים</span>
                            <span className={styles.word}>מחשב שיבוצים</span>
                            <span className={styles.word}>מסכם תוצאות</span>
                            <span className={styles.word}>בודק תקינות</span>
                        </div>
                    </div>
                </div>: null}

            </div>
    </PageLayout>
}

export default CurrentWeek;