import React from 'react'
import { Route, Routes } from 'react-router-dom';
import UserManagement from '../src/components/manegerComponents/UserManegment/UserManagement';
import Login from '../src/components/publics/login';
import ManagerHomePage from '../src/components/manegerComponents/ManagerHomePage';
import CreateWeek from '../src/components/manegerComponents/CreateWeek/createWeek';
import UserHomePage from './components/workersComponents/UserHomePage';
import ChooseShifts from './components/workersComponents/chooseShifts/ChooseShifts';
import UserSetings from './components/workersComponents/userSettings/userSettings';
import CurrentWeekShifts from './components/manegerComponents/CurrentWeek/CurrentWeek';
import CurrentWeekUser from './components/workersComponents/CurrentWeek_user/CurrentWeekUser';

const App = () => {

  return <React.Fragment>
      <Routes>
        {/* - - - - - - - -login - - - - - - -  */}
        <Route path="/" element={<Login/>} />

         {/* - - - - - - - -maneger - - - - - - -  */}
        <Route path='/managerHomePage' element={<ManagerHomePage/>}></Route>
        <Route path="/userManagment" element={<UserManagement />} />
        <Route path="/createNewWeek" element={<CreateWeek />} />
        <Route path="/currentWeekShifts" element={<CurrentWeekShifts />} />
        <Route path='/HomePage' element={<UserHomePage/>}></Route>

         {/* - - - - - - - -workers - - - - - - -  */}
        <Route path='/CurrentWeek' element={<CurrentWeekUser/>}></Route>
        <Route path='/chooseShifts' element={<ChooseShifts/>}></Route>
        <Route path='/userSettings' element={<UserSetings/>}></Route>

      </Routes>
    </React.Fragment>
};

export default App;