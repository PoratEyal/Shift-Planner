import { useEffect, useRef, useState } from "react";
import moment from "moment";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import styles from './settingsPage.module.css';

const DefaultShift = (props) => {
    const [shift, setShift] = useState(props.shift);
    const [clickAddShift, setClickAddShift] = useState(false);
    let name = useRef();
    let startTime = useRef();
    let endTime = useRef();


    useEffect(() => {
        setShift(props.shift)
    }, [])

    const saveHandler = () => {
        console.log(name.current.value);
        console.log(startTime.current.value);
        console.log(endTime.current.value);

    }
    return <div className={styles.shifts}>
        <label className={styles.label}>
            {moment(shift.endTime).utc().format('HH:mm')} - {moment(shift.startTime).utc().format('HH:mm')} : {shift.description}
        </label>
        <div className={styles.icons_div}>
            <button className={styles.delete_btn} onClick={() => {
            }}><RiDeleteBin6Line></RiDeleteBin6Line></button>
            <button className={styles.edit_icon} onClick={() => {
                setClickAddShift(!clickAddShift)
            }}><BiEditAlt></BiEditAlt></button>
        </div>
        {clickAddShift && (
            <div className={styles.addShift}>
                <input defaultValue={shift.description} type="text" placeholder="שם משמרת" ref={name} />
                <label>
                    שעת התחלה
                    <input defaultValue={moment(shift.startTime).utc().format('HH:mm')} type="time" ref={startTime} />
                </label>
                <label>
                    שעת סיום
                    <input defaultValue={moment(shift.endTime).utc().format('HH:mm')} type="time" ref={endTime} />
                </label>
                <br></br>
                <button
                    onClick={() => {
                        saveHandler()
                        setClickAddShift(!clickAddShift)
                    }}
                >שמור
                </button>
            </div>
        )}
    </div>
}
export default DefaultShift