import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DayCurrentWeek from './DayCurrentWeek'

const CurrentWeek = () => {
    
    const[week, setWeek] = useState([]);

    useEffect(()=>{
        getDays();
    }, []);

    const getDays = () => {
         axios.get("http://localhost:3001/app/getDays").then((response) => {
            setWeek(response.data);
    });}
    
    return <React.Fragment>
        <div>
            {
                week.map((day) => {
                    return <DayCurrentWeek day={day} key={day._id} getDays={getDays}></DayCurrentWeek>
                })
            }
        </div>
    </React.Fragment>
}

export default CurrentWeek;