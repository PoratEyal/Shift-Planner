import React, { useEffect, useState } from 'react';
import UserDay from './UserDay'
import axios from 'axios';
import styles from './chooseShifts.module.css';
import { UserContext } from '../CurrentWeek_user/CurrentWeekUser' 
import { useContext } from 'react';
import Swal from 'sweetalert2';
import PageLayoutWorker from './/..//..//layout/PageLayoutWorker';
import { FcApproval } from "react-icons/fc";

const ChooseShifts = () => {

    const [week, setWeek] = useState(null);
    const [weekPublished, setWeekPublished] = useState(null)
    const [mesageSent, setMesageSent] = useState(false)
    const [showMessage, setShowMessage] = useState(true);

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

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowMessage(false);
        }, 7000);
        return () => clearTimeout(timeout); // Clear the timeout on component unmount
    }, []);

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

    return <PageLayoutWorker text={weekPublished ? 'צפיה במשמרות לשבוע הבא' : 'בחירת משמרות לשבוע הבא'}>
        <div 
        style={weekPublished ? {marginBottom: '80px'} : null} className={styles.container}>
            
            {showMessage && weekPublished === true ?
            <div className={styles.messege}>
                <p><FcApproval className={styles.message_icon}></FcApproval> המשמרות פורסמו, אלו המשמרות לשבוע הבא</p>   
            </div>
            : null}

            {!mesageSent && weekPublished === false ? (
                <img onClick={sendMessage} src='message.png' className={styles.write_message_btn}></img>
            ) :  null}

            {week && week.visible ? week.day.map((day) => {
                return <UserDay managerId={managerId} weekPublished={weekPublished} day={day} key={day._id} getDays={getDays} />;
            }) : null}

        </div>
    </PageLayoutWorker>
}

export default ChooseShifts;