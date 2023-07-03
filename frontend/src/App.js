import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserManagement from '../src/component/maneger/userManegment/userManagement';
import Login from '../src/component/all/login';
import ManagerHomePage from '../src/component/maneger/maneger_home_page';
import CreateWeek from '../src/component/maneger/createWeek/createWeek';
import UserHomePage from './component/workers/User_home_page';
import ChooseShifts from './component/workers/chooseShifts/chooseShifts';
import UserSetings from './component/workers/userSettings/userSettings'


const App = () => {
  return <React.Fragment>
      <Routes>
        {/* - - - - - - - -login - - - - - - -  */}
        <Route path="/" element={<Login/>} />

         {/* - - - - - - - -maneger - - - - - - -  */}
        <Route path='/managerHomePage' element={<ManagerHomePage/>}></Route>
        <Route path="/userManagment" element={<UserManagement />} />
        <Route path="/createNewWeek" element={<CreateWeek />} />
        <Route path='/HomePage' element={<UserHomePage/>}></Route>

         {/* - - - - - - - -workers - - - - - - -  */}
        <Route path='/chooseShifts' element={<ChooseShifts/>}></Route>
        <Route path='/userSettings' element={<UserSetings/>}></Route>
      </Routes>
    </React.Fragment>
};

export default App;