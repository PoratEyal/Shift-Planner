import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import Day from './CurrentDayser'
import styles from './currentWeekUser.module.css';
import PageLayoutWorker from './/..//..//layout/PageLayoutWorker';

export const UserContext = createContext({
    getUser: () => {
      const user = localStorage.getItem('user');
      const userData = JSON.parse(user);
      return userData.manager;
    },
});

const CurrentWeekUser = () => {

    const[week, setWeek] = useState(null);
    const [weekVisible, setWeekVisible] = useState(null);

    // return the manager Id of the current user (context func)
    const getUser = () => {
        const user = localStorage.getItem('user');
        const userData = JSON.parse(user);
        return userData.manager;
    };

    // get days of the current week
    // get if nextWeek is visible or not
    const getDays = () => {
        const body = {
            managerId: getUser()
        }
        axios.post(`${process.env.REACT_APP_URL}/getCurrentWeek`, body).then((response) => {
           setWeek(response.data);
        }).catch(err=> console.log(err));

        const body2 = {
            id: getUser()
        }
        axios.post(`${process.env.REACT_APP_URL}/getNextWeek`, body2).then((response) => {
            setWeekVisible(response.data.visible)
        }).catch(err=> console.log(err));
    }

    useEffect(() => { 
        getDays();
    }, [])

    return <UserContext.Provider value={{getUser}}>
        <PageLayoutWorker text='סידור עבודה לשבוע הנוכחי'>
            <div className={styles.container}>
                {
                week ?  week.day.map((day) => {
                        return <Day managerId={getUser()} day={day} key={day._id}></Day>
                    }) : null
                }
            </div>
        </PageLayoutWorker>
    </UserContext.Provider>
}

export default CurrentWeekUser