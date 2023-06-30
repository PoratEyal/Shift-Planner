import React from 'react';
import UserManagment from '../src/component/maneger/userManegment/userManagement'
import Login from '../src/component/all/login'
import ManagerHomePage from '../src/component/maneger/maneger_home_page'
<<<<<<< HEAD
import CreateWeek from '../src/component/maneger/createWeek/createWeek';
import {Route, BrowserRouter as Router, Routes } from 'react-router-dom';
=======
import CreateWeek from './component/maneger/createWeek';

>>>>>>> d4adae92279759b7af790f709d3d53e7bd8f656e
const App = () => {

  return <React.Fragment>
        {/* <Login></Login> */}
<<<<<<< HEAD
        <Router>
          <Routes>
            <Route path="/" element={<ManagerHomePage />} />
            <Route path="/userManagment" element={<UserManagment />} />
            <Route path="/createNewWeek" element={<CreateWeek></CreateWeek>} />
          </Routes>
      </Router>

=======
        
        <ManagerHomePage></ManagerHomePage> 
        {/* <UserManagment></UserManagment> */}
        {/* <CreateWeek></CreateWeek> */}
>>>>>>> d4adae92279759b7af790f709d3d53e7bd8f656e
    </React.Fragment>
}

export default App;