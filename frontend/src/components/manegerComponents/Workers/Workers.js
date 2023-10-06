import PageLayout from './/..//..//layout/PageLayout';
import styles from './workers.module.css';
import { ManagerContext } from '../ManagerHomePage';
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Worker from './worker';

const Workers = () => {

  const navigate = useNavigate();

  const [users, setUsers] = useState([])
  const [noWorkers, setNoWorkers] = useState(false)
  const [userDeleted, setUserDelted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([]);
  const [setOpenOptions] = useState(null);
  const [isDivVisible, setDivVisible] = useState(false);

  const divRef = useRef(null);

  const managerContext = useContext(ManagerContext);

  const getRoles = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const reqbody = {
      managerId: managerContext.getUser()
    }
    axios
      .post(`${process.env.REACT_APP_URL}/getRoles`, reqbody, config)
      .then((response) => {
        console.log(response.data)
        setRoles(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  
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
    getRoles();
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
  }, [isDivVisible])

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
                <Worker user={user} roles={roles} key={user._id}></Worker>
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