import React, { useState } from 'react';
import axios from 'axios';

const App = () => {

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