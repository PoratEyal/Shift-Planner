import { useEffect, useState } from "react"
import axios from "axios";
const SettingsPage = (props) =>{

    //const [user, setUser] = useState(null);
    const [defShifts, setDefShifts] = useState(null);

    useEffect(() =>{
        const user = JSON.parse(localStorage.getItem('user'));
        axios.post(`${process.env.REACT_APP_URL}/getDefShifts`, {
            managerId: user._id
        }).then((response) => {
            setDefShifts(response.data);
            console.log(response.data);
        })
    }, []);
    


    return(
        <div>
            <form>

            </form>
        </div>
    )
}
export default SettingsPage