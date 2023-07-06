import React, { useEffect, useState } from 'react';
import Day from './CreateWeekDay';
import axios from 'axios';
import styles from '../CreateWeek/createWeek.module.css'
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';

const CreateWeek = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);
    const getDays = () => {
        axios.get("http://localhost:3001/app/getNextWeek").then((response) => {
            setWeek(response.data);
        }).catch(err => console.log(err));;

    }
    useEffect(() => {
        getDays();
    }, []);
    return <React.Fragment>
        <div>
            <div className={styles.nav_container}>
                <button onClick={() => navigate('/managerHomePage')}><BiSolidHome></BiSolidHome></button>
                <p>בנית משמרות לשבוע הבא</p>
            </div>

            <div className={styles.container}>
                {
                    week ? week.day.map((day) => {
                        return <Day day={day} key={day._id} getDays={getDays}></Day>
                    }) : null
                }
            </div>
        </div>
    </React.Fragment>
}

export default CreateWeek