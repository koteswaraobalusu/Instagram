import React, { use } from 'react'
import './homepage.css';
import { useProtectedQuery,useUserLogoutMutation } from '../../api/userAuthenticationApi';
import FormButton from '../../components/formButtons/FormButton';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';


const HomePage = () => {
    const { data, isLoading, isError } = useProtectedQuery();
    const navigate = useNavigate();
    console.log(data, isLoading, isError);
    // const handleLogout = async () => {
    //     try {
    //         await logout().unwrap();
    //         console.log('Logged out successfully');
    //         navigate('/login'); // Redirect to login page after logout
    //         // Optionally redirect to login page or show a message
    //     } catch (error) {
    //         console.error('Logout failed:', error);
    //     }
    // }
  return (
    <div>
        <Navbar/>

        {
            isLoading && <h1>Loading...</h1>
        }
        {
            data && data.username && <h1>{data.username}</h1>
        }
        
    </div>
  )
}

export default HomePage
