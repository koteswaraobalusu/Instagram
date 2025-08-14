import React from 'react'
import { Navigate } from 'react-router-dom'
import { useProtectedQuery } from './src/api/userAuthenticationApi'
import Navbar from './src/components/navbar/Navbar';




const ProtectedRoute = ({children}) => {
    const { data, isLoading, isError } = useProtectedQuery();
  

     if (isLoading) {
    return <h1>Loading...</h1>; // or a spinner
  }
    
     if (isError || !data || data.is_authenticated === false) {
  
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <Navbar/>
      {children}
    </>
  )
}

export default ProtectedRoute
