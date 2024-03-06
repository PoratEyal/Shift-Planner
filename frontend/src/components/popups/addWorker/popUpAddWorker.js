import React, { useEffect, useState } from "react";
import styles from '../updateShift/popUpUpdateShift.module.css';
import axios from "axios";
import Swal from 'sweetalert2';
import { AiOutlineClose } from "react-icons/ai";
import { ManagerContext } from '../../manegerComponents/ManagerHomePage'; 
import { useContext } from 'react';

const PopUpAddWorker = (props) => {

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [selectedRole, setRole] = useState("");

    const [isOpen, setIsOpen] = useState(true);

    const managerContext = useContext(ManagerContext);
    const managerId = managerContext.getUser();

    const handleClose = () => {
        props.onClose(); // Set isOpen to false to close the component
    }

    if (!isOpen) {
        return null; // If isOpen is false, don't render anything
    }

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
          props.onClose();
        })
        .catch((error) => {
          console.log(error);
          Swal.fire({
            title: 'כתובת האימייל תפוסה, הכנס כתובת אימייל אחר',
            text: "",
            icon: 'warning',
            confirmButtonColor: '#34a0ff',
            confirmButtonText: 'אישור'
          })
        });
    };

    return <div className={styles.editShift}>

            <AiOutlineClose className={styles.close_icon} onClick={() => props.onClose()}></AiOutlineClose>

            <form onSubmit={handleSubmit}>
                <div className={styles.input_div}>
                    <label>שם מלא</label>
                    <input
                    className={styles.input_edit}
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    />
                </div>
                
                <div className={styles.input_div}>
                    <label>אימייל</label>
                    <input
                        className={styles.input_time_start}
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />
                </div>

                <div className={styles.input_div}>
                    <label>סיסמה בעלת 5 תווים לפחות</label>
                    <input
                        className={styles.input_time_end}
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={5}
                        autoComplete="new-password"
                    />
                </div>

                <div className={styles.input_div}>
                    <label>(לא חובה) בחירת תפקיד</label>
                    <select className={styles.select_workers_role} value={selectedRole} onChange={(e) => { setRole(e.target.value) }} >
                        <option value="" disabled>תפקיד</option>
                        {props.roles.map(role => { return <option value={role._id} key={role._id}>{role.name}</option> })}
                        <option value={0}>ללא תפקיד</option>
                    </select>
                </div>

                <div className={styles.btn_div}>
                    <button className={styles.edit_shift_btn} type="submit">
                        לחצו להוספת עובד
                    </button>
                </div>

            </form>
        </div>
};

export default PopUpAddWorker;
