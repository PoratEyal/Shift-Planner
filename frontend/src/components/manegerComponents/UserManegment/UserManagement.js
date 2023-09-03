import styles from './userManagment.module.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AllUsers from './AllUsers'
import AddRole from './AddRole'
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import { ManagerContext } from '../ManagerHomePage' 
import { useContext } from 'react';
import Swal from 'sweetalert2';

const UserManagement = () => {

  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userAdded, setUserAdded] = useState(false);
  const [selectedRole, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [activeElement, setActiveElement] = useState(0);
  const [hideCreateBtn, setHideCreateBtn] = useState(false)

  const [addLineRules, setAddLineRules] = useState(false)
  const [addLineUsers, setAddLineUsers] = useState(true)

  //context
  const managerContext = useContext(ManagerContext);
  const managerId = managerContext.getUser();

  const handleClick = (event, targetId) => {
    event.preventDefault();
    if (targetId === "users") {
      setActiveElement(0);
      setHideCreateBtn(false)
    }
    else if(targetId === "create-user"){
      setActiveElement(1)
      setHideCreateBtn(true)
    }
    else if(targetId === "create-role"){
      setHideCreateBtn(true)
      setActiveElement(2)
    }
  };

  const getRoles = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    const reqBody = {
      managerId: managerId
    }
    axios.post(`${process.env.REACT_APP_URL}/getRoles`, reqBody, config).then((response) => {
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
      manager: managerId,
      job: "user"
    }
    axios.post(`${process.env.REACT_APP_URL}/addUser`, newUser)
      .then(() => {
        setUserAdded(true);
        setFullName('');
        setUsername('');
        setPassword('');
        setActiveElement(0)
        setHideCreateBtn(false)
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

  const childElements = [
    <div id="users" className={styles.users}>
      <AllUsers managerId={managerId} added={userAdded}></AllUsers>
    </div>,

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
            <option value="" disabled>בחר תפקיד</option> {/* Displayed as a placeholder */}
            {roles.map(role => { return <option value={role._id} key={role._id}>{role.name}</option> })}
          </select>
          <label className={styles.label_role}>תפקיד</label>
        </div>

        <button className={styles.btn} onClick={() => setUserAdded(false)} type="submit">אישור</button>

      </form>
    </div>,

    <div id="create-role" className={styles.createRole}>
      <AddRole managerId={managerId} roleAdded={getRoles}></AddRole>
    </div>
  ]

  useEffect(() => {
    getRoles();
  }, []);

  const NavigationBar = () => {
    return (
      <div className={styles.nav_container}>
        <ul className={styles.navbar}>
          <div className={styles.btnHome_div}>
            <li>
              <button onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
            </li>
          </div>

          <div className={styles.a_div}>
            <li>
              <a
                href="#create-role"
                className={`${styles.a} ${addLineRules && styles.addLine}`}
                onClick={(e) => {handleClick(e, 'create-role'); setAddLineRules(true); setAddLineUsers(false)}}>
                תפקידים
              </a>
            </li>
            <li>
              <a
                href="#users"
                className={`${styles.a} ${addLineUsers && styles.addLine}`}
                onClick={(e) => {handleClick(e, 'users'); setAddLineRules(false); setAddLineUsers(true)}}>
                עובדים
              </a>
            </li>
          </div>
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
      
      {!hideCreateBtn ? <img src='addUser.png' onClick={(e) => handleClick(e, 'create-user')} className={styles.addUser_btn}></img> : null}
      
    </div>
  );
}

export default UserManagement