import styles from './userManagment.module.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AllUsers from './AllUsers'
import AddRole from './AddRole'
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { AiOutlineUserAdd } from "react-icons/ai";

const UserManagement = () => {

  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userAdded, setUserAdded] = useState(false);
  const [selectedRole, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [activeElement, setActiveElement] = useState(0);
  const [addLine, setAddLine] = useState(false)

  const handleClick = (event, targetId) => {
    event.preventDefault();
    if (targetId === "users") {
      setActiveElement(0);
    }
    else if(targetId === "create-user"){
      setActiveElement(1)
    }
    else if(targetId === "create-role"){
      setActiveElement(2)
    }
  };

  const getRoles = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    axios.get('http://localhost:3001/app/getRoles', config).then((response) => {
      setRoles(response.data);
    }).catch((err) => { console.log(err) });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      fullName: fullName,
      username: username,
      password: password,
      role: selectedRole,
      job: "user"
    }
    //console.log('Form submitted:', { fullName, username, password, selectedRole});
    axios.post("http://localhost:3001/app/addUser", newUser)
      .then((response) => {
        //console.log('Form submitted successfully:', response.data);
        setUserAdded(true);
        setFullName('');
        setUsername('');
        setPassword('');
        setActiveElement(0)
      })
      .catch((error) => {
        console.error('An error occurred:', error);
      });
  };

  const childElements = [
    <div id="users" className={styles.users}>
      {/* <h2 className={styles.h2}>משתמשים</h2> */}
      <AllUsers added={userAdded}></AllUsers>
    </div>,

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
          <select className={styles.select} onChange={
            (e) => {
              setRole(e.target.value)
            }
          }>
            {
              roles.map(role => { return <option value={role._id} key={role._id}>{role.name}</option> })
            }
          </select>
          <label className={styles.label_role}>תפקיד</label>
        </div>

        <button className={styles.btn} onClick={() => setUserAdded(false)} type="submit">יצירה</button>

      </form>
    </div>,

    <div id="create-role" className={styles.createRole}>
      {/* <h2 className={styles.h2}>תפקידים</h2> */}
      <AddRole roleAdded={getRoles}></AddRole>
    </div>
  ]

  useEffect(() => {
    getRoles();
  }, []);

  const NavigationBar = () => {
    return (
      <div className={styles.nav_container}>
        <ul className={styles.navbar}>
          <li>
            <button onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
          </li>
          <li>
            <a href="#create-role" className={styles.x} onClick={(e) => handleClick(e, 'create-role')}>
               תפקידים
            </a>
          </li>
          <li>
            <a href="#users" className={styles.x} onClick={(e) => handleClick(e, 'users')}>
              משתמשים
            </a>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className={styles.all_container}>

      <div >
        <NavigationBar />
      </div>

      <div className={styles.container} id='options'>
        {
          childElements[activeElement]
        }
      </div>

      <button onClick={(e) => handleClick(e, 'create-user')} className={styles.addUser_btn}><AiOutlineUserAdd></AiOutlineUserAdd></button>
    </div>
  );
}

export default UserManagement


