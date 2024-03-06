import React, { useEffect, useState, useRef } from 'react';
import styles from './workers.module.css';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";
import { FiMoreHorizontal } from "react-icons/fi";
import { BiEditAlt } from "react-icons/bi";
import Swal from 'sweetalert2';
import PopUpEditWorker from '../../popups/editWorker/popUpEditWorker'

const Worker = (props) => {

    const [isDivVisible, setDivVisible] = useState(false);
    const [openOptions, setOpenOptions] = useState(null);
    const [userDeleted, setUserDelted] = useState(false)
    const divRef = useRef(null);

    const user = props.user;
    
    const [isBackdropVisible, setIsBackdropVisible] = useState(false);
    const [clickAddShift, setClickAddShift] = useState(false);

    const toggleBackdrop = () => {
        setIsBackdropVisible(!isBackdropVisible);
    };  

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

    return <div className={styles.first_container}>
        <div key={user._id} className={styles.user_container}>
            <div>
                <div className={styles.delete_edit_div}>
                    <FiMoreHorizontal className={styles.icon} onClick={() => options(user._id)}></FiMoreHorizontal>

                    {openOptions === user._id && isDivVisible ?
                        <div ref={divRef} className={styles.edit_div_options}>
                            <div className={styles.edit_div_flex}>
                                <label onClick={() => { setClickAddShift(true); setDivVisible(false) }}>עריכת עובד</label>
                                <BiEditAlt onClick={() => { setClickAddShift(true); setDivVisible(false) }} className={styles.icon_edit_select}></BiEditAlt>
                            </div>

                            <div className={styles.edit_div_flex}>
                                <label onClick={() => { deleteUser(user._id); setDivVisible(false); setUserDelted(false); }}>מחיקת עובד</label>
                                <RiDeleteBin6Line className={styles.icon_edit_select} onClick={() => { deleteUser(user._id); setDivVisible(false); setUserDelted(false); }}></RiDeleteBin6Line>
                            </div>
                        </div> : null}
                </div>
            </div>
            <div>
                <p className={styles.p}>
                    <label>{user.fullName}</label>
                    <label className={styles.role}>- {user.role ? user.role.name : "ללא תפקיד" }</label>
                </p>
            </div>
        </div>

        {clickAddShift &&
            <React.Fragment>
                <div className={`${styles.backdrop} ${isBackdropVisible ? styles.visible : ''}`} onClick={() => {setClickAddShift(false); toggleBackdrop();}}></div>
                <PopUpEditWorker
                    onClose={() => {setClickAddShift(false); toggleBackdrop();}}
                    roles={props.roles}
                    user={user}
                ></PopUpEditWorker>
            </React.Fragment>
        }

    </div>
}
export default Worker