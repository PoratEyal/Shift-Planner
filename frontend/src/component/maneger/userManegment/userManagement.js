import styles from '../userManegment/userManagment.module.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AllUsers from '../userManegment/allUsers'
import AddRole from '../userManegment/addRole'

const UserManagement = () => {

  
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userAdded, setUserAdded] = useState(false);
    const [selectedRole, setRole] = useState("");
    const [roles, setRoles] = useState([]);


    useEffect(() => {

      const token = localStorage.getItem("token");
      const config= {
        headers: {Authorization: `Bearer ${token}`}
      }
      axios.get('http://localhost:3001/app/getRoles', config).then((response) => {
        setRoles(response.data);
      }).catch((err) => {console.log(err)});
    }, []);

    const NavigationBar = () => {
        const handleClick = (event, targetId) => {
          event.preventDefault();
      
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop,
              behavior: 'smooth',
            });
          }
        };
      
        return (
          <ul className={styles.navbar}>
            <li>
              <a href="#create-role" className={styles.x} onClick={(e) => handleClick(e, 'create-role')}>
                יצירת תפקיד
              </a>
            </li>
            <li>
              <a href="#users" className={styles.x} onClick={(e) => handleClick(e, 'users')}>
                משתמשים
              </a>
            </li>
            <li>
              <a href="#create-user" className={styles.x} onClick={(e) => handleClick(e, 'create-user')}>
                יצירת משתמש
              </a>
            </li>
          </ul>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const newUser = {
          fullName: fullName,
          username: username,
          password: password,
          role: selectedRole,
          job: "user"
        }
        console.log('Form submitted:', { fullName, username, password });
        axios.post("http://localhost:3001/app/addUser", newUser)
        .then((response) => {
          console.log('Form submitted successfully:', response.data);
          setUserAdded(true);
          setFullName('');
          setUsername('');
          setPassword('');
        })
        .catch((error) => {
          console.error('An error occurred:', error);
        });
    };

    return (
        <div>
            <NavigationBar />
            <div className={styles.container}>

                <div id="create-user" className={styles.createUser}>
                    <h2 className={styles.h2}>יצירת משתמש</h2>
                    
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
                          className={styles.input}
                          type="text"
                          id="username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                        <label className={styles.label_username} htmlFor="username">שם משתמש</label>
                      </div>

                      <div className={styles.formGroup}>
                        <input
                          className={styles.input}
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <label className={styles.label_password} htmlFor="password">סיסמה</label>
                      </div>

                      <div className={styles.formGroup}>
                        <select className={styles.input} onChange={
                          (e) => {
                            setRole(e.target.value)
                            }
                          }>
                          {
                            roles.map(role => {return <option value={role._id}>{role.name}</option>})
                          }
                        </select>
                      </div>




                      <button className={styles.btn} onClick={() => setUserAdded(false)} type="submit">יצירה</button>
                    </form>
                </div>

                <div id="users" className={styles.users}>
                    <h2 className={styles.h2}>משתמשים</h2>
                    <AllUsers added={userAdded}></AllUsers>
                </div>
                
                <div id="create-role" className={styles.createRole}>
                    <h2 className={styles.h2}>יצירת תפקיד</h2>
                    <AddRole></AddRole>
                </div>

            </div>
        </div>
    );
}

export default UserManagement
