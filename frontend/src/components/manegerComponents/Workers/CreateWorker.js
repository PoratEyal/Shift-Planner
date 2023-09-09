import styles from './createWorker.module.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ManagerContext } from '../ManagerHomePage' 
import { useContext } from 'react';
import Swal from 'sweetalert2';
import PageLayout from './/..//..//layout/PageLayout';

const CreateWorker = () => {
    
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userAdded, setUserAdded] = useState(false);
    const [selectedRole, setRole] = useState("");
    const [roles, setRoles] = useState([]);

    //context
    const managerContext = useContext(ManagerContext);
    const managerId = managerContext.getUser();

    const getRoles = () => {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };
        const reqbody ={
          managerId: managerContext.getUser()
        }
        axios
          .post(`${process.env.REACT_APP_URL}/getRoles`, reqbody ,config)
          .then((response) => {
            setRoles(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
    };

    useEffect(() => {
        getRoles();
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!fullName || !username || !password || !selectedRole || !managerId) {
            Swal.fire({
              title: 'יש למלא את כל השדות',
              text: "",
              icon: 'warning',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'אישור'
            });
            return;
        }

        const newUser = {
          fullName: fullName,
          username: username,
          password: password,
          role: selectedRole,
          manager: managerId,
          job: "user"
        }
        axios.post(`${process.env.REACT_APP_URL}/addUser`, newUser)
          .then(() => {
            setUserAdded(true);
            setFullName('');
            setUsername('');
            setPassword('');
            navigate('/workers')
          })
          .catch((error) => {
            Swal.fire({
              title: 'שם משתמש תפוס, הכנס שם משתמש אחר',
              text: "",
              icon: 'warning',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'אישור'
            })
          });
    };

    return <PageLayout text='יצירת עובד'>
        <div id="create-user" className={styles.createUser}>
            <h2 className={styles.h2}>הוספת עובד</h2>

            <form className={styles.userForm} onSubmit={handleSubmit}>

                <div className={styles.formGroup}>
                <input
                    className={styles.input}
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                <label className={styles.label_fullname} htmlFor="fullName">שם מלא</label>
                </div>

                <div className={styles.formGroup}>
                <input
                    placeholder='רק באנגלית'
                    className={styles.input}
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => {
                    const inputUsername = e.target.value;
                    const alphanumericRegex = /^[a-zA-Z0-9]*$/;
                    if (alphanumericRegex.test(inputUsername)) {
                        setUsername(inputUsername);
                    }
                    }}
                    required
                />
                <label className={styles.label_username} htmlFor="username">שם משתמש</label>
                </div>

                <div className={styles.formGroup}>
                <input
                    placeholder='5 תווים לפחות'
                    className={styles.input}
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={5}
                />
                <label className={styles.label_password} htmlFor="password">סיסמה</label>
                </div>

                <div className={styles.formGroup}>
                <select className={styles.select} onChange={(e) => { setRole(e.target.value) }} defaultValue="" required aria-required="true">
                    <option value="" disabled>בחר תפקיד</option>
                    {roles.map(role => { return <option value={role._id} key={role._id}>{role.name}</option> })}
                </select>
                <label className={styles.label_role}>תפקיד</label>
                </div>

                <button className={styles.btn} type="button" onClick={handleSubmit}>אישור</button>
            </form>
        </div>
    </PageLayout>
}

export default CreateWorker;