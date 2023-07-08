import styles from '../manegerComponents/maneger_home_page.module.css'
import React, { useEffect, useState } from 'react'
import { Link, Outlet} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import { BiUserCircle } from "react-icons/bi";

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


    return <React.Fragment>
        <div className={styles.upperContainer}>
            <div className={styles.nav_buttons}>
                <Link to="/"><button className={styles.signout} onClick={() => {localStorage.clear()}}><BiLogOut></BiLogOut></button></Link>
                <Link to="/managerSettings"><button className={styles.user_settings}><BiUserCircle></BiUserCircle></button></Link>
                <Link to="/userManagment"><button className={styles.user_managment_btn}>ניהול עובדים</button></Link>
            </div>

            <h1 className={styles.h1}>שלום {fullname}</h1>
        </div>

        <div className={styles.container}>
            <Link to="/SeeCurrentWeekShifts">
            <button className={styles.btn}>צפיה בשבוע נוכחי</button>
            </Link>
            <Link to="/currentWeekShifts">
            <button className={styles.btn}>בחירת עובדים לשבוע הבא</button>
            </Link>
            <Link to="/createNewWeek"><button className={styles.btn}>בנית משמרות לשבוע הבא</button></Link> 

            <Outlet />
        </div>
    </React.Fragment>
}

export default ManagerHomePage;
  