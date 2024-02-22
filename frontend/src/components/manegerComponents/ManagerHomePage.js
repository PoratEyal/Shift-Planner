import styles from '../manegerComponents/maneger_home_page.module.css'
import React, { createContext, useEffect, useState } from 'react'
import { Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import PageLayout from '../layout/PageLayout';

export const ManagerContext = createContext({
    getUser: () => {
      const user = localStorage.getItem('user');
      const userData = JSON.parse(user);
      return userData._id;
    },
});

const ManagerHomePage = () => {

    const navigate = useNavigate();
    let data = {};
    const [fullname, setName] = useState("");
    const [weekVisible, setWeekVisible] = useState(false);
    const [loading, setLoading] = useState(true);

    // get user from the local storage and return the user ID
    const getUser = () => {
        const user = localStorage.getItem('user');
        const userData = JSON.parse(user);
        return userData._id;
    };

    // get the nextWeek
    useEffect(() => {
        const StorageData = JSON.parse(localStorage.getItem("user"));
        if(StorageData){
            data = StorageData;
            setName(data.fullName);
        }
        else{
            navigate('/');
        }
        const managerId = getUser();
        const reqBody = {
            id: managerId
        }
        axios.post(`${process.env.REACT_APP_URL}/getNextWeek`, reqBody)
        .then((response) => {
            setWeekVisible(response.data.visible);
            setLoading(false);
        }).catch(err=> {
            console.log(err)
            setLoading(false);
        });
    }, [])

    const handleClick = (event) => {
        if (!loading && !weekVisible) {
          event.preventDefault();
          Swal.fire({
            title: 'שיבוץ עובדים אפשרי רק לאחר יצירת ופרסום המשמרות',
            icon: 'warning',
            confirmButtonColor: '#34a0ff',
            confirmButtonText: 'סגור'
          });          
        }
      };

    return <ManagerContext.Provider value={{getUser}}>
        <PageLayout text={`ברוך שובך, ${fullname}`} noAnimation={true}>
            
            <div className={styles.container}>

                <div className={styles.currentWeek_container}>
                    
                    <div className={styles.week_text_1}>
                        <label>שבוע נוכחי</label>
                    </div>

                    <Link className={styles.link} to="/SeeCurrentWeekShifts">
                        <button className={styles.btnUp}>
                            <img src="/seeIcon.svg" alt="image" />  
                            <div className={styles.text_div}>  
                                צפיה בסידור העבודה  
                            </div>
                        </button>
                    </Link>

                    <Link className={styles.link} to="/editCurrentWeek">
                        <button className={styles.btn}>
                            <img className={styles.icon2} src="/updateIcon.svg" alt="image" />  
                            <div className={styles.text_div}>  
                                עדכון סידור העבודה
                            </div>
                        </button>
                    </Link>
                </div>
                

                <div className={styles.currentWeek_container}>
                    <div className={styles.week_text_2}>
                        <label>שבוע הבא</label>
                    </div>
                </div>

                <Link className={styles.link} to="/createNewWeek">
                    <button className={styles.btnUp}>
                        <img className={styles.icon2} src="/createIcon.svg" alt="image" />  
                        <div className={styles.text_div}>  
                            יצירת משמרות
                        </div>
                    </button>
                </Link> 

                <Link className={styles.link} to="/currentWeekShifts" onClick={handleClick}>
                <button className={styles.btn}>
                        <img className={styles.icon2} src="/schduleIcon.svg" alt="image" />  
                        <div className={styles.text_div}>  
                            שיבוץ עובדים
                        </div>
                    </button>
                </Link>

            </div>
        </PageLayout>
    </ManagerContext.Provider>
}

export default ManagerHomePage;