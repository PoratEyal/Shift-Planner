import React,{ useEffect, useRef, useState } from "react";
import moment from "moment";
import styles from './settingsPage.module.css';
import axios from "axios";
import Swal from 'sweetalert2';
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";

const DefaultShift = (props) => {

    const [shift, setShift] = useState(props.shift);
    const [clickAddShift, setClickAddShift] = useState(false);

    const [openOptions, setOpenOptions] = useState(null);
    const [isDivVisible, setDivVisible] = useState(false);
    const divRef = useRef(null);

    let name = useRef();
    let startTime = useRef();
    let endTime = useRef();

    const saveHandler = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const reqBody={
            managerId: user._id,
            shiftId: shift._id,
            name: name.current.value,
            startTime: startTime.current.value,
            endTime: endTime.current.value
        }
        const response = await axios.put(`${process.env.REACT_APP_URL}/changeShift`, reqBody);
        if(response.data){
            setShift(response.data)
            Swal.fire({
                title: 'המשמרת עודכנה',
                icon: 'success',
                confirmButtonColor: '#34a0ff',
                confirmButtonText: 'סגירה'
            });
        }
    }

    // control on the close and open the option select
    useEffect(() => {
        setShift(props.shift)

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
    }, [isDivVisible ])

    // when click on the ... icon - set those two states
    const options = (shiftId) => {
        setOpenOptions(shiftId);
        setDivVisible(true);
    }

    return <React.Fragment>
        <div className={styles.shift_container}>
            <div className={styles.description}>
                {moment(shift.endTime).utc().format('HH:mm')} - {moment(shift.startTime).utc().format('HH:mm')} : {shift.description}
            </div>

            <div className={styles.delete_edit_div}>
                <FiMoreHorizontal onClick={() => options(shift._id)}></FiMoreHorizontal>

                {openOptions === shift._id && isDivVisible ? 
                    <div ref={divRef} className={styles.edit_div_options}>
                        <div className={styles.edit_div_flex}>
                            <label onClick={() => { setClickAddShift(!clickAddShift); setDivVisible(false) }}>עדכון משמרת</label>
                            <BiEditAlt className={styles.icon_edit_select} onClick={() => { setClickAddShift(!clickAddShift); setDivVisible(false) }}></BiEditAlt>
                        </div>

                        <div className={styles.edit_div_flex}>
                          <label onClick={() => { props.delete(shift._id); setDivVisible(false) }}>מחיקת משמרת</label>
                          <RiDeleteBin6Line className={styles.icon_edit_select} onClick={() => { props.delete(shift._id); setDivVisible(false) }}></RiDeleteBin6Line>
                        </div>
                </div> : null}
            </div>
        </div>

        {clickAddShift && (
            <div className={styles.editShift}>
                <input className={styles.input_edit} defaultValue={shift.description} type="text" placeholder="שם משמרת" ref={name} />
                <input className={styles.input_time_start} defaultValue={moment(shift.startTime).utc().format('HH:mm')} type="time" ref={startTime} />
                <input className={styles.input_time_end} defaultValue={moment(shift.endTime).utc().format('HH:mm')} type="time" ref={endTime} />
                <div className={styles.btn_div}>
                    <button
                        className={styles.edit_shift_btn}
                        onClick={() => {
                            saveHandler()
                            setClickAddShift(!clickAddShift)
                        }}
                    >אישור
                    </button>
                    <button
                        className={styles.edit_shift_btn_cancel}
                        onClick={() => {
                            setClickAddShift(!clickAddShift)
                        }}
                    >ביטול
                    </button>
                </div>
            </div>
        )}
    </React.Fragment>
}
export default DefaultShift