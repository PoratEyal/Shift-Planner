import React, { useEffect, useState } from 'react';
import Day from './CreateWeekDay';
import axios from 'axios';

const CreateWeek = () => {
    const [week, setWeek] = useState(null);

    const getDays = () => {
        axios.get("http://localhost:3001/app/getNextWeek").then((response) => {
            console.log(response.data);
            setWeek(response.data);
        });
        console.log(week);
    }

    useEffect(() => {
        axios.get("http://localhost:3001/app/getNextWeek").then((response) => {
            console.log(response.data);
            setWeek(response.data);
        });
    }, []);

    return <React.Fragment>
        <div>
            {
                week ? week.day.map((day) => {
                    axios.get(`http://localhost:3001/app/getDay/${day}`).then((response) => {
                        return <Day day={response.data} key={response.data._id} getDays={getDays}></Day>
                    })
                }) : null
            }
        </div>
    </React.Fragment>
}

export default CreateWeek