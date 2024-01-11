import React, { useState, useRef } from 'react';
import styles from './workers.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';

const EditWorker = (props) => {
    const [selectedRole, setRole] = useState("");  // Added missing state for selectedRole
    const [user, setUser] = useState(props.user);  // Added state for user

    // Refs for input fields
    const fullName = useRef(null);
    const username = useRef(null);
    const password = useRef(null);

    const EditUser = async () => {
        const updatedUser = {
            _id: user._id,
            fullName: fullName.current.value,
            username: username.current.value,
            password: password.current.value,
            role: selectedRole,
            job: user.job,
        };

        try {
            await axios.put(`${process.env.REACT_APP_URL}/editUser`, updatedUser);
            setRole("");  // Reset selectedRole after successful edit
            setUser({ ...user, fullName: updatedUser.fullName, username: updatedUser.username });  // Update user state
            Swal.fire({
                title: 'העובד עודכן בהצלחה',
                icon: 'success',
                confirmButtonColor: '#34a0ff',
                confirmButtonText: 'סגירה'
            });
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className={styles.edit_worker_container}>
            <div className={styles.editWorker}>
                <input className={styles.input_edit} defaultValue={user.fullName} type="text" placeholder="שם מלא" ref={fullName} />
                <input className={styles.input_edit} defaultValue={user.username} type="text" placeholder='שם משתמש' ref={username} />
                <input className={styles.input_edit} type="password" placeholder='סיסמא' ref={password} />

                <select value={selectedRole} className={styles.select} onChange={(e) => { setRole(e.target.value) }} >
                    <option value="" disabled>תפקיד</option>
                    {props.roles.map(role => { return <option value={role._id} key={role._id}>{role.name}</option> })}
                    <option value={0}>ללא תפקיד</option>
                </select>

                <div className={styles.btn_div}>
                    <button
                        className={styles.edit_worker_btn}
                        onClick={() => {
                            EditUser();
                        }}
                    >אישור
                    </button>
                    <button
                        className={styles.edit_worker_btn_cancel}
                        onClick={() => {
                            // Optionally reset the input fields on cancel
                            fullName.current.value = user.fullName;
                            username.current.value = user.username;
                            password.current.value = '';
                            setRole("");
                        }}
                    >ביטול
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditWorker;
