import React, { useEffect, useState } from 'react';
import UserDay from './UserDay'
import axios from 'axios';

const ChooseShifts = () => {
    
    const[week, setWeek] = useState([]);

    useEffect(()=>{
        getDays();
    }, []);

    const getDays = () => {
         axios.get("http://localhost:3001/app/getNextWeek").then((response) => {
            setWeek(response.data);
    });}
    
    return <React.Fragment>
        <div>
            {
                week.map((day) => {
                    return <UserDay day={day} key={day._id} getDays={getDays}></UserDay>
                })
            }
        </div>
    </React.Fragment>
}

export default ChooseShifts;