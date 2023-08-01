import React, { useEffect, useState, useContext } from 'react';
import styles from './addRole.module.css';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from 'sweetalert2';
import { ManagerContext } from '../ManagerHomePage';


const AddRole = (props) => {
  const [role, setRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const managerContext = useContext(ManagerContext);


  const addRole = async () => {
    if(role === ''){
      return
    }
    const newRole = {
      manager: managerContext.getUser(),
      name: role
    };
    try {
      await axios
        .post(`${process.env.REACT_APP_URL}/addRole`, newRole)
        .then(response => {
          console.log(response.data);
          setRole('');
          setClicked(!clicked)
          props.roleAdded();
        })
        .catch(error => {
          console.log(error.response.data.error);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getRoles();
  }, [roles]);

  const getRoles = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };
    const reqbody ={
      managerId: managerContext.getUser()
    }
    axios
      .post(`${process.env.REACT_APP_URL}/getRoles`, reqbody ,config)
      .then((response) => {
        setRoles(response.data);
        setLoading(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteRole = async (roleId) => {
    Swal.fire({
      title: 'האם ברצונך למחוק את התפקיד',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'ביטול',
      confirmButtonColor: '#2977bc',
      cancelButtonColor: '#d33',
      confirmButtonText: 'אישור'
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'התפקיד נמחק',
          icon: 'success',
          confirmButtonColor: '#2977bc',
          confirmButtonText: 'סגירה'
      });
        try {
          await axios
            .delete(`${process.env.REACT_APP_URL}/deleteRole/${roleId}`)
            .then(() => {})
            .catch(error => {
              console.log(error.response.data.error);
            });
        } catch (error) {
          console.log(error.message);
        }
      }
    });
  };


  return (
    <div className={styles.container}>
      {!loading ? (
        <div className={styles['three-body']}>
          <div className={styles['three-body__dot']}></div>
          <div className={styles['three-body__dot']}></div>
          <div className={styles['three-body__dot']}></div>
        </div>
      ) : (roles.map(role => (
        <div className={styles.roles} key={role._id}>
          <button onClick={() => deleteRole(role._id)} className={styles.delete_btn}><RiDeleteBin6Line></RiDeleteBin6Line></button>
          <label className={styles.label}>{role.name}</label>
        </div>
      ))

      )
      }
      <button onClick={() => setClicked(!clicked)} className={styles.btn}>הוספת תפקיד</button>

      {clicked ? (
        <div>
          <input
            className={styles.input}
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder='תפקיד'
            required
          />
          <div>
            <button onClick={addRole} className={styles.btn}>אישור</button>
          </div>
        </div>
      ) : null}

    </div>
  )
}

export default AddRole;
