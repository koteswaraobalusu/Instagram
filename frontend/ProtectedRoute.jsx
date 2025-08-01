import React from 'react'
import { Navigate } from 'react-router-dom'
import { useProtectedQuery } from './src/api/userAuthenticationApi'
import Navbar from './src/components/navbar/Navbar';




const ProtectedRoute = ({children}) => {
    const { data, isLoading, isError } = useProtectedQuery();
    console.log(data, isLoading, isError);

     if (isLoading) {
    return <h1>Loading...</h1>; // or a spinner
  }
    // If loading, you can return a loading spinner or nothing  
     if (isError || !data || data.is_authenticated === false) {
    console.log('User not authenticated, redirecting to login...');
    return <Navigate to="/login" replace />;
  }
  // If token exists, render the children components
  return (
    <>
      <Navbar/>
      {children}
    </>
  )
}

export default ProtectedRoute
