import React, { useEffect, useState } from 'react';
import UserDay from './UserDay'
import axios from 'axios';

const ChooseShifts = () => {

    const [week, setWeek] = useState(null);

    const getDays = () => {
        axios.get("http://localhost:3001/app/getNextWeek").then((response) => {
            setWeek(response.data);
        });
    }

    useEffect(() => {
        getDays();
    }, []);
    return <React.Fragment>
        <div>
            {
               week ?  week.day.map((day) => {console.log(day);
                    return <UserDay day={day} key={day._id} getDays={getDays}></UserDay>
                }) : null
            }
        </div>
    </React.Fragment>
}

export default ChooseShifts;