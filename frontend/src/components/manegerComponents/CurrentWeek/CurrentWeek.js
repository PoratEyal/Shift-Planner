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

            setPromentToAi(
                `this is the data of the week: ${JSON.stringify(week)},
                this is the _id's of the users: ${JSON.stringify(workers)},
                return me json of that week and act like you are the manager and you add 
                some users _ids into the workers field (Try to distribute the number of shifts to each worker equally - 
                every user id need to work 2-4 shifts in the week)
                to all the shifts and the days(do not add to availableWorkers anything!).
                the count of the workers need to be the same to all the shifts.
                Each shift must have workers!
                if there are id's in availableWorkers field - move them to the workers field.
                before you write the json dont write anything.
                after you wrote the json dont write anything`)

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
            confirmButtonColor: '#2977bc',
            cancelButtonColor: '#d33',
            confirmButtonText: 'פרסום'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: 'השיבוצים פורסמו',
                icon: 'success',
                confirmButtonColor: '#2977bc',
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
            confirmButtonColor: '#2977bc',
            confirmButtonText: 'אישור'
        });
    }

    // when clicking on the button - שיבוץ אוטומטי the user get alert - 
    // if he press אישור the func called to the sendMessage func
    const clickAi = () => {
        Swal.fire({
            text: 'האם לאפשר למערכת לשבץ את העובדים אוטומטית',
            title: 'פעולה זו יכולה לקחת כדקה<br></br>ביצוע הפעולה מוגבל לפעם אחת בשבוע',
            icon: 'info',
            showCancelButton: true,
            cancelButtonText: 'ביטול',
            confirmButtonColor: '#2977bc',
            cancelButtonColor: '#d33',
            confirmButtonText: 'אישור'
        }).then((result) => {
            if (result.isConfirmed) {
                sendMessage();
            }
        });
    }    

    // send a prompt to the gpt api and return new week json
    // take the json and put it as the new nextWeek data
    // refresh the page
    const sendMessage = async () => {
        setLoadingAi(true)
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_URL}/sendMessege`,
            {
              messages: [
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: promentToAi },
              ],
            }
          );
          
          const startIndex = response.data.indexOf('{'); // Find the first '{'
          const endIndex = response.data.lastIndexOf('}'); // Find the last '}'  
          const extractedJson = response.data.substring(startIndex, endIndex + 1);
          console.log(extractedJson)
          
          let jsonData = null;
          try {
            jsonData = JSON.parse(extractedJson);

            try {
                const body={
                    managerId: managerId,
                    data: jsonData
                }
                await axios.post(`${process.env.REACT_APP_URL}/updateNextWeek`, body);
                setLoadingAi(false);
                usedAiToTrue();
                window.location.reload();
                
              } catch (error) {
                setLoadingAi(false);
                errorAlertToAI();
                console.error('Error updated the week:', error);
              }
            
          } catch (error) {
            setLoadingAi(false);
            errorAlertToAI();
            console.error('Error parsing JSON:', error);
          }
          
        } catch (error) {
            setLoadingAi(false);
            errorAlertToAI();
            console.error('Error sending message:', error);
        }
    };
      
    return <React.Fragment>
        <div >
            <div className={styles.nav_container}>
                <button className={styles.home_btn} onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
                <p>שיבוץ עובדים לשבוע הבא</p>
            </div>

            {weekVisible && !weekPublished ? 
            <div className={styles.publish_div}>
                <button onClick={publishSchedule} className={styles.addShift_btn}>פרסום שבוע</button>
            </div>
            : null}

            {weekPublished ? 
            <div className={styles.messege}>
                <p>השבוע פורסם</p>   
            </div>: null}

            {/* {!weekAi ?
            <div className={styles.publish_div}>
                <button className={styles.ai_btn} onClick={clickAi}>
                    {loadingAi ? <label className={styles.ai_icon_loading}><FaMagic></FaMagic></label> : <label className={styles.ai_icon}><FaMagic></FaMagic></label>}
                    {loadingAi ? <label>...השיבוץ מתבצע</label> : <label>שיבוץ אוטומטי</label>}
                </button>
            </div> : null} */}

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