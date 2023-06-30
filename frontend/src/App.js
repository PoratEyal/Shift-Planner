import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import UserManagement from '../src/component/maneger/userManegment/userManagement';
import Login from '../src/component/all/login';
import ManagerHomePage from '../src/component/maneger/maneger_home_page';
import CreateWeek from '../src/component/maneger/createWeek/createWeek';

const App = () => {
  return <React.Fragment>
      {/* <Login></Login> */}
      
      <Routes>
          <Route path="/" element={<ManagerHomePage />} />
          <Route path="/userManagment" element={<UserManagement />} />
          <Route path="/createNewWeek" element={<CreateWeek />} />
      </Routes>

    </React.Fragment>
};

export default App;