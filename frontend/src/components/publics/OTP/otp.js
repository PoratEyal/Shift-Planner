import React, { useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from './otp.module.css'

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
    return <form onSubmit={(e) => handleSubmit(e)}>
        
        <span>הזנת קוד</span>
        <p>שלחנו קוד לאימייל שלך</p>

        <div>
            <input required maxLength="1" type="text" id="otp-input1" ref={otp_input1} />
            <input required maxLength="1" type="text" id="otp-input2" ref={otp_input2}/>
            <input required maxLength="1" type="text" id="otp-input3" ref={otp_input3}/>
            <input required maxLength="1" type="text" id="otp-input4" ref={otp_input4}/>
        </div>

        <button type="submit">שליחה</button>

        <button>×</button>

        <p>אופס, לא קיבלתם קוד?<button>שליחת קוד נוסף</button></p>
            
    </form>;
}

export default Otp;