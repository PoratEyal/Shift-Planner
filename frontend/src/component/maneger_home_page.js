import styles from '../styles/maneger_home_page.module.css'
import React from 'react';

const maneger_home_page = () => {
    return <div className={styles.container}>
                <button>משמרות נוכחיות</button>
                <button>משמרות לשבוע הבא</button>
                <button>ניהול עובדים</button>
            </div>
}

export default maneger_home_page;