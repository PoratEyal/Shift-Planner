import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DayCurrentWeek from './DayCurrentWeek'
import styles from '../CreateWeek/createWeek.module.css'
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

const CurrentWeek = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);
    const [weekPublished, setWeekPublished] = useState(null)

    const getDays = () => {
        axios.get(`${process.env.REACT_APP_URL}/getNextWeek`).then((response) => {
            setWeek(response.data);
            setWeekPublished(response.data.publishScheduling)
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getDays();
    }, [weekPublished]);

    return <React.Fragment>
        <div>
            <div className={styles.nav_container}>
                <button className={styles.home_btn} onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
                <p>שיבוץ עובדים לשבוע הבא</p>
            </div>

            {weekPublished ? <div className={styles.messege}>
                <p>השבוע פורסם</p>   
            </div> : null}

            <div style={{ marginTop: '70px' }} className={styles.container}>
                {
                    week ? week.day.map((day) => {
                        return <DayCurrentWeek  day={day} key={day._id} getDays={getDays}></DayCurrentWeek>
                    }) : null
                }
            </div>
        </div>
    </React.Fragment>
}

export default CurrentWeek;