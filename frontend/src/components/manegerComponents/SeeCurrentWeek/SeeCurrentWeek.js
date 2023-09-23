import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DayCurrentWeek from './SeeDayCurrentWeek'
import styles from './seeCurrentWeek.module.css';
import { useNavigate } from 'react-router-dom';
import { ManagerContext } from '../ManagerHomePage' 
import { useContext } from 'react';
import PageLayout from './/..//..//layout/PageLayout';

const SeeCurrentWeek = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);

    const managerContext = useContext(ManagerContext);
    const managerId = managerContext.getUser();

    const getDays = () => {
        const reqBody = {
            managerId: managerId
        }
        axios.post(`${process.env.REACT_APP_URL}/getCurrentWeek`, reqBody).then((response) => {
            setWeek(response.data);
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        getDays();
    }, []);
    
    return <PageLayout text='צפיה בסידור העבודה'>
            <div style={{ marginTop: '70px' }} className={styles.container}>
                {
                    week ? week.day.map((day) => {
                        return <DayCurrentWeek managerId={managerId} day={day} key={day._id} getDays={getDays}></DayCurrentWeek>
                    }) : null
                }
            </div>

            {week && (
                <img onClick={() => navigate('/editCurrentWeek')} src='edit.png' className={styles.edit_week_btn}></img>
            )}
    </PageLayout>
}

export default SeeCurrentWeek;