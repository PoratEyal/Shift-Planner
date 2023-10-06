import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Roles from './Roles';
import styles from '../publics/login.module.css';
import { BiSolidShow, BiSolidHide } from "react-icons/bi";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
    axios.post(`${process.env.REACT_APP_URL}/login`, { username: username, password: password }).then((response) => {
      if (response.status === 200) {
        const user = response.data;
        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuth", true);
        Roles.checkUserRole(user.job) ? navigate('/managerHomePage') : navigate('/CurrentWeek');
      }
    }).catch(() => {
    });
  };

  return <div className={styles.page_container}>
    <div className={styles.container}>

    <div className={styles.logo}></div>

    <div className={styles.container_div}>
      <form className={styles.form} onSubmit={handleSubmit}>

        <div>
          <input type="text" placeholder='שם משתמש' autoComplete="username" className={styles.input} onChange={(e) => { setUsername(e.target.value) }} />
        </div>

        <div>
          <input type="email" placeholder='אימייל' autoComplete="username" className={styles.input} onChange={(e) => { setUsername(e.target.value) }} />
        </div>

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

        <button className={styles.btn} type="submit">הרשמה</button>

        <div className={styles.blueBack}></div>

      </form>
    </div>

    </div>
  </div>
    
};

export default Register;
