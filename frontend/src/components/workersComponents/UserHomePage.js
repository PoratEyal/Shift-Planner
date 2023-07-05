import styles from '../manegerComponents/maneger_home_page.module.css'
import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom';

const UserHomePage = () => {
    const navigate = useNavigate();
    
    const [fullName, setName] = useState("");

    useEffect(() => {
        const newdata = JSON.parse(localStorage.getItem("user"));
        if(newdata){
            setName(newdata.fullName);
        } else{
            navigate('/');
        }

    }, []) 
    
    return <div className={styles.allPage}>
        <Link to="/"><button className={styles.signout} onClick={() => {localStorage.clear()}}>התנתק</button></Link>

        <div className={styles.container}>
            <h1 className={styles.h1}>שלום, {fullName}</h1>
            <Link to="/CurrentWeek"><button className={styles.btn}>צפיה במשמרות נוכחיות</button></Link>
            <Link to="/chooseShifts"><button className={styles.btn}>בחירת משמרות לשבוע הבא</button></Link>
            <Link to="/userSettings"><button className={styles.btn}>הגדרות משתמש</button></Link>
            <Outlet />
        </div>
    </div> 

}

export default UserHomePage;
  