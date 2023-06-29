import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../maneger/allUsers.module.css'

const AllUsers = (props) => {
    
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
    }, [props.added]);

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
            <label>:name</label><label className={styles.p}>{user.fullName}&nbsp;</label>
            </div>
        </div>
        ))}
  </div>
}

export default AllUsers