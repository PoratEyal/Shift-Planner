import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Day from './CurrentDayser'
import styles from './currentWeekUser.module.css';
import { BiLogOut } from "react-icons/bi";
import { BiUserCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export const UserContext = createContext({
    getUser: () => {
      const user = localStorage.getItem('user');
      const userData = JSON.parse(user);
      return userData.manager;
    },
});

const CurrentWeekUser = () => {

    const navigate = useNavigate();
    const[week, setWeek] = useState(null);
    const [weekVisible, setWeekVisible] = useState(null);

    // return the manager Id of the current user (context func)
    const getUser = () => {
        const user = localStorage.getItem('user');
        const userData = JSON.parse(user);
        return userData.manager;
    };

    // get days of the current week
    // get if nextWeek is visible or not
    const getDays = () => {
        const body = {
            managerId: getUser()
        }
        axios.post(`${process.env.REACT_APP_URL}/getCurrentWeek`, body).then((response) => {
           setWeek(response.data);
        }).catch(err=> console.log(err));

        const body2 = {
            id: getUser()
        }
        axios.post(`${process.env.REACT_APP_URL}/getNextWeek`, body2).then((response) => {
            setWeekVisible(response.data.visible)
        }).catch(err=> console.log(err));
    }

    useEffect(() => { 
        getDays();
    }, [])

    // signout func
    const signout = () => {
        Swal.fire({
            title: 'האם ברצונכם להתנתק',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ביטול',
            confirmButtonColor: '#34a0ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'אישור'
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.clear()
              navigate('/')
            }
          })
    }

    // if next week isnt visible threw alert
    const ChooseShiftsHandler = () => {
        weekVisible ? navigate("/chooseShifts") 
        : Swal.fire({
            title: 'טרם פורסמו משמרות',
            icon: 'warning',
            confirmButtonColor: '#34a0ff',
            confirmButtonText: 'סגור'
          })
    }

    return <UserContext.Provider value={{getUser}}>
            <div className={styles.upperContainer}>
                <div className={styles.nav_buttons}>
                    <Link to="/"><button className={styles.signout} onClick={signout}><BiLogOut></BiLogOut></button></Link>
                    <Link to="/userSettings"><button className={styles.user_settings}><BiUserCircle></BiUserCircle></button></Link>
                    <button className={styles.user_managment_btn} onClick={() => {ChooseShiftsHandler()}}>&nbsp;שבוע הבא&nbsp;</button>
                </div>

                <h1 className={styles.h1}>שבוע נוכחי</h1>
            </div>

            <div className={styles.container}>
                {
                week ?  week.day.map((day) => {
                        return <Day managerId={getUser()} day={day} key={day._id}></Day>
                    }) : null
                }
            </div>
    </UserContext.Provider>
}

export default CurrentWeekUser