import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styles from './AiCreateWeek.module.css';
import { ManagerContext } from '../ManagerHomePage' 
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSolidHome } from "react-icons/bi";

const AiCreateWeek = () => {
    
  const navigate = useNavigate();
  const [week, setWeek] = useState(null);
  const [dataFromAi, setDataFromAi] = useState(null);

  const managerContext = useContext(ManagerContext);
  const managerId = managerContext.getUser();

  const getNextWeek = () => {
    const reqbody = {
        id: managerId
    }
    axios.post(`${process.env.REACT_APP_URL}/getNextWeek`, reqbody)
    .then((response) => {
        setWeek(response.data);
    }).catch(err => console.log(err));
  }

  useEffect(() => {
      getNextWeek();
  }, [setWeek]);


  const sendMessage = async () => {
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_URL}/sendMessege`,
          {
            messages: [
              { role: 'system', content: 'You are a helpful assistant.' },
              { role: 'user', content: `create me table from this data: ${JSON.stringify(week)}` },
            ],
          }
        );
        setDataFromAi(response.data);
      } catch (error) {
        console.error('Error sending message:', error);
      }
  };

  return <React.Fragment>
      <div className={styles.nav_container}>
        <button className={styles.homeBtn} onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
        <p>AI שיבוץ עובדים באמצעות</p>
      </div>

      <div className={styles.ai_div}>
        <button className={styles.btn} onClick={sendMessage}>
            <svg height="24" width="24" fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1" className={styles.sparkle}>
                <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z"></path>
            </svg>

            <span className={styles.text}>Generate</span>
        </button>
      </div>

      <div className={styles.ai_answer_div}>
          {dataFromAi != null ?
          <p>{dataFromAi}</p>
          : null}
      </div>

  </React.Fragment>
}

export default AiCreateWeek;