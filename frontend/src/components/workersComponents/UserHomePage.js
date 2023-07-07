import styles from '../manegerComponents/maneger_home_page.module.css'
import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import axios from 'axios';
import Swal from 'sweetalert2';

const UserHomePage = () => {
    const navigate = useNavigate();
    
    const [fullName, setName] = useState("");
    const [week, setWeek] = useState(null);
    const [weekVisible, setWeekVisible] = useState(null);

    const getDays = () => {
        axios.get("http://localhost:3001/app/getNextWeek").then((response) => {
            setWeek(response.data);
            setWeekVisible(response.data.visible)
            console.log(week)
        }).catch(err => console.log(err));;

    }
    useEffect(() => {
        getDays();
    }, [weekVisible]);

    useEffect(() => {
        const newdata = JSON.parse(localStorage.getItem("user"));
        if(newdata){
            setName(newdata.fullName);
        } else{
            navigate('/');
        }

    }, []) 

    const closedBtn = () => {
        Swal.fire(
            'עמוד בחירת משמרות יפתח כאשר המנהל יסיים לערוך את השבוע',
            '',
            'info'
          )
    }
    
    return <div className={styles.all}>

        <div className={styles.upperContainer}>
            <Link to="/"><button className={styles.signout} onClick={() => {localStorage.clear()}}><BiLogOut></BiLogOut></button></Link>
            <h1 className={styles.h1}>שלום, {fullName}</h1>
        </div>

        <div className={styles.container}>
            <Link to="/CurrentWeek"><button className={styles.btn}>צפיה במשמרות נוכחיות</button></Link>
            {weekVisible ? <Link to="/chooseShifts"><button className={styles.btn}>בחירת משמרות לשבוע הבא</button></Link> :
            <button onClick={closedBtn} className={styles.closed_btn}>בחירת משמרות  סגורה</button> }
            <Link to="/userSettings"><button className={styles.btn}>הגדרות משתמש</button></Link>
            <Outlet />
        </div>
    </div> 

}

export default UserHomePage;
  