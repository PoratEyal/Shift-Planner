import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DayCurrentWeek from './DayCurrentWeek'

const CurrentWeek = () => {

    const [week, setWeek] = useState(null);
    const getDays = () => {
        axios.get("http://localhost:3001/app/getNextWeek").then((response) => {
            setWeek(response.data);
        }).catch(err => console.log(err));
    }
    useEffect(() => {
        console.log("in use Effect");
        getDays();

    }, []);
    return <React.Fragment>
        <div>
            {
                week ? week.day.map((day) => {
                    return <DayCurrentWeek day={day} key={day._id} getDays={getDays}></DayCurrentWeek>
                }) : null
            }
        </div>
    </React.Fragment>
}

export default CurrentWeek;