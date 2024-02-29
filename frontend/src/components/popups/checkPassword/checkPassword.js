import React, { useRef } from "react";
import styles from './checkPassword.module.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CheckPassword = (props) => {
    const navigate = useNavigate();
    const otp_input1 = useRef(null);
    const otp_input2 = useRef(null);
    const otp_input3 = useRef(null);
    const otp_input4 = useRef(null);

    console.log(props.userEmail);
    const handleSubmit = (e)=>{
        e.preventDefault();
        const checkOTPof = {
            email: props.userEmail,
            otp: otp_input1.current.value+otp_input2.current.value+otp_input3.current.value+otp_input4.current.value
        }
        axios.post(`${process.env.REACT_APP_URL}/checkOTP`, checkOTPof).then((response) => {
            console.log(response);
            if(response.status === 200){
                navigate('/');
            }
        })    
    }
    return <form className={styles.otpForm} onSubmit={(e) => handleSubmit(e)}>
        
        <span className={styles.mainHeading}>הזנת קוד</span>
        <p className={styles.otpSubheading}>שלחנו קוד לאימייל שלך</p>
        <div className={styles.inputContainer}>
            <input required maxLength="1" type="text" className={styles.otpInput} id="otp-input1" ref={otp_input1} />
            <input required maxLength="1" type="text" className={styles.otpInput} id="otp-input2" ref={otp_input2}/>
            <input required maxLength="1" type="text" className={styles.otpInput} id="otp-input3" ref={otp_input3}/>
            <input required maxLength="1" type="text" className={styles.otpInput} id="otp-input4" ref={otp_input4}/> 
        </div>
        <button className={styles.verifyButton} type="submit">שליחה</button>
        <button className={styles.exitBtn}>×</button>
        <p className={styles.resendNote}>אופס, לא קיבלתם קוד?<button className={styles.resendBtn}>שליחת קוד נוסף</button></p>
            
    </form>;
} 

export default CheckPassword;
