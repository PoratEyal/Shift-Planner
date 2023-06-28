import React from 'react';
import ManagerHomePage from './component/maneger/maneger_home_page'
import Login from '../src/component/all/login'

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

  return <div>
        <ManagerHomePage></ManagerHomePage>
        {/* <Login></Login> */}
    </div>
  
}

export default App;