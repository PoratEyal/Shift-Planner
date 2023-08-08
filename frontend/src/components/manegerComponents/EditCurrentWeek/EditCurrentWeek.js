import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DayCurrentWeek from './EditDayCurrentWeek'
import styles from '../CreateWeek/createWeek.module.css'
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ManagerContext } from '../ManagerHomePage' 
import { useContext } from 'react';

const EditCurrentWeek = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);
    const [weekPublished, setWeekPublished] = useState(null)

    const managerContext = useContext(ManagerContext);
    const managerId = managerContext.getUser();

    // get all the days in the current week (from the specific manager)
    const getDays = () => {
        const managerId = managerContext.getUser();
        const reqBody = {
            managerId: managerId
        }
        axios.post(`${process.env.REACT_APP_URL}/getCurrentWeek`, reqBody)
        .then((response) => {
            setWeek(response.data);
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getDays();
    }, []);
      
    return <React.Fragment>
        <div>
            <div className={styles.nav_container}>
                <button className={styles.home_btn} onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
                <p>עריכת שבוע נוכחי</p>
            </div>

            <div style={{ marginTop: '70px' }} className={styles.container}>
                {
                    week ? week.day.map((day) => {
                        return <DayCurrentWeek  weekId={week._id} day={day} key={day._id} getDays={getDays} managerId={managerId}></DayCurrentWeek>
                    }) : null
                }
            </div>
        </div>
    </React.Fragment>
}

export default EditCurrentWeek;