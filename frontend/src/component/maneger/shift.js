import React, { useState } from "react";

const Shift = (props) => {
    const [shift, setShift] = useState(props.shift);


    return <div style={{borderStyle:"solid"}}>
        <p>{shift.description}</p>
        <p>{shift.startTime}</p>
        <p>{shift.endTime}</p>
        <p>workers:</p>
        {
           shift.workers ? shift.workers.map((worker) => {return <p>worker</p>}) : null
        }
    </div>

}

export default Shift