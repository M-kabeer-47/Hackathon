
import UserHome from './UserDash'
import AdminHome from './AdminHome'
import Landing from './Landing'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Form from './Form'

export default function App() {
  return(
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/admin' element={<AdminHome />} />
        <Route path='/user' element={<UserHome />} />
        <Route path='/user/signUp' element={<Form />} /> 
      </Routes>
    </Router>
  )
}