import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Day from './CurrentDayser'
import styles from './currentWeekUser.module.css';
import { BiLogOut } from "react-icons/bi";
import { BiUserCircle } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ChooseShifts from '../chooseShifts/ChooseShifts';

const CurrentWeekUser = () => {

    const navigate = useNavigate();
    const[week, setWeek] = useState(null);
    const [nextWeek ,setNextWeek] = useState(null);
    const [weekVisible, setWeekVisible] = useState(null);
    let data = {};
    const [fullname, setName]= useState("");

    useEffect(() => { 
        getDays();
        const StorageData = JSON.parse(localStorage.getItem("user"));
        if(StorageData){
            data = StorageData;
            setName(data.fullName);
        }
    }, [])

    const getDays = () => {
             axios.get(`${process.env.REACT_APP_URL}/getCurrentWeek`).then((response) => {
                setWeek(response.data);
                //setWeekVisible(response.data.visible)
        }).catch(err=> console.log(err));

        axios.get(`${process.env.REACT_APP_URL}/getNextWeek`).then((response) => {
            setNextWeek(response.data);
            setWeekVisible(response.data.visible)
    }).catch(err=> console.log(err));
    }

    const signout = () => {
        Swal.fire({
            title: 'האם ברצונכם להתנתק',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ביטול',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'אישור'
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.clear()
              navigate('./')
            }
          })
    }


    const ChooseShiftsHandler = () => {
        weekVisible ? navigate("/chooseShifts") 
        : Swal.fire({
            title: 'טרם פורסמו משמרות',
            icon: 'warning',
            confirmButtonColor: '#2977bc'
          })
    }

    return <React.Fragment>

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
                        return <Day day={day} key={day._id}></Day>
                    }) : null
                }
            </div>

        </React.Fragment>
}

export default CurrentWeekUser