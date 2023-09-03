import React, { useEffect, useState, useContext } from 'react';
import styles from './addRole.module.css';
import axios from 'axios';
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from 'sweetalert2';
import { ManagerContext } from '../ManagerHomePage';


const AddRole = (props) => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const managerContext = useContext(ManagerContext);

  const addRole = async () => {
    const { value } = await Swal.fire({
      title: 'הוספת תפקיד',
      input: 'text',
      cancelButtonText: 'ביטול',
      confirmButtonColor: '#34a0ff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'אישור',
      showCancelButton: true,
      inputAttributes: {
        dir: 'rtl'
      },
      inputValidator: (value) => {
          if (!value) {
              return 'תיבת הטקסט ריקה מתוכן';
          }
      }
    });

    if (value) {
      const newRole = {
        manager: managerContext.getUser(),
        name: value
      };
      try {
        await axios.post(`${process.env.REACT_APP_URL}/addRole`, newRole)
          .then(response => {
            Swal.fire({
              title: 'התפקיד נוסף בהצלחה',
              confirmButtonColor: '#34a0ff',
              confirmButtonText: 'סגירה',
              icon: 'success'
            });
            props.roleAdded();
          })
          .catch(error => {
            console.log(error.response.data.error);
          });
      } catch (error) {
        console.log(error.message);
      }
    }
  }

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
      confirmButtonColor: '#34a0ff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'אישור'
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'התפקיד נמחק',
          icon: 'success',
          confirmButtonColor: '#34a0ff',
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

      <img onClick={addRole} src='addRole.png' className={styles.addUser_btn}></img>
    </div>
  )
}

export default AddRole;
