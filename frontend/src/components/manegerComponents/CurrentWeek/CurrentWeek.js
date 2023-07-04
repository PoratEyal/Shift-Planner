import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DayCurrentWeek from './DayCurrentWeek'

const CurrentWeek = () => {
    
    const[week, setWeek] = useState({});
const getDays = () => {
        console.log("in get week");
         axios.get("http://localhost:3001/app/getCurrentWeek").then((response) => {
            console.log(response.data);
            setWeek(response.data);
    }).catch(err=> console.log(err));
}
    
    useEffect(()=>{
        console.log("in use Effect");
        getDays();

    }, []);

    //useEffect(() => {}, [week])

    
    return <React.Fragment>
        <div>
            {
                // week.map((day) => {
                //     return <div>{day}</div>//<DayCurrentWeek day={day} key={day._id} getDays={getDays}></DayCurrentWeek>
                // }) 
               week ?  week.day.map((day) => {
                    return <DayCurrentWeek day={day} key={day} getDays={getDays}></DayCurrentWeek>
                }) : null
            }
        </div>
    </React.Fragment>
}

export default CurrentWeek;