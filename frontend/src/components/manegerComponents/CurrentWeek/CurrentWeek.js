import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DayCurrentWeek from './DayCurrentWeek'
import styles from '../CreateWeek/createWeek.module.css'
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CurrentWeek = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);
    const [weekPublished, setWeekPublished] = useState(null)

    const getDays = () => {
        axios.get(`${process.env.REACT_APP_URL}/getNextWeek`).then((response) => {
            setWeek(response.data);
            setWeekPublished(response.data.publishScheduling)
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getDays();
    }, [weekPublished]);

    const publishSchedule= () => {
        Swal.fire({
            title: 'האם ברצונך לפרסם את השיבוצים לשבוע הבא',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText : 'ביטול',
            confirmButtonColor: '#2977bc',
            cancelButtonColor: '#d33',
            confirmButtonText: 'פרסום'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: 'השיבוצים פורסמו',
                icon: 'success',
                confirmButtonColor: '#2977bc',
                confirmButtonText: 'סגירה'
            })
              editPublishSchedule()
              console.log(week)
            }
          })
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

    return <React.Fragment>
        <div>
            <div className={styles.nav_container}>
                <button className={styles.home_btn} onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
                <p>שיבוץ עובדים לשבוע הבא</p>
            </div>
            

            {
                !weekPublished ? <div className={styles.publish_div}>
                <button onClick={publishSchedule} className={styles.addShift_btn}>פרסם שבוע סופי</button>
            </div>
            : <div className={styles.messege}>
                <p>השבוע פורסם</p>   
            </div>}

            <div style={{ marginTop: '70px' }} className={styles.container}>
                {
                    week ? week.day.map((day) => {
                        return <DayCurrentWeek  day={day} key={day._id} getDays={getDays}></DayCurrentWeek>
                    }) : null
                }
            </div>
        </div>
    </React.Fragment>
}

export default CurrentWeek;