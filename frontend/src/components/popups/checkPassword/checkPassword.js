import React from "react";
import styles from './checkPassword.module.css';

const CheckPassword = () => {

    return <form className={styles.otpForm}>
        
        <span className={styles.mainHeading}>הזנת קוד</span>
        <p className={styles.otpSubheading}>שלחנו קוד לאימייל שלך</p>
        <div className={styles.inputContainer}>
            <input required maxLength="1" type="text" className={styles.otpInput} id="otp-input1" />
            <input required maxLength="1" type="text" className={styles.otpInput} id="otp-input2" />
            <input required maxLength="1" type="text" className={styles.otpInput} id="otp-input3" />
            <input required maxLength="1" type="text" className={styles.otpInput} id="otp-input4" /> 
        </div>
        <button className={styles.verifyButton} type="submit">שליחה</button>
        <button className={styles.exitBtn}>×</button>
        <p className={styles.resendNote}>אופס, לא קיבלתם קוד?<button className={styles.resendBtn}>שליחת קוד נוסף</button></p>
            
    </form>;
} 

export default CheckPassword;
