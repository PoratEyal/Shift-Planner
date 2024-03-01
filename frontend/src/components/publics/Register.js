import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Roles from './Roles';
import styles from '../publics/register.module.css';
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import CheckPassword from '.././popups/checkPassword/checkPassword';
import Otp from '../publics/OTP/otp'

const Register = () => {
  const [password, setPassword] = useState("");
  const [passwordVal, setPasswordVal] = useState(false)

  const [fullname, setFullname] = useState("");
  const [fullnameVal, setFullnameVal] = useState(false)

  const [email, setEmail] = useState("");
  const [emailVal, setEmailVal] = useState(false)

  const [show, setShow] = useState(true);

  const [openPopUp, setOpenPopUp] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    let isAuth = localStorage.getItem("isAuth");
    if (isAuth && isAuth !== null) {
      const user = JSON.parse(localStorage.getItem("user"));
      Roles.checkUserRole(user.job) ? navigate('/managerHomePage') : navigate('/CurrentWeek');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.length < 5) {
      setPasswordVal(true)
      setPassword("");
    }
    if (fullname.length === 0) {
      setFullnameVal(true)    
      setFullname("");
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailVal(true);
      setEmail("");
    }  

    if( !passwordVal && !fullnameVal && !emailVal){
      const userRegister = {
        fullName: fullname,
        password: password,
        role: '64a7d10d0606ff97cf2796dd',
        email: email,
        job: 'admin'
      }

      axios.post(`${process.env.REACT_APP_URL}/addManager`, userRegister)
          .then(() => {
            openCodeOTP(e)
          })
          .catch((error) => {
            console.log(error);
          });
    }
  };

  const openCodeOTP = (e) => {
    e.preventDefault()
    setOpenPopUp(true)
  }

  const handlePasswordChange = (value) => {
    setPassword(value);
    setPasswordVal(value.length < 5);
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    setEmailVal(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));
  };

  const handleFullnameChange = (value) => {
    setFullname(value);
    setFullnameVal(value.length === 0);
  };

  return (
    <>
      {openPopUp ? (
        <Otp
          className={styles.code_component}
          userEmail={email}
          name={fullname}
          setOpenPopUp={setOpenPopUp}
        />
      ) : (
        <div className={styles.page_container}>
          <div className={styles.container}>
  
            <img className={styles.password_time_svg} src="circels.svg" />
  
            <div className={styles.lock}>
              <img src="lock.svg" />
            </div>
  
            
            <form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
  
              <div className={styles.logo}></div>
  
              <div className={styles.input_label_div}>
                <input type="text" placeholder='שם מלא' autoComplete="fullname" className={styles.input} onChange={(e) => handleFullnameChange(e.target.value)} />
                {fullnameVal ? <label className={styles.validation_fullname}>שם מלא צריך לכלול לפחות תו אחד</label> : null}
              </div>
  
              <div className={styles.input_label_div}>
                <input type="email" placeholder='אימייל' autoComplete="email" className={styles.input} onChange={(e) => handleEmailChange(e.target.value)} />
                {emailVal ? <label className={styles.validation_email}>כתובת האימייל שהוזנה אינה תקינה</label> : null}
              </div>
  
              <div className={styles.input_label_div}>
                <div className={styles.password_div}>
                  <div className={styles.input_container}>
                    <input id='password' autoComplete="current-password" type={show ? "password" : "text"} placeholder='סיסמה' className={styles.input} onChange={(e) => handlePasswordChange(e.target.value)} />
                    {password.length > 0 ? (
                      show ? (
                        <BiSolidShow
                          className={styles.show_password}
                          onClick={(e) => setShow(!show)}
                        ></BiSolidShow>
                      ) : (
                        <BiSolidHide
                          className={styles.show_password}
                          onClick={(e) => setShow(!show)}
                        ></BiSolidHide>
                      )
                    ) : null}
                  </div>
                </div>
                {passwordVal ? <label className={styles.validation_password}>סיסמה חייבת להכיל לפחות 5 תווים</label> : null}
              </div>
              
              <button className={styles.btn} type="submit">לחצו להרשמה</button>
  
              <div className={styles.login_div}>
                <label>להתחברות</label>
                <label onClick={() => navigate('/')} className={styles.login_btn}>לחצו כאן</label>
              </div>
              
            </form>
  
          </div>
        </div>
      )}
    </>
  );
  
}

export default Register;
