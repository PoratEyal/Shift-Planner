import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/app/getRoles");
        setRoles(response.data);
        console.log(response.data);
      } catch (error) {
        // handle the error
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {roles.map(role => (
        <div key={role._id}>
          <h3>{role.name}</h3>
        </div>
      ))}
    </div>
  );
}

export default App;