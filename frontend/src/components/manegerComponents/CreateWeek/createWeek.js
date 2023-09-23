import React, { useEffect, useState } from 'react';
import Day from './CreateWeekDay';
import axios from 'axios';
import styles from '../CreateWeek/createWeek.module.css'
import Swal from 'sweetalert2';
import { ManagerContext } from '../ManagerHomePage' 
import { useContext } from 'react';
import { FcAdvertising } from "react-icons/fc";
import { FcApproval } from "react-icons/fc";
import PageLayout from './/..//..//layout/PageLayout';

const CreateWeek = () => {

    const [week, setWeek] = useState(null);
    const [weekVisivble, setWeekVisivble] = useState(null);
    const [weekPublished, setWeekPublished] = useState(null);
    const [defShifts, setDefShifts] = useState();

    const managerContext = useContext(ManagerContext);
    const managerId = managerContext.getUser();
    

    // get all the days in the week (from the specific manager)
    const getDays = async () => {
        const managerId = managerContext.getUser();
        const reqBody = {
            id: managerId
        }
        const defBody = {
            managerId: managerId
        }
        const defShifts = await axios.post(`${process.env.REACT_APP_URL}/getDefShifts`, defBody);
        if(defShifts.data){
            setDefShifts(defShifts.data);
        }
        await axios.post(`${process.env.REACT_APP_URL}/getNextWeek`, reqBody)
        .then((response) => {
            setWeek(response.data);
            setWeekVisivble(response.data.visible);
            setWeekPublished(response.data.publishScheduling)
        }).catch(err => console.log(err));
        
    }

    useEffect(() => {
        getDays();
    }, []);

    // set next week to visible
    const editWeek = async () => {
        const managerId = managerContext.getUser();
        const reqBody = {
            id: managerId
        }
            await axios.put(`${process.env.REACT_APP_URL}/setNextWeekVisible`, reqBody)
            .then((response) => {
                setWeekVisivble(true)
            }).catch ((error) => {
            console.log(error.message);
        });
    }

    // show alert, if the manager select "yes" - week becomes visible
    const publishWeek = () => {
        Swal.fire({
            title: 'האם ברצונך לפרסם את המשמרות לשבוע הבא',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText : 'ביטול',
            confirmButtonColor: '#34a0ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'פרסום'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: 'המשמרות פורסמו',
                icon: 'success',
                confirmButtonColor: '#34a0ff',
                confirmButtonText: 'סגירה'
            })
              editWeek()
            }
          })
    }

    return <PageLayout text='משמרות לשבוע הבא'>
        <div className={styles.container}>
            {weekVisivble === false ?
            <div className={styles.publish_div_createWeek}>
                <button onClick={publishWeek}>
                    <FcAdvertising className={styles.icon_publish}></FcAdvertising>
                    <label>פרסום משמרות</label>
                </button>
            </div> : null}

            {weekVisivble === true ?
            <div className={styles.published_div}>
                <button visible='false'>
                    <FcApproval className={styles.icon_publishd}></FcApproval>
                    <label>המשמרות פורסמו</label>
                </button>
            </div> : null}

            <div style={{ marginTop: '65px', marginBottom: '50px' }}>
                {
                    week ? week.day.map((day) => {
                        return <Day day={day} key={day._id} defShifts={defShifts} getDays={getDays} managerId={managerId}></Day>
                    }) : null
                }
            </div>
        </div>
    </PageLayout>
}



export default CreateWeek