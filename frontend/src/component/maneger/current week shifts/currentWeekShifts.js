import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ManegerDay from './maneger.day'

const CurrentWeekShifts = () => {
    
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
                    return <ManegerDay day={day} key={day._id} getDays={getDays}></ManegerDay>
                })
            }
        </div>
    </React.Fragment>
}

export default CurrentWeekShifts;