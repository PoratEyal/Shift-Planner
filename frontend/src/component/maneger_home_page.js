import styles from '../styles/maneger_home_page.module.css'
import React from 'react';

const ManagerHomePage = () => {
    return <div className={styles.container}>
                <button>משמרות נוכחיות</button>
                <button>משמרות לשבוע הבא</button>
                <button>ניהול עובדים</button>
            </div>
}

export default ManagerHomePage;