import { useState } from 'react';
import styles from '../userSettings/UserSetings.module.css';
import axios from 'axios';

const UserSettings = () => {
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
          console.log(response.data);
          setUsername('');
          setPassword('');
          setIsEmpty(false);
        })
        .catch((error) => {
          console.error('An error occurred:', error);
        });
    } else {
      setIsEmpty(true);
    }

    
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>שינוי משתמש</h2>

      <input
        className={`${styles.input} ${isEmpty ? styles.emptyInput : ''}`}
        placeholder="שם-משתמש"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className={`${styles.input} ${isEmpty ? styles.emptyInput : ''}`}
        placeholder="סיסמה"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={changeUser} className={styles.btn}>
        לחץ לשינוי
      </button>
    </div>
  );
};

export default UserSettings;
