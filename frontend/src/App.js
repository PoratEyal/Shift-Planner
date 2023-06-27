import React, { useState } from 'react';
import axios from 'axios';
import styles from '../src/styles/App.module.css';
import maneger_home_page from '../src/component/maneger_home_page';

const App = () => {

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:3001/app/getRoles");
  //       setRoles(response.data);
  //       console.log(response.data);
  //     } catch (error) {
  //       // handle the error
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, []);



  // return (
  //   <div className={styles.container_div}>
  //     <form onSubmit={createUser}>
  //       <label className={styles["login-text"]}>כניסה</label>
  
  //       <div>
  //         <div className={styles["wave-group"]}>
  //           <input required type="text" className={styles.input} />
  //           <span className={styles.bar}></span>
  //           <label className={styles.label}>
  //             <span className={styles["label-char"]} style={{ "--index": 0 }}>U</span>
  //             <span className={styles["label-char"]} style={{ "--index": 1 }}>s</span>
  //             <span className={styles["label-char"]} style={{ "--index": 2 }}>e</span>
  //             <span className={styles["label-char"]} style={{ "--index": 3 }}>r</span>
  //             <span className={styles["label-char"]} style={{ "--index": 4 }}>n</span>
  //             <span className={styles["label-char"]} style={{ "--index": 5 }}>a</span>
  //             <span className={styles["label-char"]} style={{ "--index": 6 }}>m</span>
  //             <span className={styles["label-char"]} style={{ "--index": 7 }}>e</span>
  //           </label>
  //         </div>
  //       </div>
  
  //       <div>
  //         <div className={styles["wave-group"]}>
  //           <input required type="text" className={styles.input} />
  //           <span className={styles.bar}></span>
  //           <label className={styles.label}>
  //             <span className={styles["label-char"]} style={{ "--index": 0 }}>P</span>
  //             <span className={styles["label-char"]} style={{ "--index": 1 }}>a</span>
  //             <span className={styles["label-char"]} style={{ "--index": 2 }}>s</span>
  //             <span className={styles["label-char"]} style={{ "--index": 3 }}>s</span>
  //             <span className={styles["label-char"]} style={{ "--index": 4 }}>w</span>
  //             <span className={styles["label-char"]} style={{ "--index": 5 }}>o</span>
  //             <span className={styles["label-char"]} style={{ "--index": 6 }}>r</span>
  //             <span className={styles["label-char"]} style={{ "--index": 7 }}>d</span>
  //           </label>
  //         </div>
  //       </div>
  
  //       <button type="submit">התחברות</button>
  
  //       <div className={styles.register}>
  //         <button className={styles["register-btn"]}>להרשמה לחצו כאן</button>
  //         <label>אין עדיין חשבון?</label>
  //       </div>
  //     </form>
  //   </div>
  // );
  
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      fullName: fullName,
      username: username,
      password: password,
      role: "cleaner"
    }
    console.log('Form submitted:', { fullName, username, password });
    axios.post("http://localhost:3001/app/addUser", newUser)
    .then((response) => {
      console.log('Form submitted successfully:', response.data);
      setFullName('');
      setUsername('');
      setPassword('');
    })
    .catch((error) => {
      console.error('An error occurred:', error);
    });
  };

  return (
    <div>
      <maneger_home_page/>
      <h1>Registration Form</h1>
      <form onSubmit={handleSubmit}>

        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Submit</button>

      </form>
    </div>
  );
  
}

export default App;