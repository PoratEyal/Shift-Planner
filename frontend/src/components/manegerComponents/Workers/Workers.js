import PageLayout from './/..//..//layout/PageLayout';
import styles from './workers.module.css';
import { ManagerContext } from '../ManagerHomePage';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import Swal from 'sweetalert2';
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

const Workers = () => {

    const navigate = useNavigate();

    const [users, setUsers] = useState([])
    const [userDeleted, setUserDelted] = useState(false)
    const [loading, setLoading] = useState(false)
    const managerContext = useContext(ManagerContext);

    useEffect(() => {
        const fetchData = async () => {
        try {
          const body = {
            job: managerContext.getUser()
          }
          const response = await axios.post(`${process.env.REACT_APP_URL}/getMyWorkers`, body);
          setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
        };
  
        fetchData();
    }, []);
  
    useEffect(() => {
    const fetchData = async () => {
        try {
        const body = {
            job: managerContext.getUser()
        }
        const response = await axios.post(`${process.env.REACT_APP_URL}/getMyWorkers`, body);
        setUsers(response.data);
        setLoading(true)
        } catch (error) {
            console.error(error);
        }
        };

        fetchData();
    }, [userDeleted]);

    const deleteUser = async (userId) => {
        Swal.fire({
          title: 'האם ברצונך למחוק את המשתמש',
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText: 'ביטול',
          confirmButtonColor: '#34a0ff',
          cancelButtonColor: '#d33',
          confirmButtonText: 'אישור'
        }).then(async (result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: 'המשתמש נמחק',
              icon: 'success',
              confirmButtonColor: '#34a0ff',
              confirmButtonText: 'סגירה'
            }
            );
          try {
              await axios.delete(`${process.env.REACT_APP_URL}/deleteUser/${userId}`)
                .then(response => {
                  setUserDelted(true)
                })
                .catch(error => {
                  console.log(error.response.data.error);
                });
            } catch (error) {
              console.log(error.message);
            }
          }
        });
      }
    
    return <PageLayout text='עובדים'>
        <div className={styles.container}>
            {!loading ? (
            <div className={styles['three-body']}>
            <div className={styles['three-body__dot']}></div>
            <div className={styles['three-body__dot']}></div>
            <div className={styles['three-body__dot']}></div>
            </div>
            ) : (
            users.map((user) => (

                (user._id !== managerContext.getUser()) ?
                <div key={user._id} className={styles.user_container}>
                <div>
                    <button
                    className={styles.btn}
                    onClick={() => {
                        deleteUser(user._id);
                        setUserDelted(false);
                    }}
                    >
                    <RiDeleteBin6Line></RiDeleteBin6Line>
                    </button>
                </div>
                <div>
                    <p className={styles.p}>{user.fullName}</p>
                </div>
                </div>
                : null
            ))
            )}
        </div>
        <img onClick={() => navigate('/createWorker')} src='addUser.png' className={styles.addUser_btn}></img>
    </PageLayout>
}

export default Workers;