import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from './settingsPage.module.css';
import PageLayout from './/..//..//layout/PageLayout';
import moment from "moment";
import { useNavigate } from 'react-router-dom';
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import CreateShift from "./CreateShift";
import DefaultShift from "./DefaultShift";
import Swal from 'sweetalert2';

const SettingsPage = (props) => {

    const navigate = useNavigate();

    const [defShifts, setDefShifts] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        axios.post(`${process.env.REACT_APP_URL}/getDefShifts`, {
            managerId: user._id
        }).then((response) => {
            setDefShifts(response.data);
            setLoading(true);
        })
    }, []);

    const deleteHandler = (shiftId) => {
        Swal.fire({
            title: 'האם ברצונך למחוק את המשמרת',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ביטול',
            confirmButtonColor: '#34a0ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'אישור'
          }).then(async (result) => {
            if (result.isConfirmed) {
                console.log(shiftId);
                const user = JSON.parse(localStorage.getItem('user'));
                const reqBody = {
                    managerId: user._id,
                    shiftId: shiftId
                }
                const response = await axios.put(`${process.env.REACT_APP_URL}/deleteShift`, reqBody);
                if(response){
                    setDefShifts(response.data)
                }
              Swal.fire({
                title: 'המשמרת נמחקה',
                icon: 'success',
                confirmButtonColor: '#34a0ff',
                confirmButtonText: 'סגירה'
            });
            }
        });
    }

    return <PageLayout text='הגדרת משמרות'>
        <div className={styles.container}>
            {!loading ? (
            <div className={styles['three-body']}>
                <div className={styles['three-body__dot']}></div>
                <div className={styles['three-body__dot']}></div>
                <div className={styles['three-body__dot']}></div>
            </div>
            ) : (
            <>
                <h2 className={styles.title}>המשמרות שלי</h2>
                {defShifts
                ? defShifts.map((shift) => {
                    return (
                        <DefaultShift
                        shift={shift}
                        delete={deleteHandler}
                        key={shift._id}
                        ></DefaultShift>
                    );
                    })
                : null}
            </>
            )}
        </div>

        <img
            onClick={() => navigate('/createShift')}
            src='addRole.png'
            className={styles.addShift_btn}
            alt='Add Shift'
        ></img>
        
    </PageLayout>
}

export default SettingsPage