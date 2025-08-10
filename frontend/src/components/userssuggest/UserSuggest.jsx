import React from 'react'
import kotes from '../../assets/koteswararao.jpg'
import './usersuggest.css'
import { useUserLogoutMutation } from '../../api/userAuthenticationApi';
import { useNavigate } from 'react-router-dom';

const UserSuggest = () => {
    const [logout]=useUserLogoutMutation();
    const navigate=useNavigate();
    const handleLogout = async () => {
        try {
            await logout().unwrap();
            navigate('/login'); 
        } catch (error) {
        }
    }
  return (
    <div className='user-suggest'>

        <div className='user-switch'>
            <div className='user-profile-ring'>
                <img src={kotes} className='user-profile-img'/>
            </div>
            <div className='post-user-details'>
                <h3>kotes</h3>
            </div>
        </div>

        <div className='post-user-follow-btn'>

            <button className='switch-btn' onClick={handleLogout}>Switch</button>

        </div>
        

    </div>
  )
}

export default UserSuggest