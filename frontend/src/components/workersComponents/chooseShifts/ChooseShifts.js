import React, { useEffect, useState } from 'react';
import UserDay from './UserDay'
import axios from 'axios';
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import styles from './chooseShifts.module.css';
import { UserContext } from '../CurrentWeek_user/CurrentWeekUser' 
import { useContext } from 'react';
import Swal from 'sweetalert2';

const ChooseShifts = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);
    const [weekPublished, setWeekPublished] = useState(null)
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

    const sendMessage = async () => {
        try {
            const user = localStorage.getItem('user');
            const userData = JSON.parse(user);
            const message = ''; 
    
            const { value } = await Swal.fire({
                title: 'שליחת הודעה למנהל',
                input: 'text',
                inputValue: message,
                cancelButtonText: 'ביטול',
                confirmButtonColor: '#34a0ff',
                cancelButtonColor: '#d33',
                confirmButtonText: 'אישור',
                showCancelButton: true,
                inputValidator: (value) => {
                    if (!value) {
                        return 'הודעה ריקה מתוכן';
                    }
                },
                inputAttributes: {
                    dir: 'rtl'
                }
            });
            
    
            if (value) {
                const body = {
                    worker: userData._id,
                    week: week._id,
                    message: value
                };
    
                const response = await axios.post(`${process.env.REACT_APP_URL}/sendMessage`, body);
    
                if (response.status === 201) {
                    setMesageSent(true)
                    Swal.fire({
                        title: 'ההודעה נשלחה',
                        icon: 'success',
                        confirmButtonColor: '#34a0ff',
                        confirmButtonText: 'סגירה'
                    });
                } else {
                    console.error('Failed to send message');
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };
    

    return <React.Fragment>
        <div className={styles.nav_container}>
            <button className={styles.homeBtn} onClick={() => navigate('/CurrentWeek')}><BiSolidHome></BiSolidHome></button>

            {weekPublished ? <p>צפיה  במשמרות לשבוע הבא</p>
            :
            <p>בחירת משמרות לשבוע הבא</p>}
        </div>

        <div style={{ marginTop: '70px' }} className={styles.container}>

            {
                !mesageSent && !weekPublished ? (
                    <div className={styles.messege_to_manager} onClick={sendMessage}>
                    <p>שליחת הודעה למנהל</p>
                    </div>
                ) : (
                    mesageSent ? (
                    <div className={styles.messege_sent}>
                        <p>ההודעה נשלחה בהצלחה</p>
                    </div>
                    ) : null
                )
            }
            
            {weekPublished ? <div className={styles.messege}>
                <p>השבוע פורסם, אלו המשמרות לשבוע הבא</p>   
            </div>: null}

            {week && week.visible ? week.day.map((day) => {
                return <UserDay managerId={managerId} weekPublished={weekPublished} day={day} key={day._id} getDays={getDays} />;
            }) : null}
        </div>
    </React.Fragment>
}

export default ChooseShifts;