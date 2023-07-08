import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Day from './CurrentDayser'
import styles from './currentWeekUser.module.css';
import { BiSolidHome } from "react-icons/bi";
import { BiLogOut } from "react-icons/bi";
import { BiUserCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const CurrentWeekUser = () => {

    const navigate = useNavigate();
    const[week, setWeek] = useState(null);
    const [weekVisible, setWeekVisible] = useState(null);

    const getDays = () => {
             axios.get("http://localhost:3001/app/getNextWeek").then((response) => {
                setWeek(response.data);
                setWeekVisible(response.data.visible)
        }).catch(err=> console.log(err));
    }
        
    useEffect(()=>{
        getDays();

    }, [weekVisible]);

    const signout = () => {
        Swal.fire({
            title: 'האם אתה רוצה להתנתק',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ביטול',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'כן'
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.clear()
              navigate('./')
            }
          })
    }

    return <div className={styles.all}>
            
            <div className={styles.upperContainer}>
                <div className={styles.nav_container}>
                    <button onClick={() => navigate('/CurrentWeek')}><BiSolidHome></BiSolidHome></button>
                    <Link to="/"><button onClick={signout} className={styles.signout}><BiLogOut></BiLogOut></button></Link>
                    <Link to="/userSettings"><button className={styles.user_settings}><BiUserCircle></BiUserCircle></button></Link>

                    <div className={styles.chose_shift_div}>
                        {weekVisible ? <Link to="/chooseShifts"><button className={styles.chose_shift_btn}>בחירת משמרות</button></Link> :
                        <Link to="/chooseShifts"><button className={styles.chose_shift_btn_lock}>בחירת משמרות</button></Link>}
                    </div>
                </div>
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