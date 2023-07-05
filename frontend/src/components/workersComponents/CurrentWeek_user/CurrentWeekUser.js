import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Day from './CurrentDayser'
import styles from './currentWeekUser.module.css';

const CurrentWeekUser = () => {

    const[week, setWeek] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getDays = () => {
             axios.get("http://localhost:3001/app/getCurrentWeek").then((response) => {
                console.log(response.data);
                setWeek(response.data);
        }).catch(err=> console.log(err));
    }
        
    useEffect(()=>{
        getDays();

    }, []);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return <React.Fragment>
        <div className={styles.all}>

        <div className={`${styles.containerMenu} ${isMenuOpen ? styles.change : ''}`} onClick={handleMenuClick}>
            <div className={styles.bar1}></div>
            <div className={styles.bar2}></div>
            <div className={styles.bar3}></div>
        </div>

            {
               week ?  week.day.map((day) => {
                    return <Day day={day} key={day._id}></Day>
                }) : null
            }
        </div>
    </React.Fragment>
}

export default CurrentWeekUser