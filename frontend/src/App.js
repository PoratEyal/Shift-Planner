import React from 'react'
import { Route, Routes } from 'react-router-dom';
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
import defShifts from './components/manegerComponents/ShiftPage/ShiftPage';
import CreateShift from './components/manegerComponents/ShiftPage/CreateShift';
import SettingsPage from './components/manegerComponents/SettingsPage/SettingsPage';
import Register from '../src/components/publics/Register';
import Otp from '../src/components/publics/OTP/otp'

const App = () => {

  return <React.Fragment>
      <Routes>
        {/* - - - - - - - -login - - - - - - -  */}
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/otp" element={<Otp/>} />

        {/* - - - - - - - -maneger - - - - - - -  */}
        <Route path='/managerHomePage' element={<ProtectedRoute component={ManagerHomePage} role="admin"/>}></Route>
        <Route path="/createNewWeek" element={<ProtectedRoute component={CreateWeek} role="admin"/>} />
        <Route path="/currentWeekShifts" element={<ProtectedRoute component={CurrentWeekShifts} role="admin"/>} />
        <Route path="/SeeCurrentWeekShifts" element={<ProtectedRoute component={SeeCurrentWeek} role="admin"/>} />
        <Route path='/managerSettings' element={<ProtectedRoute component={ManagerSettings} role="admin"/>}/>
        <Route path='/editCurrentWeek' element={<ProtectedRoute component={EditCurrentWeek} role="admin"/>}/>
        <Route path='/roles' element={<ProtectedRoute component={Roles} role="admin"/>}/>
        <Route path='/workers' element={<ProtectedRoute component={Workers} role="admin"/>}/>
        <Route path='/defShifts' element={<ProtectedRoute component={defShifts} role="admin"/>}></Route>
        <Route path='/createShift' element={<ProtectedRoute component={CreateShift} role="admin"/>}></Route>
        <Route path='/settingsPage' element={<ProtectedRoute component={SettingsPage} role="admin"/>}></Route>

         {/* - - - - - - - -workers - - - - - - -  */}
        <Route path='/CurrentWeek' element={<ProtectedRoute component={CurrentWeekUser} role="user"/>}></Route>
        <Route path='/chooseShifts' element={<ProtectedRoute component={ChooseShifts} role="user"/>}></Route>
        <Route path='/userSettings' element={<ProtectedRoute component={UserSetings} role="user"/>}></Route>

      </Routes>
    </React.Fragment>
};

export default App;