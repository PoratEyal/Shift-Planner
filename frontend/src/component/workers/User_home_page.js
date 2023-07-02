import styles from '../maneger/maneger_home_page.module.css'
import React from 'react'
import { Link, Outlet, Route, Routes } from 'react-router-dom';

const UserHomePage = () => {

    const data = JSON.parse(localStorage.getItem("user"));
    const fullName = data.fullName;

    return <div className={styles.container}>
        <h1 className={styles.h1}>{fullName} ברוך הבא</h1>
        <Link to="/aaa"><button className={styles.btn}>משמרות נוכחיות</button></Link>
        <Link to="/aa"><button className={styles.btn}>משמרות לשבוע הבא</button></Link>

        <Outlet />
    </div>
}

export default UserHomePage;
  