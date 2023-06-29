import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../maneger/allUsers.module.css'

const AllUsers = () => {
    
    const [users, setUsers] = useState([])

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:3001/app/getUsers");
            setUsers(response.data);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
        };

        fetchData();
    }, []);
    
    return <div>
        {users.map((user) => (
        <div key={user._id} className={styles.user_container}>
            <div>
                <button className={styles.btn}>Delete</button>
            </div>
            <div>
                <p className={styles.p}>{user.fullName}&nbsp;:שם מלא</p>
            </div>
        </div>
        ))}
  </div>
}

export default AllUsers