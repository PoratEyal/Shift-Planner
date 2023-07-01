import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import UserManagement from '../src/component/maneger/userManegment/userManagement';
import Login from '../src/component/all/login';
import ManagerHomePage from '../src/component/maneger/maneger_home_page';
import CreateWeek from '../src/component/maneger/createWeek/createWeek';
import UserHomePage from './component/workers/User_home_page';
const App = () => {
  return <React.Fragment>
     {/* <Login></Login>  */}
      <CreateWeek></CreateWeek>
       {/* <Routes>
        
          <Route path="/" element={<Login/>} />
          <Route path='/managerHomePage' element={<ManagerHomePage/>}></Route>
          <Route path="/userManagment" element={<UserManagement />} />
          <Route path="/createNewWeek" element={<CreateWeek />} />
          <Route path='/HomePage' element={<UserHomePage/>}></Route>
      </Routes> */}

    </React.Fragment>
};

export default App;