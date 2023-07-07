import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DayCurrentWeek from './SeeDayCurrentWeek'
import styles from '../CreateWeek/createWeek.module.css'
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

const SeeCurrentWeek = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);

    const getDays = () => {
        axios.get("http://localhost:3001/app/getNextWeek").then((response) => {
            setWeek(response.data);
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getDays();

    }, []);
    
    return <React.Fragment>
        <div>
            <div className={styles.nav_container}>
                <button onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
                <p>בחירת עובדים לשבוע הבא</p>
            </div>

            <div style={{ marginTop: '70px' }} className={styles.container}>
                {
                    week ? week.day.map((day) => {
                        return <DayCurrentWeek day={day} key={day._id} getDays={getDays}></DayCurrentWeek>
                    }) : null
                }
            </div>
        </div>
    </React.Fragment>
}

export default SeeCurrentWeek;