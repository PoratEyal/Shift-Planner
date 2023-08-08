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

      <div className={styles.input_div}>
        <input type='number'></input>
        <p>כמה עובדים את/אתה מעונינים שיהיו בכל משמרת</p>
      </div>

      <button className={styles.btn} onClick={sendMessage}>בוא נראה אותך</button>

      <div className={styles.ai_answer_div}>
        {dataFromAi != null ?
        <p>{dataFromAi}</p>
        : null}
      </div>

    </div>
  </React.Fragment>
}

export default AiCreateWeek;