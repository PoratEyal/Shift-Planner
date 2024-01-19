import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Roles from './Roles';
import styles from '../publics/register.module.css';
import { BiSolidShow, BiSolidHide } from "react-icons/bi";
import Swal from 'sweetalert2';


const Register = () => {
  const [username, setUsername] = useState("");
  const [usernameVal, setUsernameVal] = useState(false)

  const [password, setPassword] = useState("");
  const [passwordVal, setPasswordVal] = useState(false)

  const [fullname, setFullname] = useState("");
  const [fullnameVal, setFullnameVal] = useState(false)

  const [email, setEmail] = useState("");
  const [emailVal, setEmailVal] = useState(false)

  const [show, setShow] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    let isAuth = localStorage.getItem("isAuth");
    if (isAuth && isAuth !== null) {
      const user = JSON.parse(localStorage.getItem("user"));
      Roles.checkUserRole(user.job) ? navigate('/managerHomePage') : navigate('/CurrentWeek');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.length < 2) {
      setUsernameVal(true)
      setUsername("");
    }
    if (password.length < 5) {
      setPasswordVal(true)
      setPassword("");
    }
    if (fullname.length === 0) {
      setFullnameVal(true)    
      setFullname("");
    }
    if (email.length < 6) {
      setEmailVal(true)
      setEmail("");
    }
    if(username.length > 2 && password.length >= 5 && fullname.length > 0 && email.length > 6){
      const userRegister = {
        fullName: fullname,
        username: username,
        password: password,
        role: '64a7d10d0606ff97cf2796dd',
        email: email,
        job: 'admin'
      }
      console.log(userRegister)

      axios.post(`${process.env.REACT_APP_URL}/addManager`, userRegister)
          .then(() => {
            navigate('/')
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              title: 'שם משתמש תפוס, הכנס שם משתמש אחר',
              text: "",
              icon: 'warning',
              confirmButtonColor: '#34a0ff',
              confirmButtonText: 'אישור'
            })
          });
    }
  };

  return <div className={styles.page_container}>
        


      <div className={styles.container}>
        <div className={styles.register_label_container}>
          <label className={styles.register_label}>
            הרשמו בחינם ובנו סידור עבודה בצורה פשוטה ומהירה לעסק שלכם 
          </label>
        </div>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.logo}></div>

          <div className={styles.input_label_div}>
            <input type="text" placeholder='שם מלא' autoComplete="fullname" className={styles.input} onChange={(e) => { setFullname(e.target.value) }} />
            {fullnameVal ? <label className={styles.validation_fullname}>שם מלא צריך לכלול לפחות תו אחד</label> : null}
          </div>

          <div className={styles.input_label_div}>
            <input type="email" placeholder='אימייל' autoComplete="email" className={styles.input} onChange={(e) => { setEmail(e.target.value) }} />
            {emailVal ? <label className={styles.validation_email}>כתובת האימייל שהוזנה אינה תקינה</label> : null}
          </div>

          <div className={styles.input_label_div}>
            <input type="text" placeholder='שם משתמש' autoComplete="username" className={styles.input} onChange={(e) => { setUsername(e.target.value) }} />
            {usernameVal ? <label className={styles.validation_username}>שם המשתמש חייב להיות באנגלית</label> : null}
          </div>

          <div className={styles.input_label_div}>
            <div className={styles.password_div}>
              <div className={styles.input_container}>
                <input id='password' autoComplete="current-password" type={show ? "password" : "text"} placeholder='סיסמה' className={styles.input} onChange={(e) => { setPassword(e.target.value) }} />
                {password.length > 0 ? (
                  show ? (
                    <BiSolidShow
                      className={styles.show_password}
                      onClick={(e) => setShow(!show)}
                    ></BiSolidShow>
                  ) : (
                    <BiSolidHide
                      className={styles.show_password}
                      onClick={(e) => setShow(!show)}
                    ></BiSolidHide>
                  )
                ) : null}
              </div>
            </div>
            {passwordVal ? <label className={styles.validation_password}>סיסמה חייבת להכיל לפחות 5 תווים</label> : null}
          </div>

          <button className={styles.btn} type="submit">לחצו להרשמה</button>

          <div className={styles.login_container}>
            <label>להתחברות</label>
            <label onClick={() => navigate('/')} className={styles.login_label}>לחצו כאן</label>
          </div>
        </form>
      </div>

    </div>
};

export default Register;
