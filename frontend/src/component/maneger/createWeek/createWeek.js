import React, { useEffect, useState } from 'react';
import Day from './day';
import axios from 'axios';

const CreateWeek = () => {

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
                    return <Day day={day} key={day._id} getDays={getDays}></Day>
                })
            }
        </div>
    </React.Fragment>
}

export default CreateWeek