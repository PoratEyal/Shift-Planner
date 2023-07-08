import React from 'react'
import { Route, Routes } from 'react-router-dom';
import UserManagement from '../src/components/manegerComponents/UserManegment/UserManagement';
import Login from '../src/components/publics/login';
import ManagerHomePage from '../src/components/manegerComponents/ManagerHomePage';
import CreateWeek from '../src/components/manegerComponents/CreateWeek/createWeek';
import ChooseShifts from './components/workersComponents/chooseShifts/ChooseShifts';
import UserSetings from './components/workersComponents/userSettings/userSettings';
import CurrentWeekShifts from './components/manegerComponents/CurrentWeek/CurrentWeek';
import CurrentWeekUser from './components/workersComponents/CurrentWeek_user/CurrentWeekUser';
import SeeCurrentWeek from './components/manegerComponents/SeeCurrentWeek/SeeCurrentWeek';
import ManagerSettings from './components/manegerComponents/managerSettings/managerSettings';

//import ProtectedRoute from '../ProtectedRoute';
import ProtectedRoute from './components/ProtectedRoute';
const App = () => {

  return <React.Fragment>
      <Routes>
        {/* - - - - - - - -login - - - - - - -  */}
        <Route path="/" element={<Login/>} />

         {/* - - - - - - - -maneger - - - - - - -  */}
        <Route path='/managerHomePage' element={<ProtectedRoute component={ManagerHomePage} role="admin"/>}></Route>
        <Route path="/userManagment" element={<ProtectedRoute component={UserManagement} role="admin"/>} />
        <Route path="/createNewWeek" element={<ProtectedRoute component={CreateWeek} role="admin"/>} />
        <Route path="/currentWeekShifts" element={<ProtectedRoute component={CurrentWeekShifts} role="admin"/>} />
        <Route path="/SeeCurrentWeekShifts" element={<ProtectedRoute component={SeeCurrentWeek} role="admin"/>} />
        <Route path='/managerSettings' element={<ProtectedRoute component={ManagerSettings} role="admin"/>}/>

         {/* - - - - - - - -workers - - - - - - -  */}
        <Route path='/CurrentWeek' element={<ProtectedRoute component={CurrentWeekUser} role="user"/>}></Route>
        <Route path='/chooseShifts' element={<ProtectedRoute component={ChooseShifts} role="user"/>}></Route>
        <Route path='/userSettings' element={<ProtectedRoute component={UserSetings} role="user"/>}></Route>

      </Routes>
    </React.Fragment>
};

export default App;