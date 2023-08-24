import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DayCurrentWeek from './DayCurrentWeek'
import styles from '../CreateWeek/createWeek.module.css'
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ManagerContext } from '../ManagerHomePage';
import { useContext } from 'react';
import { FaMagic } from "react-icons/fa";

const CurrentWeek = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);
    const [weekPublished, setWeekPublished] = useState(null)
    const [weekVisible, setWeekVisible] = useState(null)
    const [workers, setWorkers] = useState(null);
    const [promentToAi, setPromentToAi] = useState('');
    const [loadingAi, setLoadingAi] = useState(false);
    const [weekAi, setWeekAi] = useState(false);

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

            setPromentToAi(`this is the data of all the week: ${JSON.stringify(week)}
            Return me json with all the shiftsId, workers and availableWorkers fields.
            • Do not write any explanation before or after the Json
            • Double check that you provided all the shiftsId that include into the data of the week.
            example to how your answer should look:
            {
                "shifts": [
                    {
                        "_id": "64e330568c240c5df3653937",
                        "workers": [real time data],
                        "availableWorkers": [real time data]
                    },
                    {
                        "_id": "64e330578c240c5df3653943",
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
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getDays();
        getWorkers();
    }, [weekPublished, weekVisible, promentToAi]);

    // show alert, if the manager select "yes" - week publish
    const publishSchedule= () => {
        Swal.fire({
            title: 'האם ברצונך לפרסם את השיבוצים לשבוע הבא',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText : 'ביטול',
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

    // when clicking on the button - שיבוץ אוטומטי the user get alert - 
    // if he press אישור the func called to the sendMessage func
    const clickAi = () => {
        Swal.fire({
            text: 'האם לאפשר למערכת לשבץ את העובדים אוטומטית',
            title: 'פעולה זו יכולה לקחת עד כחצי דקה<br></br>ביצוע הפעולה מוגבל לפעם אחת בשבוע',
            icon: 'info',
            showCancelButton: true,
            cancelButtonText: 'ביטול',
            confirmButtonColor: '#34a0ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'אישור'
        }).then((result) => {
            if (result.isConfirmed) {
                sendMessage();
            }
        });
    }    

    // send a prompt to the gpt api and return worker
    // refresh the page
    const sendMessage = async () => {
        setLoadingAi(true);
        
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
            console.log(response.data);
    
            // prompt for the seconed message to the api
            const userMessage = `
                this is all my workers ids: ${JSON.stringify(workers)}.
                data: ${response.data}.
                return me this data as a json but add workers ids into the workers array based on those rules:
                • Every worker ID should appear 2 to 4 times in the JSON.
                • in all the workers array need to be at least 2 different workers ids.
                • Avoid repeating the same worker ID within the same workers array.
                • the count of the workers array need to be the same.
                • if there are workers ids in availableWorkers array - move them to the workers array.
                example to how should the answer need to look:
                {
                    "shifts": [
                        {
                            "_id": "64e330568c240c5df3653937",
                            "workers": [must have workers ids here]
                        },
                        {
                            "_id": "64e330578c240c5df3653943",
                            "workers": [must have workers ids here]
                        },
                        // ... more shift objects ...
                    ]
                }`;
            //console.log(userMessage);
    
            // Send the second message to AI
            const response2 = await axios.post(
                `${process.env.REACT_APP_URL}/sendMessegeAPI`,
                {
                    messages: [
                        { role: 'system', content: 'You are a helpful assistant.' },
                        { role: 'user', content: userMessage },
                    ],
                }
            );
                console.log(response2);
            try {
                // Extract and parse the JSON response from AI
                const startIndex = response2.data.indexOf('{');
                const endIndex = response2.data.lastIndexOf('}');
                
                if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
                    const jsonString = response2.data.substring(startIndex, endIndex + 1);
                    const checkingNotGettingError = JSON.parse(jsonString);
                    
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
                        //window.location.reload();
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
        <div >
            <div className={styles.nav_container}>
                <button className={styles.home_btn} onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
                <p>שיבוץ עובדים לשבוע הבא</p>
            </div>

            {weekPublished === true ? 
            <div className={styles.messege}>
                <p>השבוע פורסם</p>   
            </div>: null}

            {weekVisible && weekPublished === false ? 
            <div className={styles.publish_div}>
                <button onClick={publishSchedule} className={styles.addShift_btn}>פרסום שבוע</button>
            </div>
            : null}

             {!weekAi  && !weekPublished?
            <div className={styles.publish_div}>
                <button className={styles.ai_btn} onClick={clickAi}>
                    {loadingAi ? <label className={styles.ai_icon_loading}><FaMagic></FaMagic></label> : <label className={styles.ai_icon}><FaMagic></FaMagic></label>}
                    {loadingAi ? <label>...השיבוץ מתבצע</label> : <label>שיבוץ אוטומטי</label>}
                </button>
            </div> : null} 

            <div style={{ marginTop: '70px' }} className={loadingAi ? styles.container_disabled : styles.container}>
                {
                    week ? week.day.map((day) => {
                        return <DayCurrentWeek  weekId={week._id} day={day} key={day._id} getDays={getDays} managerId={managerId}></DayCurrentWeek>
                    }) : null
                }
            </div>

        </div>
    </React.Fragment>
}

export default CurrentWeek;