import { useRef, useState } from 'react';
//import styles from '../userSettings/UserSetings.module.css';

import styles from '../managerSettings/managerSetings.module.css'

import axios from 'axios';
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';



const ManagerSettings = () => {

    const navigate = useNavigate();
    //const [username, setUsername] = useState('');
    
    const username = useRef();
    const [password, setPassword] = useState('');
    const [isEmpty, setIsEmpty] = useState(false);
    const userData = JSON.parse(localStorage.getItem('user'));

    const changeUser = async () => {
        if (username.current.value.trim() !== '' && password.trim() !== '') {
            setIsEmpty(false);
            const updatedUser = {
                _id: userData._id,
                fullName: userData.fullName,
                username: username.current.value,
                password: password,
                role: userData.role,
                job: userData.job,
            };

            console.log(updatedUser);

            await axios
                .put('http://localhost:3001/app/editUser', updatedUser)
                .then((response) => {
                    console.log(response.data);
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
                <button onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
                <p>שינוי שם משתמש או סיסמה</p>
            </div>

            <div className={styles.container}>
                <h2 className={styles.h2}>שינוי משתמש</h2>

                <input
                    className={`${styles.input} ${isEmpty ? styles.emptyInput : ''}`}
                    placeholder="שם-משתמש"
                    //value={username.current.value}
                    ref={username}
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
        </div>

    );

}

export default ManagerSettings