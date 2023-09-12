import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from './settingsPage.module.css';
import PageLayout from './/..//..//layout/PageLayout';
import moment from "moment";
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";

const SettingsPage = (props) => {

    const navigate = useNavigate();

    const [defShifts, setDefShifts] = useState(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        axios.post(`${process.env.REACT_APP_URL}/getDefShifts`, {
            managerId: user._id
        }).then((response) => {
            setDefShifts(response.data);
        })
    }, []);

    return <PageLayout text='הגדרות'>
        <div className={styles.container}>
            <h2 className={styles.title}>המשמרות שלי</h2>
            {defShifts ? 
                defShifts.map((shift) => {
                    return <div key={shift._id}>
                        <div className={styles.shifts}>
                            <button className={styles.delete_btn}><RiDeleteBin6Line></RiDeleteBin6Line></button>
                            <label className={styles.label}>
                                {moment(shift.endTime).format('HH:mm')} - {moment(shift.startTime).format('HH:mm')} : {shift.description}
                            </label>
                            
                        </div>
                    </div>
                })
            : null}
        </div>

        <img onClick={() => navigate('/createShift')} src='addRole.png' className={styles.addShift_btn}></img> 
    </PageLayout>
}

export default SettingsPage