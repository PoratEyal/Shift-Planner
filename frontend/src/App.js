import React from 'react';
import UserManagment from '../src/component/maneger/userManagement'
import Login from '../src/component/all/login'
import ManagerHomePage from '../src/component/maneger/maneger_home_page'
import CreateWeek from './component/maneger/createWeek';

const App = () => {

  return <React.Fragment>
        {/* <Login></Login> */}
        {/* <ManagerHomePage></ManagerHomePage> */}
        {/* <UserManagment></UserManagment> */}
        <CreateWeek></CreateWeek>
    </React.Fragment>
}

export default App;