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

    const getDays = () => {
        axios.get("http://localhost:3001/app/getNextWeek").then((response) => {
            setWeek(response.data);
            setWeekVisivble(response.data.visible);
        }).catch(err => console.log(err));;

    }

    useEffect(() => {
        getDays()
    }, []);

    // still dont work. the put not working and usestate every time canceled
    const editWeek = async () => {
        const updatedWeek = {
            name:week.name,
            visible:true,
            day:week.day
        }
        //console.log(updatedWeek)
        try {
            await axios.put("http://localhost:3001/app/editWeek", updatedWeek)
            .then((response) => {
                console.log(response.data)
                setWeekVisivble(true)
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    const publishWeek = () => {
        Swal.fire({
            title: 'האם אתה בטוח שברצונך לפרסם את השבוע',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText : 'ביטול',
            confirmButtonColor: '#332891e1',
            cancelButtonColor: '#d33',
            confirmButtonText: 'פרסם'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'השבוע פורסם',
                '',
                'success'
              )
              editWeek()
              console.log(week)
            }
          })
    }

    const editNewWeek = () => {
        Swal.fire({
            title: 'האם אתה בטוח שברצונך לעדכן את השבוע',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText : 'ביטול',
            confirmButtonColor: '#332891e1',
            cancelButtonColor: '#d33',
            confirmButtonText: 'עדכן'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'השבוע התעדכן',
                '',
                'success'
              )
              editWeek()
              console.log(week)
            }
          })
    }

    return <React.Fragment>
        <div className={styles.container}>
            <div className={styles.nav_container}>
                <button onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
                <p>בניית משמרות לשבוע הבא</p>
            </div>

            {!weekVisivble ? <div className={styles.publish_div}>
                <button onClick={publishWeek} className={styles.addShift_btn}>פרסם שבוע</button>
            </div> : 
            <div className={styles.published_div}>
                <button visible='false' className={styles._btn} onClick={editNewWeek}>עדכן שבוע</button>
            </div>
            }

            { <div>
                {
                    week ? week.day.map((day) => {
                        return <Day day={day} key={day._id} getDays={getDays}></Day>
                    }) : null
                }
            </div>}
        </div>
    </React.Fragment>
}

export default CreateWeek