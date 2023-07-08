import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Day from './CurrentDayser'
import styles from './currentWeekUser.module.css';
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

const CurrentWeekUser = () => {

    const navigate = useNavigate();
    const[week, setWeek] = useState(null);

    const getDays = () => {
             axios.get("http://localhost:3001/app/getNextWeek").then((response) => {
                setWeek(response.data);
        }).catch(err=> console.log(err));
    }
        
    useEffect(()=>{
        getDays();

    }, []);

    return <div className={styles.all}>
            <div className={styles.nav_container}>
                <button onClick={() => navigate('/HomePage')}><BiSolidHome></BiSolidHome></button>
                <p>צפייה בשבוע הנוכחי</p>
            </div>
            <div className={styles.container}>
                {
                week ?  week.day.map((day) => {
                        return <Day day={day} key={day._id}></Day>
                    }) : null
                }
            </div>
        </div>
}

export default CurrentWeekUser