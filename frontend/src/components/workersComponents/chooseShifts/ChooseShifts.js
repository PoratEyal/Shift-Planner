import React, { useEffect, useState } from 'react';
import UserDay from './UserDay'
import axios from 'axios';
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import styles from './chooseShifts.module.css'

const ChooseShifts = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);
    const [weekPublished, setWeekPublished] = useState(null)

    const getDays = () => {
        axios.get(`${process.env.REACT_APP_URL}/getNextWeek`).then((response) => {
            setWeek(response.data);
            setWeekPublished(response.data.publishScheduling)
        });
    }

    useEffect(() => {
        getDays();
    }, [weekPublished]);

    return <React.Fragment>
        <div className={styles.nav_container}>
            <button onClick={() => navigate('/CurrentWeek')}><BiSolidHome></BiSolidHome></button>
            <p>בחירת משמרות לשבוע הבא</p>
        </div>

        {weekPublished ? <div className={styles.messege}>
            <p>השבוע פורסם, אלו המשמרות לשבוע הבא</p>   
        </div> : null}

        <div style={{ marginTop: '70px' }} className={styles.container}>
            {week && week.visible ? week.day.map((day) => {
                return <UserDay weekPublished={weekPublished} day={day} key={day._id} getDays={getDays} />;
            }) : null}
        </div>

    </React.Fragment>
}

export default ChooseShifts;