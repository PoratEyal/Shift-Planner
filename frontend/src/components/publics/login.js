import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Roles from './Roles';

import styles from '../publics/login.module.css';

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notValid, setNotValid] = useState(false);
  const [validationKey, setValidationKey] = useState(0); // State variable for unique key
  const navigate = useNavigate();

  useEffect(() => {
    let isAuth = localStorage.getItem("isAuth");
    if (isAuth && isAuth !== null) {
      const user = JSON.parse(localStorage.getItem("user"));
      Roles.checkUserRole(user.job) ? navigate('/managerHomePage') : navigate('/CurrentWeek');
    }
  }, []);

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_URL}/login`, { username: username, password: password }).then((response) => {
      if (response.status === 200) {
        const user = response.data;
        localStorage.setItem("token", user.token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuth", true);
        Roles.checkUserRole(user.job) ? navigate('/managerHomePage') : navigate('/CurrentWeek');
      } else {
        setNotValid(true);
        setValidationKey(prevKey => prevKey + 1); // Update the key to trigger re-render
      }
    }).catch(() => {
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.logo}></div>
      <div className={styles.container_div}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div>
            <input type="text" placeholder='שם משתמש' className={styles.input} onChange={(e) => { setUsername(e.target.value) }} />
          </div>
          <div>
            <input type="password" placeholder='סיסמה' className={styles.input} onChange={(e) => { setPassword(e.target.value) }} />
          </div>
          {
            notValid ? <p key={validationKey} className={styles.validation_p}>שם משתמש או סיסמא שגויים</p> : null
          }
          <button className={styles.btn} type="submit">התחברות</button>
          <div className={styles.blueBack}></div>
        </form>
      </div>
    </div>
  );
};

export default Login;
