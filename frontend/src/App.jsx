
import './App.css'
import { Routes } from 'react-router-dom'
import Home from './pages/home/Home.jsx';
import Signup from './pages/auth/signup/Signup.jsx';
import Login from './pages/auth/login/Login.jsx';
import { Route } from 'react-router-dom';
import Sidebar from './components/common/Sidebar.jsx';
import RightPanel from './components/common/RightPanal.jsx';
import NotificationPage from './pages/notification/Notification.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';

function App() {
  return (

    <div className='flex max-w-6xl mx-auto'>
      <Sidebar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
      </Routes>   
      <RightPanel />    
    </div>
  )
}

export default App
