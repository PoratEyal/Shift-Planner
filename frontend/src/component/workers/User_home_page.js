import styles from '../maneger/maneger_home_page.module.css'
import React from 'react'
import { Link, Outlet } from 'react-router-dom';

const UserHomePage = () => {

    const data = JSON.parse(localStorage.getItem("user"));
    const fullName = data.fullName;

    return <div className={styles.container}>
        <h1 className={styles.h1}>שלום, {fullName}</h1>
        <Link to="/aaa"><button className={styles.btn}>צפיה במשמרות נוכחיות</button></Link>
        <Link to="/chooseShifts"><button className={styles.btn}>בחירת משמרות לשבוע הבא</button></Link>
        <Link to="/a"><button className={styles.btn}>הגדרות משתמש</button></Link>
        <Link to="/login"><button className={styles.btn} onClick={() => {localStorage.clear()}}>הגדרות משתמש</button></Link>


        <Outlet />
    </div>
}

export default UserHomePage;
  