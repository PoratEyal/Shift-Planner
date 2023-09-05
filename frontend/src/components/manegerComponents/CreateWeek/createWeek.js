import React, { useEffect, useState } from 'react';
import Day from './CreateWeekDay';
import axios from 'axios';
import styles from '../CreateWeek/createWeek.module.css'
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ManagerContext } from '../ManagerHomePage' 
import { useContext } from 'react';
import { FcAdvertising } from "react-icons/fc";
import { FcApproval } from "react-icons/fc";

const CreateWeek = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);
    const [weekVisivble, setWeekVisivble] = useState(null);
    const [weekPublished, setWeekPublished] = useState(null)

    const managerContext = useContext(ManagerContext);
    const managerId = managerContext.getUser();
    

    // get all the days in the week (from the specific manager)
    const getDays = () => {
        const managerId = managerContext.getUser();
        const reqBody = {
            id: managerId
        }
        axios.post(`${process.env.REACT_APP_URL}/getNextWeek`, reqBody)
        .then((response) => {
            setWeek(response.data);
            setWeekVisivble(response.data.visible);
            setWeekPublished(response.data.publishScheduling)
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getDays();
    }, []);

    // set next week to visible
    const editWeek = async () => {
        const managerId = managerContext.getUser();
        const reqBody = {
            id: managerId
        }
            await axios.put(`${process.env.REACT_APP_URL}/setNextWeekVisible`, reqBody)
            .then((response) => {
                setWeekVisivble(true)
            }).catch ((error) => {
            console.log(error.message);
        });
    }

    // show alert, if the manager select "yes" - week becomes visible
    const publishWeek = () => {
        Swal.fire({
            title: 'האם ברצונך לפרסם את המשמרות לשבוע הבא',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText : 'ביטול',
            confirmButtonColor: '#34a0ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'פרסום'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: 'המשמרות פורסמו',
                icon: 'success',
                confirmButtonColor: '#2977bc',
                confirmButtonText: 'סגירה'
            })
              editWeek()
            }
          })
    }

    return <React.Fragment>
        <div className={styles.container}>
            <div className={styles.nav_container}>
                <button className={styles.home_btn} onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
                <p>יצירת משמרות לשבוע הבא</p>
            </div>

            {weekVisivble === false ?
            <div className={styles.publish_div_createWeek}>
                <button onClick={publishWeek}>
                    <FcAdvertising className={styles.icon_publish}></FcAdvertising>
                    <label>פרסום משמרות</label>
                </button>
            </div> : null}

            {weekVisivble === true ?
            <div className={styles.published_div}>
                <button visible='false'>
                    <FcApproval className={styles.icon_publishd}></FcApproval>
                    <label>המשמרות פורסמו</label>
                </button>
            </div> : null}

            <div style={{marginTop: '65px'}}>
                {
                    week ? week.day.map((day) => {
                        return <Day day={day} key={day._id} getDays={getDays} managerId={managerId}></Day>
                    }) : null
                }
            </div>
        </div>
    </React.Fragment>
}



export default CreateWeek