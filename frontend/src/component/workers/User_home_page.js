import styles from '../maneger/maneger_home_page.module.css'
import React from 'react'
import { Link, Outlet, Route, Routes } from 'react-router-dom';

const UserHomePage = () => {
    return <div className={styles.container}>
        <h1 className={styles.h1}>ברוך הבא עובד</h1>
        <Link to="/nba"><button className={styles.btn}>משמרות נוכחיות</button></Link>
        <Link to="/nba2"><button className={styles.btn}>משמרות לשבוע הבא</button></Link>
{/* 
        <Routes>
            <Route path='userManagment' element={}></Route>
        </Routes> */}

        <Outlet />
    </div>
}

export default UserHomePage;
  