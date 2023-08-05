import styles from '../manegerComponents/maneger_home_page.module.css'
import React, { createContext, useEffect, useState } from 'react'
import { Link, Outlet} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { BiLogOut } from "react-icons/bi";
import { BiUserCircle } from "react-icons/bi";
import { AiOutlineSchedule } from "react-icons/ai";
import { IoIosCreate } from "react-icons/io";
import { AiOutlineUsergroupAdd } from "react-icons/ai";
import Swal from 'sweetalert2';
import axios from 'axios';

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


    const getUser = () => {
        const user = localStorage.getItem('user');
        const userData = JSON.parse(user);
        return userData._id;
      };
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
    const signout = () => {
        Swal.fire({
            title: 'האם ברצונכם להתנתק',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'ביטול',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'אישור'
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.clear()
              navigate('./')
            }
          })
    }

    const handleClick = (event) => {
        if (!loading && !weekVisible) {
          event.preventDefault();
          Swal.fire({
            title: 'ברגע שיפורסמו המשמרות תוכלו להכנס לעמוד: שיבוץ עובדים',
            icon: 'warning',
            confirmButtonColor: '#2977bc'
          });
        }
      };


    return <ManagerContext.Provider value={{getUser}}>
        <div className={styles.upperContainer}>
            <div className={styles.nav_buttons}>
                <Link to="/"><button className={styles.signout} onClick={signout}><BiLogOut></BiLogOut></button></Link>
                <Link to="/managerSettings"><button className={styles.user_settings}><BiUserCircle></BiUserCircle></button></Link>
                <Link to="/userManagment"><button className={styles.user_managment_btn}>עובדים</button></Link>
            </div>

            <h1 className={styles.h1}>{fullname}</h1>
        </div>

        <div className={styles.container}>
            <Link className={styles.link} to="/SeeCurrentWeekShifts">
                <button className={styles.btn}>
                    <div className={styles.icon_div}>
                        {<AiOutlineSchedule className={styles.icon}></AiOutlineSchedule>} 
                    </div>
                    <div className={styles.text_div}>
                          סידור עבודה לשבוע הנוכחי  
                    </div>
                </button>
            </Link>

            <Link className={styles.link} to="/createNewWeek">
                <button className={styles.btn}>
                    <div className={styles.icon_div}>
                        {<IoIosCreate className={styles.icon}></IoIosCreate>}
                    </div>
                    <div className={styles.text_div}>
                        יצירת משמרות לשבוע הבא
                    </div>
                </button>
            </Link> 

            <Link className={styles.link} to="/currentWeekShifts" onClick={handleClick}>
                <button className={styles.btn}>
                    <div className={styles.icon_div}>
                    {<AiOutlineUsergroupAdd className={styles.icon3}></AiOutlineUsergroupAdd>}
                    </div>
                    <div className={styles.text_div}>שיבוץ עובדים לשבוע הבא</div>
                </button>
            </Link>


            <Outlet />
        </div>
    </ManagerContext.Provider>
}

export default ManagerHomePage;
  