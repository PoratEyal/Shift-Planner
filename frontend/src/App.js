import React from 'react';
import UserManagment from '../src/component/maneger/userManegment/userManagement'
import Login from '../src/component/all/login'
import ManagerHomePage from '../src/component/maneger/maneger_home_page'
import CreateWeek from '../src/component/maneger/createWeek/createWeek';
import {Route, BrowserRouter as Router, Routes } from 'react-router-dom';
const App = () => {

  return <React.Fragment>
        {/* <Login></Login> */}
        <Router>
          <Routes>
            <Route path="/" element={<ManagerHomePage />} />
            <Route path="/userManagment" element={<UserManagment />} />
            <Route path="/createNewWeek" element={<CreateWeek></CreateWeek>} />
          </Routes>
      </Router>

    </React.Fragment>
}

export default App;