import React from 'react'
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/signup/SignupPage';
import HomePage from './pages/home/HomePage';
import ProtectedRoute from '../ProtectedRoute';
import Navbar from './components/navbar/Navbar';




const AppLayout = () => {
  return (
    <>
      <Routes>

        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/' element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
        
      </Routes>
    </>
  )
}

export default AppLayout
