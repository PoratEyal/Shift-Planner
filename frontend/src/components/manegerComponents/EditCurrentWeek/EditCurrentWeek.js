import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DayCurrentWeek from './EditDayCurrentWeek'
import styles from '../CreateWeek/createWeek.module.css'
import { useNavigate } from 'react-router-dom';
import { ManagerContext } from '../ManagerHomePage'
import { useContext } from 'react';
import messageContext from '../CurrentWeek/messagesContext'
import PageLayout from './/..//..//layout/PageLayout';

const EditCurrentWeek = () => {

    const navigate = useNavigate();
    const [week, setWeek] = useState(null);
    const [weekPublished, setWeekPublished] = useState(null)
    const [weekMessages, setMessages] = useState(null);

    const managerContext = useContext(ManagerContext);
    const managerId = managerContext.getUser();

    // get all the days in the current week (from the specific manager)
    const getDays = async () => {
        const managerId = managerContext.getUser();
        const reqBody = {
            managerId: managerId
        }
        axios.post(`${process.env.REACT_APP_URL}/getCurrentWeek`, reqBody)
            .then((response) => {
                setWeek(response.data);
                axios.post(`${process.env.REACT_APP_URL}/getUserMessagesOfWeek`, { weekId: response.data._id })
                    .then(response => {
                        setMessages(response.data)
                    }).catch(err => console.log(err));
            }).catch(err => console.log(err));
    }

    useEffect(() => {
        getDays();

    }, []);

    return <PageLayout text='עריכת משמרות'>
            <div style={{ marginTop: '70px' }} className={styles.container}>
                {
                    week ? week.day.map((day) => {
                        return (
                            <messageContext.Provider value={weekMessages}>
                                <DayCurrentWeek weekId={week._id} day={day} key={day._id} getDays={getDays} managerId={managerId}></DayCurrentWeek>
                            </messageContext.Provider>
                        )
                    }) : null
                }
            </div>
    </PageLayout>
}

export default EditCurrentWeek;