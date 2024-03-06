import React, { useState, useEffect } from 'react';
import styles from '../userSettings/UserSetings.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageLayoutWorker from './/..//..//layout/PageLayoutWorker';
import RedAlert from '../../alerts/redAlert/RedAlert';
import Swal from 'sweetalert2';

const UserSettings = () => {
  const navigate = useNavigate();
  const [passwordAgain, setPasswordAgain] = useState('');
  const [password, setPassword] = useState('');
  const [validationMessage, setValidationMessage] = useState(false)
  const userData = JSON.parse(localStorage.getItem('user'));

  const changeUser = async () => {
    if (passwordAgain.trim() !== '' && password.trim() !== '') {
      if (password.length < 5) {
        Swal.fire({
          title: 'יש למלא סיסמה גדולה מחמישה תווים',
          text: "",
          icon: 'warning',
          confirmButtonColor: '#34a0ff',
          confirmButtonText: 'סגירה'
        });
        return;
      }

      const updatedUser = {
        _id: userData._id,
        fullName: userData.fullName,
        username: userData.username,
        password: password,
        role: userData.role,
        job: userData.job,
      };

      await axios.put(`${process.env.REACT_APP_URL}/editUser`, updatedUser)
        .then(() => {
          setPassword('');
          localStorage.clear();
          navigate('/');
        })
        .catch((error) => {
          console.error('An error occurred:', error);
        });
    } else {
      setValidationMessage(true);
      // Set validationMessage back to false after 5 seconds
      setTimeout(() => {
        setValidationMessage(false);
      }, 5000);
      return;
    }
  };

  return (
    <PageLayoutWorker text='עדכון פרטי משתמש'>
      <div className={styles.container}>
        <h2 className={styles.h2}>הזינו סיסמה חדשה</h2>

        <input
          type='password'
          className={styles.input}
          placeholder="סיסמה חדשה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={5}
          required
        />

        <input
          type="password"
          className={styles.input}
          placeholder="אישור סיסמה חדשה"
          value={passwordAgain}
          onChange={(e) => setPasswordAgain(e.target.value)}
          minLength={5}
          required
        />

        <button onClick={changeUser} className={styles.btn}>
          אישור
        </button>

        <img className={styles.password_time_svg} src="password.svg" alt="Icon" />
      </div>

      <div className={styles.alert}>
        {validationMessage && <RedAlert text='יש למלא את כל השדות'></RedAlert>}
      </div>
    </PageLayoutWorker>
  );
};

export default UserSettings;
