import { useState } from 'react';
import styles from '../managerSettings/managerSetings.module.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageLayout from './/..//..//layout/PageLayout';
import Swal from 'sweetalert2';

const ManagerSettings = () => {
  const navigate = useNavigate();
  const [passwordAgain, setPasswordAgain] = useState('');
  const [password, setPassword] = useState('');
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
        password: password
      };

      await axios.put(`${process.env.REACT_APP_URL}/changePassword`, updatedUser)
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
        confirmButtonColor: '#34a0ff',
        confirmButtonText: 'סגירה'
      });
      return;
    }
  };

  return <PageLayout text='עדכון פרטי משתמש'>
      <div className={styles.container}>
        <h2 className={styles.h2}>הזינו סיסמה חדשה</h2>

        <input
        type="password"
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
    </PageLayout>
}

export default ManagerSettings;