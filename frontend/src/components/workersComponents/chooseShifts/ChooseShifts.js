import React, { useEffect, useState } from 'react';
import UserDay from './UserDay'
import axios from 'axios';
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import styles from './chooseShifts.module.css';
import { UserContext } from '../CurrentWeek_user/CurrentWeekUser' 
import { useContext } from 'react';

const ChooseShifts = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);
    const [weekPublished, setWeekPublished] = useState(null)
    const [addMessege, setAddMessege] = useState(false)
    const [message, setMessage] = useState('');
    const [mesageSent, setMesageSent] = useState(false)

    const userContext = useContext(UserContext);
    const managerId = userContext.getUser();
    const getDays = () => {
        const body = {
            id: managerId
        }
        axios.post(`${process.env.REACT_APP_URL}/getNextWeek`, body).then((response) => {
            setWeek(response.data);
            setWeekPublished(response.data.publishScheduling)
        });
    }

    useEffect(() => {
        getDays();
    }, [weekPublished]);

    const sendMessege = async () => {
        const user = localStorage.getItem('user');
        const userData = JSON.parse(user);
    
        const body = {
            worker: userData._id,
            week: week._id,
            message: message
        };
    
        axios.post(`${process.env.REACT_APP_URL}/sendMessage`, body)
            .then(response => {
                if (response.status === 201) {
                    setMesageSent(true);
                    setAddMessege(!addMessege);
                    setMessage('');
                    console.log(response.data)
                } else {
                    console.error('Failed to send message');
                }
            })
            .catch(error => {
                console.error('Error sending message:', error);
            });
    };

    return <React.Fragment>
        <div className={styles.nav_container}>
            <button className={styles.homeBtn} onClick={() => navigate('/CurrentWeek')}><BiSolidHome></BiSolidHome></button>

            {weekPublished ? <p>צפיה  במשמרות לשבוע הבא</p>
            :
            <p>בחירת משמרות לשבוע הבא</p>}
        </div>
        
        {!mesageSent && !weekPublished ? <div className={styles.messege_to_manager} onClick={() => setAddMessege(!addMessege)}>
            <p>הוסף הודעה למנהל</p>
        </div>: 
        <div className={styles.messege}>
            <p>ההודעה נשלחה בהצלחה</p>   
        </div>}
        
        {weekPublished ? <div className={styles.messege}>
            <p>השבוע פורסם, אלו המשמרות לשבוע הבא</p>   
        </div>: null}

        {addMessege ? <div className={styles.messege_to_manager_div}>
            <input
                value={message}
                className={styles.input_to_manager}
                placeholder='הודעה'
                type='text'
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessege} className={styles.btn_to_manager}>שליחה</button>
        </div>: null}

        <div style={{ marginTop: '70px' }} className={styles.container}>
            {week && week.visible ? week.day.map((day) => {
                return <UserDay managerId={managerId} weekPublished={weekPublished} day={day} key={day._id} getDays={getDays} />;
            }) : null}
        </div>
    </React.Fragment>
}

export default ChooseShifts;