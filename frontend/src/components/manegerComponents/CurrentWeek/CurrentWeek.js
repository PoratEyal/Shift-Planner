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
    const [dataFromAi, setDataFromAi] = useState(null);
    const [workers, setWorkers] = useState(null);
    const [messages, setMessages] = useState(null);
    const [promentToAi, setPromentToAi] = useState('');

    const managerContext = useContext(ManagerContext);
    const managerId = managerContext.getUser();

    // get all the _id's of the workers and all their messages
    const getWorkersAndMessages = async () => {
        try {
            const body = {
              job: managerId
            }
            const response = await axios.post(`${process.env.REACT_APP_URL}/getMyWorkers`, body);
            setWorkers(response.data.map(item => item._id))

            const body2 = {
                managerId: managerId,
                weekId: week ? week._id : null,
                usersId: response.data.map(item => item._id)
            }
            try {
                const response = await axios.post(`${process.env.REACT_APP_URL}/getMessages`, body2);
                setMessages(response.data.messages);

                setPromentToAi(`this is the data of the week: ${JSON.stringify(week)},
                this is the _id's of the users: ${JSON.stringify(workers)},
                this is the data of their Placement requests to the manager: ${JSON.stringify(messages)}.
                return me json of that week and add users _ids into the availableWorkers field.
                if the availableWorkers field doesnt exsit, create him and add the users randomly and based on their requests (messages).
                before you write the json dont write anything.
                after you wrote the json dont write anything`) 


            } catch (error) {
                console.error('Error:', error);
            }
            
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
            setWeekPublished(response.data.publishScheduling)
            setWeekVisible(response.data.visible)
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getDays();
        getWorkersAndMessages();
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

    const sendMessage = async () => {
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
          
          
          let jsonData = null;
          try {
            jsonData = JSON.parse(extractedJson);
            setDataFromAi(jsonData);
            console.log(jsonData);

            try {
                const body={
                    managerId: managerId,
                    data: jsonData
                }
                await axios.post(`${process.env.REACT_APP_URL}/updateNextWeek`, body);
                window.location.reload();
                
              } catch (error) {
                console.error('Error updated the week:', error);
              }
            
          } catch (error) {
            console.error('Error parsing JSON:', error);
          }
          
        } catch (error) {
          console.error('Error sending message:', error);
        }
    };
      
    return <React.Fragment>
        <div>
            <div className={styles.nav_container}>
                <button className={styles.home_btn} onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
                <p>שיבוץ עובדים לשבוע הבא</p>
            </div>

            {weekVisible && !weekPublished ? 
            <div className={styles.publish_div}>
                <button onClick={publishSchedule} className={styles.addShift_btn}>פרסם שבוע סופי</button>
            </div>
            : null}

            {weekPublished ? 
            <div className={styles.messege}>
                <p>השבוע פורסם</p>   
            </div>: null}

            <div className={styles.publish_div}>
                <button className={styles.ai_btn} onClick={sendMessage}>
                    <label className={styles.ai_icon}><FaMagic></FaMagic></label>
                    <label>שיבוץ אוטומטי</label>
                </button>
            </div>

            <div style={{ marginTop: '70px' }} className={styles.container}>
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