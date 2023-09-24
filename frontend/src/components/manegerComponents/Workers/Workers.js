import PageLayout from './/..//..//layout/PageLayout';
import styles from './workers.module.css';
import { ManagerContext } from '../ManagerHomePage';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import Swal from 'sweetalert2';
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const Workers = () => {

    const navigate = useNavigate();

    const [users, setUsers] = useState([])
    const [noWorkers, setNoWorkers] = useState(false)
    const [userDeleted, setUserDelted] = useState(false)
    const [loading, setLoading] = useState(false)

    const [openOptions, setOpenOptions] = useState(null);
    const [isDivVisible, setDivVisible] = useState(false);
    const divRef = useRef(null);

    const managerContext = useContext(ManagerContext);

    useEffect(() => {
        const fetchData = async () => {
        try {
          const body = {
            job: managerContext.getUser()
          }
          const response = await axios.post(`${process.env.REACT_APP_URL}/getMyWorkers`, body);
          if (Array.isArray(response.data) && response.data.length === 0) {
            setNoWorkers(true)
          }
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

    // control on the close and open the option select
    useEffect(() => {
      function handleOutsideClick(event) {
      if (divRef.current && !divRef.current.contains(event.target)) {
          setDivVisible(false);
      }
      }

      if (isDivVisible) {
      document.addEventListener('mousedown', handleOutsideClick);
      } else {
      document.removeEventListener('mousedown', handleOutsideClick);
      }

      return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      };
    }, [isDivVisible ])

    // when click on the ... icon - set those two states
    const options = (shiftId) => {
      setOpenOptions(shiftId);
      setDivVisible(true);
    }

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
    
      return (
        <PageLayout text='עובדים'>
          <div className={styles.container}>
            {!loading ? (
              <div className={styles['three-body']}>
                <div className={styles['three-body__dot']}></div>
                <div className={styles['three-body__dot']}></div>
                <div className={styles['three-body__dot']}></div>
              </div>
            ) : (
              noWorkers ? (
                <div className={styles.noWorkers_div}>לא קיימים עובדים</div>
              ) : (
                users.map((user) => (
                  (user._id !== managerContext.getUser()) ? (
                    <div key={user._id} className={styles.user_container}>
                      <div>
                      <div className={styles.delete_edit_div}>
                        <FiMoreHorizontal className={styles.icon} onClick={() => options(user._id)}></FiMoreHorizontal>

                        {openOptions === user._id && isDivVisible ? 
                          <div ref={divRef} className={styles.edit_div_options}>
                              <div className={styles.edit_div_flex}>
                                  <label onClick={() =>  setDivVisible(false)}>עריכת עובד</label>
                                  <BiEditAlt onClick={() =>  setDivVisible(false)} className={styles.icon_edit_select}></BiEditAlt>
                              </div>

                              <div className={styles.edit_div_flex}>
                                <label onClick={() => { deleteUser(user._id); setDivVisible(false); setUserDelted(false); }}>מחיקת עובד</label>
                                <RiDeleteBin6Line className={styles.icon_edit_select} onClick={() => { deleteUser(user._id); setDivVisible(false); setUserDelted(false); }}></RiDeleteBin6Line>
                              </div>
                          </div> : null}
                        </div>
                        {/* <button
                          className={styles.btn}
                          onClick={() => {
                            deleteUser(user._id);
                            setUserDelted(false);
                          }}
                        >
                          <RiDeleteBin6Line />
                        </button> */}
                      </div>
                      <div>
                        <p className={styles.p}>{user.fullName}</p>
                      </div>
                    </div>
                  ) : null
                ))
              )
            )}
          </div>
          <img onClick={() => navigate('/createWorker')} src='addUser.png' className={styles.addUser_btn} />
        </PageLayout>
      );
      
}

export default Workers;