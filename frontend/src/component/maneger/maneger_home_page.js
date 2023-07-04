import styles from '../maneger/maneger_home_page.module.css'
import React, { useEffect, useState } from 'react'
import { Link, Outlet} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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


    return <div className={styles.allPage}>
        <Link to="/"><button className={styles.signout} onClick={() => {localStorage.clear()}}>התנתק</button></Link>

        <div className={styles.container}>
            <h1 className={styles.h1}>שלום, {fullname}</h1>
            <Link to="/currentWeekShifts"><button className={styles.btn}>משמרות נוכחיות</button></Link> 
            <Link to="/createNewWeek"><button className={styles.btn}>משמרות לשבוע הבא</button></Link> 
            <Link to="/userManagment"><button className={styles.btn}>ניהול עובדים</button></Link>
            <Outlet />
        </div>
    </div>
}

export default ManagerHomePage;
  