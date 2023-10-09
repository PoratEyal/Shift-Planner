import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Roles from './Roles';
import styles from '../publics/register.module.css';
import { BiSolidShow, BiSolidHide } from "react-icons/bi";

const Register = () => {
  const [username, setUsername] = useState("");
  const [usernameVal, setUsernameVal] = useState(false)

  const [password, setPassword] = useState("");
  const [passwordVal, setPasswordVal] = useState(false)

  const [fullname, setFullname] = useState("");
  const [fullnameVal, setFullnameVal] = useState(false)

  const [email, setEmail] = useState("");
  const [emailVal, setEmailVal] = useState(false)

  const [show, setShow] = useState(true);

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
    if (username.length < 6) {
      setUsernameVal(true)
    }
    if (password.length < 6) {
      setPasswordVal(true)
    }
    if (fullname.length < 6) {
      setFullnameVal(true)
    }
    if (email.length < 6) {
      setEmailVal(true)
    }
    setUsername("");
    setPassword("");
    setFullname("");
    setEmail("");
  };

  return <div className={styles.page_container}>
      <div className={styles.container}>
        <div className={styles.logo}></div>

        <form className={styles.form} onSubmit={handleSubmit}>

          <div className={styles.input_label_div}>
            <input type="text" placeholder='שם מלא' autoComplete="username" className={styles.input} onChange={(e) => { setUsername(e.target.value) }} />
            {fullnameVal ? <label className={styles.validation_label}>לפחות תוו אחד</label> : null}
          </div>

          <div className={styles.input_label_div}>
            <input type="email" placeholder='אימייל' autoComplete="username" className={styles.input} onChange={(e) => { setUsername(e.target.value) }} />
            {emailVal ? <label className={styles.validation_label}>אימייל ולדציה</label> : null}
          </div>

          <div className={styles.input_label_div}>
            <input type="text" placeholder='שם משתמש' autoComplete="username" className={styles.input} onChange={(e) => { setUsername(e.target.value) }} />
            {usernameVal ? <label className={styles.validation_label}>שם משתמש חייב להיות באנגלית</label> : null}
          </div>

          <div className={styles.input_label_div}>
            <div className={styles.password_div}>
              <div className={styles.input_container}>
                <input id='password' autoComplete="current-password" type={show ? "password" : "text"} placeholder='סיסמה' className={styles.input} onChange={(e) => { setPassword(e.target.value) }} />
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
            {passwordVal ? <label className={styles.validation_label}>סיסמה חייבת להכיל לפחות 5 תווים</label> : null}
          </div>
          

          <button className={styles.btn} type="submit">הרשמה</button>
        </form>
      </div>
    </div>
};

export default Register;
