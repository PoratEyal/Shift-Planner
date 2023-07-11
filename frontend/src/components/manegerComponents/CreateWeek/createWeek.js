import React, { useEffect, useState } from 'react';
import Day from './CreateWeekDay';
import axios from 'axios';
import styles from '../CreateWeek/createWeek.module.css'
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CreateWeek = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);
    const [weekVisivble, setWeekVisivble] = useState(null);
    const [weekPublished, setWeekPublished] = useState(null)

    const getDays = () => {
        axios.get(`${process.env.REACT_APP_URL}/getNextWeek`).then((response) => {
            setWeek(response.data);
            setWeekVisivble(response.data.visible);
            setWeekPublished(response.data.publishScheduling)
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getDays()
    }, []);

    const editWeek = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_URL}/setNextWeekVisible`)
            .then((response) => {
                console.log(response.data)
                setWeekVisivble(true)
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    const editPublishSchedule = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_URL}/setNextWeekPublished`)
            .then((response) => {
                setWeekPublished(true)
                console.log(response.data)
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    const publishWeek = () => {
        Swal.fire({
            title: 'האם אתה בטוח שברצונך לפרסם את המשמרות לשבוע הבא',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText : 'ביטול',
            confirmButtonColor: '#2977bc',
            cancelButtonColor: '#d33',
            confirmButtonText: 'פרסם'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: 'המשמרות פורסמו',
                icon: 'success',
                confirmButtonColor: '#2977bc',
                confirmButtonText: 'אישור'
            })
              editWeek()
              console.log(week)
            }
          })
    }

    const publishSchedule= () => {
        Swal.fire({
            title: 'האם אתה בטוח שברצונך לפרסם את השיבוצים לשבוע הבא',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText : 'ביטול',
            confirmButtonColor: '#2977bc',
            cancelButtonColor: '#d33',
            confirmButtonText: 'פרסם'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: 'השיבוצים פורסמו',
                icon: 'success',
                confirmButtonColor: '#2977bc',
                confirmButtonText: 'אישור'
            })
              editPublishSchedule()
              console.log(week)
            }
          })
    }

    return <React.Fragment>
        <div className={styles.container}>
            <div className={styles.nav_container}>
                <button className={styles.home_btn} onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
                <p>יצירת משמרות לשבוע הבא</p>
            </div>

            {!weekVisivble ? <div className={styles.publish_div}>
                <button onClick={publishWeek} className={styles.addShift_btn}>פרסם משמרות</button>
            </div> : 
            !weekPublished ? <div className={styles.publish_div}>
                <button onClick={publishSchedule} className={styles.addShift_btn}>פרסם שבוע סופי</button>
            </div>
            : 
            <div className={styles.published_div}>
                <button visible='false'>השבוע פורסם</button>
            </div>}

            {!weekPublished ? <div>
                {
                    week ? week.day.map((day) => {
                        return <Day day={day} key={day._id} getDays={getDays}></Day>
                    }) : null
                }
            </div> : null}

        </div>
    </React.Fragment>
}

export default CreateWeek