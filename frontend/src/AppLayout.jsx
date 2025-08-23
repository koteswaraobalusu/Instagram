import React from 'react'
import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/login/LoginPage';
import SignupPage from './pages/signup/SignupPage';
import HomePage from './pages/home/HomePage';
import ProtectedRoute from '../ProtectedRoute';
import UploadPost from './pages/uploadpost/UploadPost';
import PostComments from './components/postcomments/PostComments';
import PostMediaCarousel from './components/mediacarousel/PostMediaCaurosel';
import PostDetails from './components/postdetails/PostDetails';




const AppLayout = () => {
  return (
    <>
      <Routes>

        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/signup' element={<SignupPage/>}/>
        <Route path='/' element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
        <Route path='/upload-post' element={<ProtectedRoute><UploadPost/></ProtectedRoute>}/>
        {/* <Route path='/post-comments' elements={<ProtectedRoute><PostComments/></ProtectedRoute>}/> */}
         <Route path="/post/:postId" element={<PostDetails/>} />
      </Routes>
    </>
  )
}

export default AppLayout
