import { useEffect, useState } from "react";
import axios from "axios";
import styles from './shiftPage.module.css';
import PageLayout from './/..//..//layout/PageLayout';
import { useNavigate } from 'react-router-dom';
import DefaultShift from "./DefaultShift";
import Swal from 'sweetalert2';
import LoadingAnimation from '../../loadingAnimation/loadingAnimation';
import PopUpAddShift from '../../popups/addShift/addShift'

const SettingsPage = (props) => {

    const navigate = useNavigate();

    const [defShifts, setDefShifts] = useState(null);
    const [noShifts, setNoShifts] = useState(false);
    const [loading, setLoading] = useState(false);
    const [limitShifts, setLimitShifts] = useState(false);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        axios.post(`${process.env.REACT_APP_URL}/getDefShifts`, {
            managerId: user._id
        }).then((response) => {
            if (Array.isArray(response.data) && response.data.length === 0) {
                setNoShifts(true);
            } else {
                setDefShifts(response.data);
                if (response.data.length >= 6) {
                    setLimitShifts(true)
                }
            }
            setLoading(true);
        });
    }, [noShifts, defShifts]);    

    const deleteHandler = (shiftId) => {
        Swal.fire({
            title: 'האם למחוק את המשמרת',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ביטול',
            confirmButtonColor: '#34a0ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'אישור'
          }).then(async (result) => {
            if (result.isConfirmed) {
                const user = JSON.parse(localStorage.getItem('user'));
                const reqBody = {
                    managerId: user._id,
                    shiftId: shiftId
                }
                const response = await axios.put(`${process.env.REACT_APP_URL}/deleteShift`, reqBody);
                if(response){
                    setDefShifts(response.data)
                    setLimitShifts(false)
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

    const createShiftHandler = () => {
        if(!limitShifts){
            navigate('/createShift')
        }
        else {
            Swal.fire({
                title: 'ניתן להוסיף עד - 6 משמרות',
                icon: 'info',
                confirmButtonColor: '#34a0ff',
                confirmButtonText: 'סגירה'
            });
        }

    }

    return <PageLayout text='משמרות'>
        <div className={styles.container}>
            {!loading ? 
                <LoadingAnimation></LoadingAnimation>
            : 
            ( noShifts ? (
                <div className={styles.noShifts_div}>לא קיימות משמרות</div>
            ) : (
            <>
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
            ))}
        </div>

        <img
            onClick={createShiftHandler}
            src='addRole.png'
            className={styles.addShift_btn}
            alt='Add Shift'
        ></img>
        
    </PageLayout>
}

export default SettingsPage