import React, { useEffect, useState } from 'react';
import UserDay from './UserDay'
import axios from 'axios';
import { BiSolidHome } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import styles from '../../manegerComponents/CreateWeek/createWeek.module.css'

const ChooseShifts = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);

    const getDays = () => {
        axios.get("http://localhost:3001/app/getNextWeek").then((response) => {
            setWeek(response.data);
        });
    }

    useEffect(() => {
        getDays();
    }, []);
    return <React.Fragment>
        <div className={styles.nav_container}>
            <button onClick={() => navigate('/HomePage')}><BiSolidHome></BiSolidHome></button>
            <p>בחירת משמרות לשבוע הבא</p>
        </div>

        <div style={{ marginTop: '70px' }} className={styles.container}>
            {week ? week.day.map((day) => {
                return <UserDay day={day} key={day._id} getDays={getDays} />;
            }) : null}
        </div>

    </React.Fragment>
}

export default ChooseShifts;