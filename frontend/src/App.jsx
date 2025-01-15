
import './App.css'
import { Navigate, Routes } from 'react-router-dom'
import Home from './pages/home/Home.jsx';
import Signup from './pages/auth/signup/Signup.jsx';
import Login from './pages/auth/login/Login.jsx';
import { Route } from 'react-router-dom';

import Sidebar from './components/common/Sidebar.jsx';
import RightPanel from './components/common/RightPanal.jsx';

import NotificationPage from './pages/notification/Notification.jsx';
import ProfilePage from './pages/profile/ProfilePage.jsx';

import { Toaster } from "react-hot-toast";
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {

  const {data: authUser, isLoading} = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if(data.error) return null;
        if(!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        console.log("auth user is here :", data);

        return data;
        
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  })

  if(isLoading) {
    return (
			<div className='h-screen flex justify-center items-center'>
				<LoadingSpinner size='lg' />
			</div>
		);
  }

  return (

    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar />}
      <Routes>
        <Route path="/" element={authUser? <Home /> : <Login />} />
        <Route path="/signup" element={authUser? <Home /> : <Signup />} />
        <Route path="/login" element={authUser? <Home /> : <Login />} />
        <Route path="/notifications" element={authUser ? <NotificationPage /> : <Login />} />
        <Route path="/profile/:username" element={authUser ? <ProfilePage /> : <Login />} />
      </Routes>   
      {authUser && <RightPanel /> }  
      <Toaster /> 
    </div>
  )
}

export default App
