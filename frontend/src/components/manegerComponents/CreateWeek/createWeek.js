import React, { useEffect, useState } from 'react';
import Day from './CreateWeekDay';
import axios from 'axios';

const CreateWeek = () => {

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
            {
                week ? week.day.map((day) => {
                    return <Day day={day} key={day._id} getDays={getDays}></Day>
                }) : null
            }
        </div>
    </React.Fragment>
}

export default CreateWeek