import { useState } from 'react';
import styles from '../managerSettings/managerSetings.module.css'
import axios from 'axios';
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

const ManagerSettings = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isEmpty, setIsEmpty] = useState(false);
  const userData = JSON.parse(localStorage.getItem('user'));

  const changeUser = async () => {
    if (password.length < 5) {
        setIsEmpty(false);
        return
    }

    if (username.trim() !== '' && password.trim() !== '') {
      setIsEmpty(false);
      const updatedUser = {
        _id: userData._id,
        fullName: userData.fullName,
        username: username,
        password: password,
        role: userData.role,
        job: userData.job,
      };

      await axios
        .put(`${process.env.REACT_APP_URL}/editUser`, updatedUser)
        .then((response) => {
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
        <button onClick={() => navigate('/managerHomePage')}>
          <BiSolidHome />
        </button>
        <p>פרופיל משתמש</p>
      </div>

      <div className={styles.container}>
        <h2 className={styles.h2}>שינוי פרטי משתמש</h2>

        <input
          className={`${styles.input} ${isEmpty ? styles.emptyInput : ''}`}
          placeholder="שם משתמש"
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
        className={`${styles.input} ${isEmpty ? styles.emptyInput : ''}`}
        placeholder="סיסמה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        minLength={5}
        required
        />

        <button onClick={changeUser} className={styles.btn}>
          אישור
        </button>
      </div>
    </div>
  );
}

export default ManagerSettings;
