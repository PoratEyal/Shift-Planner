import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DayCurrentWeek from './SeeDayCurrentWeek'
import styles from '../CreateWeek/createWeek.module.css'
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { ManagerContext } from '../ManagerHomePage' 
import { useContext } from 'react';

const SeeCurrentWeek = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);

    const managerContext = useContext(ManagerContext);
    const managerId = managerContext.getUser();

    const getDays = () => {
        const reqBody = {
            managerId: managerId
        }
        axios.post(`${process.env.REACT_APP_URL}/getCurrentWeek`, reqBody).then((response) => {
            setWeek(response.data);
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getDays();
    }, []);
    
    return <React.Fragment>
        <div>
            <div className={styles.nav_container}>
                <button className={styles.home_btn} onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
                <p>צפיה בשבוע הנוכחי</p>
            </div>

            {week && (
                <div className={styles.edit_div_createWeek}>
                    <button onClick={() => navigate('/editCurrentWeek')}>שינוי סידור העבודה</button>
                </div>
            )}

            <div className={styles.container}>
                {
                    week ? week.day.map((day) => {
                        return <DayCurrentWeek managerId={managerId} day={day} key={day._id} getDays={getDays}></DayCurrentWeek>
                    }) : null
                }
            </div>
        </div>
    </React.Fragment>
}

export default SeeCurrentWeek;