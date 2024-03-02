import styles from './createWorker.module.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ManagerContext } from '../ManagerHomePage'; 
import { useContext } from 'react';
import Swal from 'sweetalert2';
import PageLayout from '../../layout/PageLayout';
import Creatable from 'react-select/creatable';

const CreateWorker = () => {
    
    const navigate = useNavigate();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState(''); // Changed from username
    const [password, setPassword] = useState('');
    const [userAdded, setUserAdded] = useState(false);
    const [selectedRole, setRole] = useState("");
    const [roles, setRoles] = useState([]);

    // Context
    const managerContext = useContext(ManagerContext);
    const managerId = managerContext.getUser();

    const selectStyles = {
      control: provided => ({
        ...provided,
        border: 'none',
        borderRadius: '0px',
        direction: 'rtl',
        fontFamily: 'Rubik, sans-serif',
        fontSize: '20px',
        width: '265px',
        zIndex: '500',
        boxShadow: 'none'
      }),
      menu: provided => ({
        ...provided,
        direction: 'rtl',
        textAlign: 'right',
      }),
      input: provided => ({
        ...provided,
        readOnly: 'readonly',
      }),
    };
          
    const options = [
      { value: '', label: 'אנא בחרו תפקיד' },
      ...roles.map(role => ({ value: role._id, label: role.name })),
    ];
  
    const handleChange = (selectedOption) => {
      setRole(selectedOption.value);
    };

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

        if (!fullName || !email || !password || !managerId) {
            Swal.fire({
              title: 'יש למלא את כל השדות (תפקיד לא חובה)',
              text: "",
              icon: 'warning',
              confirmButtonColor: '#34a0ff',
              confirmButtonText: 'אישור'
            });
            return;
        }
        const newUser = {
          fullName: fullName,
          email: email, // Changed from username
          password: password,
          role: selectedRole,
          active: true,
          manager: managerId,
          job: "user"
        }
        axios.post(`${process.env.REACT_APP_URL}/addUser`, newUser)
          .then(() => {
            setUserAdded(true);
            setFullName('');
            setEmail('');
            setPassword('');
            navigate('/workers')
          })
          .catch((error) => {
            console.log(error);
            Swal.fire({
              title: 'כתובת האימייל תפוסה, הכנס כתובת אימייל אחרת',
              text: "",
              icon: 'warning',
              confirmButtonColor: '#34a0ff',
              confirmButtonText: 'אישור'
            })
          });
    };

    return <PageLayout text='יצירת עובד'>
        <div id="create-user" className={styles.createUser}>

            <form className={styles.userForm} onSubmit={handleSubmit}>
              <label className={styles.label}>שם מלא</label>
              <input
                  className={styles.input}
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
              />

              <label className={styles.label}>כתובת אימייל</label>
              <input
                  className={styles.input}
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
              />

              <label className={styles.label}>סיסמה בעלת 5 תווים לפחות</label>
              <input
                  className={styles.input}
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={5}
                  autoComplete="new-password"
              />

              <label className={styles.label}>(לא חובה) בחירת תפקיד</label>
              <Creatable
              className={styles.select}
                options={options}
                onChange={handleChange}
                defaultValue={options[0]}
                styles={selectStyles}
                isSearchable ={false}
              />
                
              <div className={styles.btns_div}>
                <button className={styles.btn} type="button" onClick={handleSubmit}>אישור</button>
                <button className={styles.btn_cancel} type="button" onClick={() => navigate('/workers')}>ביטול</button>
              </div>
                
            </form>
        </div>
    </PageLayout>
}

export default CreateWorker;
