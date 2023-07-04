import React, { useEffect, useState } from 'react';
import styles from './addRole.module.css';
import axios from 'axios';

const AddRole = (props) => {
  const [role, setRole] = useState('');
  const [roles, setRoles] = useState([]);
  const [clicked, setClicked] = useState(false)

  const addRole = async () => {
    const newRole = {
      name: role
    };
    try {
      await axios
        .post("http://localhost:3001/app/addRole", newRole)
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
    axios
      .get('http://localhost:3001/app/getRoles', config)
      .then((response) => {
        setRoles(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const deleteRole = async (roleId) => {
    try {
        await axios
          .delete(`http://localhost:3001/app/deleteRole/${roleId}`)
          .then(response => {
            console.log(response.data);
          })
          .catch(error => {
            console.log(error.response.data.error);
          });
      } catch (error) {
        console.log(error.message);
      }
  }

  return (
    <div className={styles.container}>
      {roles.map(role => (
        <div className={styles.roles} key={role._id}>
          <button onClick={() => deleteRole(role._id)} className={styles.delete_btn}>מחיקה</button>
          <label className={styles.label}>{role.name}</label>
        </div>
      ))}

    <button onClick={() => setClicked(!clicked)} className={styles.btn}>הוסף תפקיד</button>

    {clicked ? (
    <div>
        <input
        className={styles.input}
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        placeholder='תפקיד'
        />
        <div>
        <button onClick={addRole} className={styles.btn}>הוסף</button>
        </div>
    </div>
    ) : null}

    </div>
  )}

export default AddRole;
