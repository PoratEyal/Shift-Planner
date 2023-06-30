import React, { useEffect, useState } from 'react';
import Day from './day';
import axios from 'axios';
const CreateWeek = () => {
    const[week, setWeek] = useState([]);

    useEffect(()=>{
        getDays();
    }, []);


    const getDays = async () => {
        await axios.get("http://localhost:3001/app/getDays").then((response) => {
            //console.log(response.data);
            const newWeek = response.data
            setWeek(newWeek);
        });}

    
    return <React.Fragment>
        <div>
            {
                 week.map((day) => {
                    return <Day day={day} key={day._id}></Day>
                })
            }
        </div>
    </React.Fragment>
}

export default CreateWeek