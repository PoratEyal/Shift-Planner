import React, { useEffect, useState } from 'react';
import Day from './CreateWeekDay';
import axios from 'axios';
import styles from '../CreateWeek/createWeek.module.css'
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ManagerContext } from '../ManagerHomePage' 
import { useContext } from 'react';

const CreateWeek = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);
    const [weekVisivble, setWeekVisivble] = useState(null);
    const [weekPublished, setWeekPublished] = useState(null)

    const managerContext = useContext(ManagerContext);
    const managerId = managerContext.getUser();

    // get all the days in the week (from the specific manager)
    const getDays = () => {
        axios.get(`${process.env.REACT_APP_URL}/getNextWeek/${managerId}`)
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
        
            await axios.put(`${process.env.REACT_APP_URL}/setNextWeekVisible/${managerId}`)
            .then((response) => {
                console.log(response.data)
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
            confirmButtonColor: '#2977bc',
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

            {!weekVisivble ? <div className={styles.publish_div_createWeek}>
                <button onClick={publishWeek} className={styles.addShift_btn}>פרסם משמרות</button>
            </div> : 
            
             
            <div className={styles.published_div}>
                <button visible='false'>השבוע פורסם</button>
            </div>}
            <div>
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