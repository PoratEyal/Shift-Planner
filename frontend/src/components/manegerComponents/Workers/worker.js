import React, { useEffect, useState, useRef } from 'react';
import styles from './workers.module.css';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";
import { BiEditAlt } from "react-icons/bi";
import Swal from 'sweetalert2';
import { Navigate } from 'react-router-dom';
import editWorker from './editWorker'

const Worker = (props) => {

    const [isDivVisible, setDivVisible] = useState(false);
    const [openOptions, setOpenOptions] = useState(null);
    const [userDeleted, setUserDelted] = useState(false)
    const [clickEditWorker, setEditWorker] = useState(false);
    const divRef = useRef(null);

    const [showEditWorker, setShowEditWorker] = useState(false);

    const user = props.user;
    
    let fullName = useRef(user.fullName);
    let username = useRef(user.username);
    let password = useRef("");
    const [selectedRole, setRole] = useState(user.role ? user.role._id : 0);

    const options = (shiftId) => {
        setOpenOptions(shiftId);
        setDivVisible(true);
    }

    const deleteUser = async (userId) => {
        Swal.fire({
            title: 'האם ברצונך למחוק את המשתמש',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ביטול',
            confirmButtonColor: '#34a0ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'אישור'
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: 'המשתמש נמחק',
                    icon: 'success',
                    confirmButtonColor: '#34a0ff',
                    confirmButtonText: 'סגירה'
                });
                try {
                    await axios.delete(`${process.env.REACT_APP_URL}/deleteUser/${userId}`)
                        .then(response => {
                            setUserDelted(true)
                        })
                        .catch(error => {
                            console.log(error.response.data.error);
                        });
                } catch (error) {
                    console.log(error.message);
                }
            }
        });
    }

    const EditUser = async () => {
        const updatedUser = {
            _id: user._id,
            fullName: fullName.current.value,
            username: username.current.value,
            password: password.current.value,
            role: selectedRole,
            job: user.job,
          };
        await axios.put(`${process.env.REACT_APP_URL}/editUser`, updatedUser).then(() => {
            setEditWorker(!clickEditWorker)
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

    // control on the close and open the option select
    useEffect(() => {
        function handleOutsideClick(event) {
        if (divRef.current && !divRef.current.contains(event.target)) {
            setDivVisible(false);
        }
        }

        if (isDivVisible) {
        document.addEventListener('mousedown', handleOutsideClick);
        } else {
        document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
        document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isDivVisible])

    return <React.Fragment>
        <div key={user._id} className={styles.user_container}>
            <div>
                <div className={styles.delete_edit_div}>
                    <FiMoreHorizontal className={styles.icon} onClick={() => options(user._id)}></FiMoreHorizontal>

                    {openOptions === user._id && isDivVisible ?
                        <div ref={divRef} className={styles.edit_div_options}>
                            <div className={styles.edit_div_flex}>
                                <label onClick={() => { setEditWorker(!clickEditWorker); setDivVisible(false) }}>עריכת עובד</label>
                                <BiEditAlt onClick={() => { setEditWorker(!clickEditWorker); setDivVisible(false) }} className={styles.icon_edit_select}></BiEditAlt>
                            </div>

                            <div className={styles.edit_div_flex}>
                                <label onClick={() => { deleteUser(user._id); setDivVisible(false); setUserDelted(false); }}>מחיקת עובד</label>
                                <RiDeleteBin6Line className={styles.icon_edit_select} onClick={() => { deleteUser(user._id); setDivVisible(false); setUserDelted(false); }}></RiDeleteBin6Line>
                            </div>
                        </div> : null}
                </div>
            </div>
            <div>
                <p className={styles.p}>{user.fullName}</p>
            </div>
        </div>
        {
            clickEditWorker ? <div className={styles.editWorker}>
            <input className={styles.input_edit} defaultValue={user.fullName} type="text" placeholder="שם מלא" ref={fullName}/>
            <input className={styles.input_edit} defaultValue={user.username} type="text" placeholder='שם משתמש' ref={username}/>
            <input className={styles.input_edit}  type="password" placeholder='סיסמא' ref={password}/>

            <select value={selectedRole} className={styles.select} onChange={(e) => { setRole(e.target.value)}} >
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
                    onClick={() => {setEditWorker(!clickEditWorker)
                    }}
                >ביטול
                </button>
                {/* <button onClick={() => setShowEditWorker(true)}>מה אומר</button>
                
                {showEditWorker && (
                    <editWorker>user={user} roles={props.roles} key={user._id}</editWorker>
                )} */}
            </div>
        </div> : null
        }
    </React.Fragment>
}
export default Worker