import styles from '../manegerComponents/maneger_home_page.module.css'
import React, { createContext, useEffect, useState } from 'react'
import { Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import PageLayout from '../layout/PageLayout';
import { FcPlanner } from "react-icons/fc";
import { FcGoodDecision } from "react-icons/fc";
import { FcSurvey } from "react-icons/fc";
import { FcLeave } from "react-icons/fc";

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
            confirmButtonColor: '#2977bc',
            confirmButtonText: 'סגור'
          });          
        }
      };

    return <ManagerContext.Provider value={{getUser}}>
        <PageLayout text={`שלום ${fullname}`}>
            <div className={styles.container}>

                <label className={styles.week_text}>שבוע נוכחי</label>

                <Link className={styles.link} to="/SeeCurrentWeekShifts">
                    <button className={styles.btn}>
                        <div className={styles.icon_div}>
                            {<FcPlanner className={styles.icon1}></FcPlanner>} 
                        </div>
                        <div className={styles.text_div}>
                            צפיה בסידור העבודה  
                        </div>
                    </button>
                </Link>

                <Link className={styles.link} to="/editCurrentWeek">
                    <button className={styles.btn}>
                        <div className={styles.icon_div}>
                            {<FcLeave className={styles.icon2}></FcLeave>} 
                        </div>
                        <div className={styles.text_div}>
                            עדכון סידור העבודה  
                        </div>
                    </button>
                </Link>

                <div className={styles.spacer}></div>
                <label className={styles.week_text}>שבוע הבא</label>

                <Link className={styles.link} to="/createNewWeek">
                    <button className={styles.btn}>
                        <div className={styles.icon_div}>
                            {<FcSurvey className={styles.icon1}></FcSurvey>}
                        </div>
                        <div className={styles.text_div}>
                            יצירת משמרות
                        </div>
                    </button>
                </Link> 

                <Link className={styles.link} to="/currentWeekShifts" onClick={handleClick}>
                    <button className={styles.btn}>
                        <div className={styles.icon_div}>
                        {<FcGoodDecision className={styles.icon2}></FcGoodDecision>}
                        </div>
                        <div className={styles.text_div}>שיבוץ עובדים</div>
                    </button>
                </Link>

            </div>
        </PageLayout>
    </ManagerContext.Provider>
}

export default ManagerHomePage;
  

{/* <Link className={styles.link} to="/settings">
    <button className={styles.btn}>
        <div className={styles.icon_div}>
        {<MdManageAccounts className={styles.icon4}></MdManageAccounts>}
        </div>
        <div className={styles.text_div}>הגדרות</div>
    </button>
</Link> */}