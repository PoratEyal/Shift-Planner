import styles from '../maneger/maneger_home_page.module.css'
import React from 'react'

const ManagerHomePage = () => {
    return <div className={styles.container}>
        <h1 className={styles.h1}>ברוך הבא אלי</h1>
        <button className={styles.btn}>משמרות נוכחיות</button>
        <button className={styles.btn}>משמרות לשבוע הבא</button>
        <button className={styles.btn}>ניהול עובדים</button>
    </div>
}

export default ManagerHomePage;