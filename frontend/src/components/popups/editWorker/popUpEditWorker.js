import React, { useState, useRef } from 'react';
import styles from '../updateShift/popUpUpdateShift.module.css';
import axios from "axios";
import Swal from 'sweetalert2';
import { AiOutlineClose } from "react-icons/ai";

const PopUpEditWorker = (props) => {

    const user = props.user;

    let fullName = useRef(user.fullName);
    let email = useRef(user.email);
    let password = useRef("");
    const [selectedRole, setRole] = useState(user.role ? user.role._id : 0);

    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) {
        return null; // If isOpen is false, don't render anything
    }

    const EditUser = async () => {
        const updatedUser = {
            _id: user._id,
            fullName: fullName.current.value,
            email: email.current.value,
            password: password.current.value,
            role: selectedRole,
            job: user.job,
        };
        console.log(updatedUser);
        await axios.put(`${process.env.REACT_APP_URL}/editUser`, updatedUser).then(() => {
            props.onClose();
            Swal.fire({
                title: 'העובד עודכן בהצלחה',
                icon: 'success',
                confirmButtonColor: '#34a0ff',
                confirmButtonText: 'סגירה'
            });
        }).catch((err) => {
            console.log(err);
        })
    }

    return <div className={styles.editShift}>

            <AiOutlineClose className={styles.close_icon} onClick={() => props.onClose()}></AiOutlineClose>

            <form onSubmit={EditUser}>
                <div className={styles.input_div}>
                    <label>שם מלא</label>
                    <input
                    className={styles.input_edit}
                    defaultValue={user.fullName}
                    ref={fullName}
                    type="text"
                    required
                    />
                </div>
                
                <div className={styles.input_div}>
                    <label>אימייל</label>
                    <input
                        className={styles.input_time_start}
                        type="email"
                        defaultValue={user.email}
                        ref={email}
                        required
                        autoComplete="email"
                    />
                </div>

                <div className={styles.input_div}>
                    <label>סיסמה בעלת 5 תווים לפחות</label>
                    <input
                        className={styles.input_time_end}
                        type="password"
                        ref={password}
                        required
                        minLength={5}
                    />
                </div>

                <div className={styles.input_div}>
                    <label>בחירת תפקיד (לא חובה)</label>
                    <select className={styles.select_workers_role} value={selectedRole} onChange={(e) => { setRole(e.target.value) }} >
                        <option value="" disabled>תפקיד</option>
                        {props.roles.map(role => { return <option value={role._id} key={role._id}>{role.name}</option> })}
                        <option value={0}>ללא תפקיד</option>
                    </select>
                </div>

                <div className={styles.btn_div}>
                    <button className={styles.edit_shift_btn} type="submit">
                        לחצו לעדכון עובד
                    </button>
                </div>

            </form>
        </div>
};

export default PopUpEditWorker;
