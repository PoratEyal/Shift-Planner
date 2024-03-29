import PageLayout from './/..//..//layout/PageLayout';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ManagerContext } from '../ManagerHomePage' 
import { useContext } from 'react';
import Swal from 'sweetalert2';
import styles from './role.module.css'
import { TiDeleteOutline } from "react-icons/ti";
import LoadingAnimation from '../../loadingAnimation/loadingAnimation'

const Roles = () => {

    const [roles, setRoles] = useState([]);
    const [noRoles, setNoRoles] = useState(false)
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
                getRoles();
                Swal.fire({
                  title: 'התפקיד נוסף בהצלחה',
                  confirmButtonColor: '#34a0ff',
                  confirmButtonText: 'סגירה',
                  icon: 'success'
                });
              })
              .catch(error => {
                console.log(error.response.data.error);
              });
          } catch (error) {
            console.log(error.message);
          }
        }
    }

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
            if (Array.isArray(response.data) && response.data.length === 0) {
              setNoRoles(true)
            }
            else {
              setRoles(response.data);
            }
            setLoading(true);
          })
          .catch((err) => {
            console.log(err);
          });
    };

    useEffect(() => {
        getRoles();
    }, [noRoles, roles]);

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

    return <PageLayout text='תפקידים'>
        <div className={styles.all_roles_div}>
            <div className={styles.container}>
                {!loading ? 
                  <LoadingAnimation></LoadingAnimation>
                : 
                noRoles ? (
                  <div className={styles.noRoles_div}>לא קיימים תפקידים</div>
                ) : (
                  roles.map(role => (
                    <div className={styles.roles} key={role._id}>
                      <button onClick={() => deleteRole(role._id)} className={styles.delete_btn}><TiDeleteOutline></TiDeleteOutline></button>
                      <label className={styles.label}>{role.name}</label>
                    </div>
                    ))
                    )
                }
            </div>
        </div>
        <img onClick={addRole} src='addRole.png' className={styles.addUser_btn}></img>
    </PageLayout>
}

export default Roles