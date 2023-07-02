import styles from '../maneger/maneger_home_page.module.css'
import React, { useEffect } from 'react'
import { Link, Outlet} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ManagerHomePage = () => {
    const navigate = useNavigate();
    let data = {};
    let fullName = "";

    const StorageData = JSON.parse(localStorage.getItem("user"));
    fullName = StorageData.fullName;
    
    useEffect(() => {
        const StorageData = JSON.parse(localStorage.getItem("user"));
        if(StorageData){
            data = StorageData;
        }
        else{
            navigate('/');
        }
    }, [])


    return <div className={styles.container}>
        <h1 className={styles.h1}>שלום, {fullName}</h1>
        <Link to="/"><button className={styles.btn}>משמרות נוכחיות</button></Link> 
        <Link to="/createNewWeek"><button className={styles.btn}>משמרות לשבוע הבא</button></Link> 
        <Link to="/userManagment"><button className={styles.btn}>ניהול עובדים</button></Link>
        <Link to="/"><button className={styles.btn} onClick={() => {localStorage.clear()}}>התנתק</button></Link>
        <Outlet></Outlet>
    </div>
}

export default ManagerHomePage;
  