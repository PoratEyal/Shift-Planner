import { useState } from 'react';
import styles from '../userSettings/UserSetings.module.css';
import axios from 'axios';
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

const UserSettings = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isEmpty, setIsEmpty] = useState(false); // New state variable
  const userData = JSON.parse(localStorage.getItem('user'));

  const changeUser = async () => {
    if (username.trim() !== '' && password.trim() !== '') {
      setIsEmpty(false); // Reset isEmpty state
      const updatedUser = {
        _id: userData._id,
        fullName: userData.fullName,
        username: username,
        password: password,
        role: userData.role,
        job: userData.job,
      };

      console.log(updatedUser);

      await axios
        .put('http://localhost:3001/app/editUser', updatedUser)
        .then((response) => {
          setUsername('');
          setPassword('');
          setIsEmpty(false);
          localStorage.clear();
          navigate('/');
        })
        .catch((error) => {
          console.error('An error occurred:', error);
        });
    } else {
      setIsEmpty(true);
    }

    
  };

  return (
    <div>
      <div className={styles.nav_container}>
        <button onClick={() => navigate('/CurrentWeek')}><BiSolidHome></BiSolidHome></button>
        <p>פרופיל משתמש</p>
      </div>

      <div className={styles.container}>
        <h2 className={styles.h2}>שינוי פרטי משתמש</h2>

        <input
          className={`${styles.input} ${isEmpty ? styles.emptyInput : ''}`}
          placeholder="שם משתמש חדש"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className={`${styles.input} ${isEmpty ? styles.emptyInput : ''}`}
          placeholder="סיסמה חדשה"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={changeUser} className={styles.btn}>
          אישור
        </button>
      </div>
    </div>

  );
};

export default UserSettings;