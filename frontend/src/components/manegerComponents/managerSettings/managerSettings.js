import { useState } from 'react';
import styles from '../managerSettings/managerSetings.module.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageLayout from './/..//..//layout/PageLayout';
import Swal from 'sweetalert2';

const ManagerSettings = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const userData = JSON.parse(localStorage.getItem('user'));

  const changeUser = async () => {
    if (username.trim() !== '' && password.trim() !== '') {
      if (password.length < 5) {
        Swal.fire({
          title: 'יש למלא סיסמה גדולה מחמישה תווים',
          text: "",
          icon: 'warning',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'סגירה'
        });
        return;
      }

      const updatedUser = {
        _id: userData._id,
        fullName: userData.fullName,
        username: username,
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
      Swal.fire({
        title: 'יש למלא את כל השדות',
        text: "",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'סגירה'
      });
      return;
    }
  };

  return <PageLayout text='עדכון פרטי משתמש'>
      <div className={styles.container}>
        <h2 className={styles.h2}>הזינו פרטי משתמש חדשים</h2>

        <input
          className={styles.input}
          placeholder="שם משתמש באנגלית בלבד"
          value={username}
          onChange={(e) => {
            const inputUsername = e.target.value;
            const alphanumericRegex = /^[a-zA-Z0-9]*$/;
            if (alphanumericRegex.test(inputUsername)) {
              setUsername(inputUsername);
            }
          }}
        />

        <input
        type="password"
        className={styles.input}
        placeholder="סיסמה בעלת 5 תווים לפחות"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={5}
        required
        />

        <button onClick={changeUser} className={styles.btn}>
          אישור
        </button>

        <img className={styles.password_time_svg} src="password.svg" alt="Icon" />
      </div>
    </PageLayout>
}

export default ManagerSettings;