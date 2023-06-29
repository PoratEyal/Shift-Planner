import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../maneger/allUsers.module.css'

const AllUsers = (props) => {
    
    const [users, setUsers] = useState([])
    const [userDeleted, setUserDelted] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:3001/app/getUsers");
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
        };

        fetchData();
    }, [props.added]);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:3001/app/getUsers");
            setUsers(response.data);
        } catch (error) {
            console.error(error);
        }
        };

        fetchData();
    }, [userDeleted]);

    const deleteUser = async (userId) => {
        try {
            await axios.delete(`http://localhost:3001/app/deleteUser/${userId}`)
              .then(response => {
                console.log(response.data.message);
                setUserDelted(true)
              })
              .catch(error => {
                console.log(error.response.data.error);
              });
          } catch (error) {
            console.log(error.message);
          }
    }
    
    return <div>
        {users.map((user) => (
        <div key={user._id} className={styles.user_container}>
            <div>
                <button className={styles.btn} onClick={() => {
                    deleteUser(user._id);
                    setUserDelted(false);
                }}>Delete</button>
            </div>
            <div>
            <p className={styles.p}>{user.fullName}</p>
            </div>
        </div>
        ))}
  </div>
}

export default AllUsers