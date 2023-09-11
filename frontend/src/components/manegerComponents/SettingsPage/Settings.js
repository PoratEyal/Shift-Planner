import { useEffect, useRef, useState } from "react";
import axios from "axios";
import styles from './settingsPage.module.css';
import PageLayout from './/..//..//layout/PageLayout';

const SettingsPage = (props) =>{

    //const [user, setUser] = useState(null);
    const [defShifts, setDefShifts] = useState(null);
    let name = useRef();
    let startTime = useRef();
    let endTime = useRef();

    useEffect(() =>{
        const user = JSON.parse(localStorage.getItem('user'));
        axios.post(`${process.env.REACT_APP_URL}/getDefShifts`, {
            managerId: user._id
        }).then((response) => {
            setDefShifts(response.data);
            console.log(response.data);
        })
    }, []);

    const clickHandle = () => {
        console.log(name.current.value)
        console.log(startTime.current.value)
        console.log(endTime.current.value)
    }

    return <PageLayout text='הגדרות'>
        <div className={styles.contianer}>
            Add shift
            <form>
                <label>name:
                    <input type="text" ref={name}></input>
                </label>
                <br></br>
                <label>
                    startTime:
                    <input type="time" ref={startTime}></input>
                </label>
                <br></br>
                <label>
                    end time:
                    <input type="time" ref={endTime}></input>
                </label>
                
            </form>
            <button onClick={clickHandle}>
                    Submit
            </button>
        </div>
    </PageLayout>
}

export default SettingsPage