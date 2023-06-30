import React, {useState } from 'react'
import styles from '../userManegment/addRole.module.css'
import axios from 'axios';

const AddRole = () => {
    
    const [role, setRole] = useState('');

    const addRole = async () => {
        const newRole = {
            name:role
        }
        try {
            await axios.post("http://localhost:3001/app/addRole", newRole)
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

    return <div>
        <div>
            <div className={styles.container}>
                <input
                    className={styles.input}
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                />
                <label className={styles.label}>תפקיד</label>
            </div>
            <div>
                <button onClick={addRole} className={styles.btn}>הוסף</button>
            </div>

        </div>
    </div>
}

export default AddRole