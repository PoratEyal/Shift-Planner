import styles from './createWorker.module.css'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ManagerContext } from '../ManagerHomePage' 
import { useContext } from 'react';
import Swal from 'sweetalert2';
import PageLayout from './/..//..//layout/PageLayout';
import Creatable from 'react-select/creatable';


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

    const selectStyles = {
      control: provided => ({
        ...provided,
        border: '2px solid rgba(122, 122, 122, 0.25)',
        borderRadius: '5px',
        direction: 'rtl',
        textAlign: 'right',
        fontFamily: 'Rubik, sans-serif',
        fontSize: '20px',
        padding: '0px',
        width: '275px',
        zIndex: '500',
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
      { value: '', label: 'בחירת תפקיד (לא חובה)' },
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

        if (!fullName || !username || !password || !managerId) {
            Swal.fire({
              title: 'יש למלא את כל השדות (תפקיד לא חובה)',
              text: "",
              icon: 'warning',
              confirmButtonColor: '#34a0ff',
              confirmButtonText: 'אישור'
            });
            return;
        }
        console.log(selectedRole)
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
            console.log(error);
            Swal.fire({
              title: 'שם משתמש תפוס, הכנס שם משתמש אחר',
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
              <input
                  className={styles.input}
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  placeholder='שם מלא'
              />

              <input
                  placeholder='שם משתמש (באנגלית)'
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
                  autoComplete="username"
              />

              <input
                  placeholder='סיסמה בעלת 5 תווים לפחות'
                  className={styles.input}
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={5}
                  autoComplete="current-password"
              />

              <Creatable
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

              <img className={styles.addUser_svg} src="addUser.svg" alt="Icon" />
                
            </form>
        </div>
    </PageLayout>
}

export default CreateWorker;