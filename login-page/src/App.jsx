import { Routes, Route } from 'react-router-dom'
import LoginPage from './assets/Pages/LoginPage'
import LandingPage from './assets/Pages/LandingPage'
import Dashboard from './assets/Pages/Dashboard'
import EmployeeManagement from './assets/Pages/EmployeeManagement'
import AttendancePage from './assets/Pages/AttendancePage'
import SettingsPage from './assets/Pages/SettingsPage'
import DepartmentsPage from './assets/Pages/DepartmentsPage'
import ChatPage from './assets/Pages/ChatPage'

import './App.css'

function App() {
  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/employees' element={<EmployeeManagement />} />
      <Route path='/departments' element={<DepartmentsPage />} />
      <Route path='/attendance' element={<AttendancePage />} />
      <Route path='/settings' element={<SettingsPage />} />
      <Route path='/chat' element={<ChatPage />} />
    </Routes>
  )
}

export default App
