import React from 'react'
import { Routes, Route } from "react-router-loading";
import Login from '../src/components/publics/login';
import ManagerHomePage from '../src/components/manegerComponents/ManagerHomePage';
import CreateWeek from '../src/components/manegerComponents/CreateWeek/createWeek';
import ChooseShifts from './components/workersComponents/chooseShifts/ChooseShifts';
import UserSetings from './components/workersComponents/userSettings/userSettings';
import CurrentWeekShifts from './components/manegerComponents/CurrentWeek/CurrentWeek';
import CurrentWeekUser from './components/workersComponents/CurrentWeek_user/CurrentWeekUser';
import SeeCurrentWeek from './components/manegerComponents/SeeCurrentWeek/SeeCurrentWeek';
import ManagerSettings from './components/manegerComponents/managerSettings/managerSettings';
import ProtectedRoute from './components/ProtectedRoute';
import EditCurrentWeek from './components/manegerComponents/EditCurrentWeek/EditCurrentWeek';
import Roles from './components/manegerComponents/Roles/Roles';
import Workers from './components/manegerComponents/Workers/Workers';
import CreateWorker from './components/manegerComponents/Workers/CreateWorker';
import defShifts from './components/manegerComponents/ShiftPage/ShiftPage';
import CreateShift from './components/manegerComponents/ShiftPage/CreateShift';
import SettingsPage from './components/manegerComponents/SettingsPage/SettingsPage';
import Register from '../src/components/publics/Register';

const App = () => {

  return <React.Fragment>
      <Routes>
        {/* - - - - - - - -login - - - - - - -  */}
        <Route path="/" element={<Login/>} loading />
        <Route path="/register" element={<Register/>} loading />

        {/* - - - - - - - -maneger - - - - - - -  */}
        <Route path='/managerHomePage' element={<ProtectedRoute component={ManagerHomePage} role="admin"/>} loading ></Route>
        <Route path="/createNewWeek" element={<ProtectedRoute component={CreateWeek} role="admin"/>} loading />
        <Route path="/currentWeekShifts" element={<ProtectedRoute component={CurrentWeekShifts} role="admin"/>} loading />
        <Route path="/SeeCurrentWeekShifts" element={<ProtectedRoute component={SeeCurrentWeek} role="admin"/>} loading />
        <Route path='/managerSettings' element={<ProtectedRoute component={ManagerSettings} role="admin"/>} loading />
        <Route path='/editCurrentWeek' element={<ProtectedRoute component={EditCurrentWeek} role="admin"/>} loading />
        <Route path='/roles' element={<ProtectedRoute component={Roles} role="admin"/>} loading />
        <Route path='/workers' element={<ProtectedRoute component={Workers} role="admin"/>} loading />
        <Route path='/createWorker' element={<ProtectedRoute component={CreateWorker} role="admin" loading />}/>
        <Route path='/defShifts' element={<ProtectedRoute component={defShifts} role="admin"/>} loading ></Route>
        <Route path='/createShift' element={<ProtectedRoute component={CreateShift} role="admin"/>} loading ></Route>
        <Route path='/settingsPage' element={<ProtectedRoute component={SettingsPage} role="admin"/>} loading ></Route>

         {/* - - - - - - - -workers - - - - - - -  */}
        <Route path='/CurrentWeek' element={<ProtectedRoute component={CurrentWeekUser} role="user"/>}></Route>
        <Route path='/chooseShifts' element={<ProtectedRoute component={ChooseShifts} role="user"/>}></Route>
        <Route path='/userSettings' element={<ProtectedRoute component={UserSetings} role="user"/>}></Route>

      </Routes>
    </React.Fragment>
};

export default App;