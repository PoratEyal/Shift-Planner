import styles from '../publics/login.module.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Roles from './Roles';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  

  useEffect(() => {
    let isAuth = localStorage.getItem("isAuth");
    if(isAuth && isAuth !== null){
      const user = JSON.parse(localStorage.getItem("user"));          
      Roles.checkUserRole(user.job) ? navigate('/managerHomePage') : navigate('/HomePage');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.container_div}>
      <form className={styles.form} onSubmit={(e) => {
        e.preventDefault();
        axios.post("http://localhost:3001/app/login", {username: username, password: password}).then((response) => {
          const user = response.data;
          localStorage.setItem("token", user.token);
          localStorage.setItem("user", JSON.stringify(user));
          localStorage.setItem("isAuth", true);
          Roles.checkUserRole(user.job) ? navigate('/managerHomePage') : navigate('/HomePage');
        }).catch((err) =>{
          console.log(err);
        })
      }}>
        <label className={styles["login-text"]}>כניסה למערכת</label>
  
        <div>
          <div className={styles["wave-group"]}>
            <input required type="text" className={styles.input} onChange={(e) => {setUsername(e.target.value)}}/>
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
            <input required type="password" className={styles.input} onChange={(e) => {setPassword(e.target.value)}}/>
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
  
        <button className={styles.btn} type="submit">התחברות</button>
  
      </form>
    </div>
  );
}

export default Login;