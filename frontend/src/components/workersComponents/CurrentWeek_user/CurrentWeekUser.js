import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Day from './CurrentDayser'

const CurrentWeekUser = () => {

    const[week, setWeek] = useState(null);

    const getDays = () => {
             axios.get("http://localhost:3001/app/getCurrentWeek").then((response) => {
                console.log(response.data);
                setWeek(response.data);
        }).catch(err=> console.log(err));
    }
        
    useEffect(()=>{
        getDays();

    }, []);

    return <React.Fragment>
        <div>
            {
               week ?  week.day.map((day) => {
                    return <Day day={day} key={day._id}></Day>
                }) : null
            }
        </div>
    </React.Fragment>
}

export default CurrentWeekUser