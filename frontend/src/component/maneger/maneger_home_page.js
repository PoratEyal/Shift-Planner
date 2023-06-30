import styles from '../maneger/maneger_home_page.module.css'
import React from 'react'
import { Link, Outlet} from 'react-router-dom';

const ManagerHomePage = () => {
    return <div className={styles.container}>
        <h1 className={styles.h1}>ברוך הבא אלי</h1>
        <Link to="/"><button className={styles.btn}>משמרות נוכחיות</button></Link> 
        <Link to="/createNewWeek"><button className={styles.btn}>משמרות לשבוע הבא</button></Link> 
        <Link to="/userManagment"><button className={styles.btn}>ניהול עובדים</button></Link>
        <Outlet></Outlet>
    </div>
}

export default ManagerHomePage;
  