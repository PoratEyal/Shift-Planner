import React, { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from './otp.module.css';
import { IoArrowBack } from "react-icons/io5";
import { FcLock } from "react-icons/fc";

const Otp = (props) => {
    
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

    return <form className={styles.container} onSubmit={(e) => handleSubmit(e)}>
        
        <IoArrowBack onClick={() => props.setOpenPopUp(false)} className={styles.backIcon}></IoArrowBack>

        <div className={styles.upper_text}>
            
            <div className={styles.title_div}>
                <FcLock className={styles.lock_icon}></FcLock>
                <span className={styles.span_title}>הזנת קוד</span>
            </div>

            <p className={styles.under_title}>אהלן {props.name}, שלחנו קוד לאימייל שלך</p>
        
        </div>


        <div className={styles.middle_div}>
            <div className={styles.input_div}>
                <input className={styles.input} required maxLength="1" type="text" id="otp-input1" ref={otp_input1} />
                <input className={styles.input} required maxLength="1" type="text" id="otp-input2" ref={otp_input2}/>
                <input className={styles.input} required maxLength="1" type="text" id="otp-input3" ref={otp_input3}/>
                <input className={styles.input} required maxLength="1" type="text" id="otp-input4" ref={otp_input4}/>
            </div>
        </div>

        <div className={styles.another_code}>
            <button className={styles.btn} type="submit">שליחה</button> 
            <label>אופס, לא קיבלתם קוד?</label>
            <button className={styles.btn_again}>שליחת קוד נוסף</button>
        </div>
            
    </form>;
}

export default Otp;