import styles from '../publics/login.module.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Roles from './Roles';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notValid, setNotValid] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isAuth = localStorage.getItem("isAuth");
    if (isAuth && isAuth !== null) {
      const user = JSON.parse(localStorage.getItem("user"));
      Roles.checkUserRole(user.job) ? navigate('/managerHomePage') : navigate('/CurrentWeek');
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.container_div}>
        <form className={styles.form} onSubmit={(e) => {
          e.preventDefault();
          axios.post(`${process.env.REACT_APP_URL}/login`, { username: username, password: password }).then((response) => {
            if(response.status === 200){
            const user = response.data;
            localStorage.setItem("token", user.token);
            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("isAuth", true);
            Roles.checkUserRole(user.job) ? navigate('/managerHomePage') : navigate('/CurrentWeek');
            }
            else{
              setNotValid(true);
            }

          }).catch(() => {
          })
        }}>
          
          <h1 className={styles["login-text"]}>כניסה למערכת</h1>

          <div>
            <div className={styles["wave-group"]}>
              <input required type="text" className={styles.input} onChange={(e) => { setUsername(e.target.value) }} />
              <span className={styles.bar}></span>
              <label className={styles.label}>
                <span className={styles["label-char"]} style={{ "--index": 7 }}>ש</span>
                <span className={styles["label-char"]} style={{ "--index": 6 }}>מ</span>
                <span className={styles["label-char"]} style={{ "--index": 5 }}>ת</span>
                <span className={styles["label-char"]} style={{ "--index": 4 }}>ש</span>
                <span className={styles["label-char"]} style={{ "--index": 3 }}>מ</span>
                <span className={styles["label-char"]} style={{ "--index": 2 }}>&nbsp;</span>
                <span className={styles["label-char"]} style={{ "--index": 1 }}>ם</span>
                <span className={styles["label-char"]} style={{ "--index": 0 }}>ש</span>
              </label>
            </div>
          </div>

          <div>
            <div className={styles["wave-group"]}>
              <input required type="password" className={styles.input} onChange={(e) => { setPassword(e.target.value) }} />
              <span className={styles.bar}></span>
              <label className={styles.label}>
                <span className={styles["label-char"]} style={{ "--index": 4 }}>ה</span>
                <span className={styles["label-char"]} style={{ "--index": 3 }}>מ</span>
                <span className={styles["label-char"]} style={{ "--index": 2 }}>ס</span>
                <span className={styles["label-char"]} style={{ "--index": 1 }}>י</span>
                <span className={styles["label-char"]} style={{ "--index": 0 }}>ס</span>
              </label>
            </div>
          </div>
          {
            notValid ? <p>שם משתמש או סיסמא שגויים</p> : null
          }
          {/* <a href='/forgotPassword'>שכחתי סיסמה</a> */}
          
          <button className={styles.btn} type="submit">התחברות</button>

        </form>

      </div>
    </div>

  );
}

export default Login;