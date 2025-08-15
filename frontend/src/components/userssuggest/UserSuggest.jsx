import React from 'react'
import profile_logo from '../../assets/profile_logo.png';
import './usersuggest.css'
import { useUserLoginDetailsQuery, useUserLogoutMutation } from '../../api/userAuthenticationApi';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const UserSuggest = () => {
    const [logout]=useUserLogoutMutation();
    const {data,isLoading,isError}=useUserLoginDetailsQuery();
    const navigate=useNavigate();
    console.log(data)
    
 
    const handleLogout = async () => {
        try {
            await logout().unwrap();
            navigate('/login'); 
        } catch (error) {
        }
    }

    if (isLoading) return <p>Loading...</p>;
    if (isError || !data) return <p>Unable to load user.</p>;
  return (
    <div className='user-suggest'>

       
            
        <div className='user-switch'>
            <div className='user-profile-ring'>
                <img src={data.user.profile_picture===null?profile_logo:`http://localhost:8000${data.user.profile_picture}`} className='user-profile-img'/>
            </div>
            <div className='post-user-details'>
                <h3 className='truncate-text' title={data.user.username}>{data.user.username}</h3>
            </div>
        </div>

        <div className='post-user-follow-btn'>

            <button className='switch-btn' onClick={handleLogout}>Switch</button>

        </div>
            
        

    </div>
  )
}

export default UserSuggest