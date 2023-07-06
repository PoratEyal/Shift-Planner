import styles from '../manegerComponents/maneger_home_page.module.css'
import React, { useEffect, useState } from 'react'
import { Link, Outlet} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import { BsFillCalendarWeekFill } from "react-icons/bs";

const ManagerHomePage = () => {
    const navigate = useNavigate();
    let data = {};
    const [fullname, setName]= useState("");

    useEffect(() => {
        const StorageData = JSON.parse(localStorage.getItem("user"));
        if(StorageData){
            data = StorageData;
            setName(data.fullName);
        }
        else{
            navigate('/');
        }
    }, [])


    return <div className={styles.all}>
        <div className={styles.upperContainer}>
            <Link to="/"><button className={styles.signout} onClick={() => {localStorage.clear()}}><BiLogOut></BiLogOut></button></Link>
            <h1 className={styles.h1}>שלום {fullname}</h1>
        </div>

        <div className={styles.container}>
            <Link to="/currentWeekShifts">
            <button className={styles.btn}>צפיה בשבוע נוכחי</button>
            </Link>
            <Link to="/currentWeekShifts">
            <button className={styles.btn}>בחירת עובדים לשבוע הבא</button>
            </Link>
            <Link to="/createNewWeek"><button className={styles.btn}>בנית משמרות לשבוע הבא</button></Link> 
            <Link to="/userManagment"><button className={styles.btn1}>ניהול עובדים</button></Link>
            <Outlet />
        </div>
    </div>
}

export default ManagerHomePage;
  