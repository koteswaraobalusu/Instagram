import React from 'react'
import './navbar.css';
import FormHeader from '../formHeader/FormHeader';
import { Form, useNavigate } from 'react-router-dom';
import home_icon from '../../assets/home_logo.png';
import search_icon from '../../assets/search_logo.png';
import reels_icon from '../../assets/reels_logo.png';
import messages_icon from '../../assets/messages_logo.png';
import notifications_icon from '../../assets/notifications_logo.png';
import profile_icon from '../../assets/profile_logo.png';
import logout_icon from '../../assets/logout_logo.png';
import { useUserLogoutMutation } from '../../api/userAuthenticationApi';


const Navbar = () => {
    const [logout]=useUserLogoutMutation();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            await logout().unwrap();
            navigate('/login'); 
        } catch (error) {
        }
    }
  return (
    <nav className='navbar'>
        <FormHeader/>

        <ul className='nav-links'>
            
            <li className='nav-item'>
                <div className='logo'>
                    <img src={home_icon}/>
                </div>
                <a>Home</a>
            </li>

            <li className='nav-item'>
                <div className='logo'>
                    <img src={search_icon}/>
                </div>
                <a>Search</a>
            </li>

            <li className='nav-item'>
                <div className='logo'>
                    <img src={reels_icon}/>
                </div>
                <a>Reels</a>
            </li>

            <li className='nav-item'>
                <div className='logo'>
                    <img src={messages_icon}/>
                </div>
                <a>Messages</a>
            </li>

            <li className='nav-item'>
                <div className='logo'>
                    <img src={notifications_icon}/>
                </div>
                <a>Notifications</a>
            </li>

            <li className='nav-item'>
                <div className='logo'>
                    <img src={profile_icon}/>
                </div>
                <a>Profile</a>
            </li>
            <li className='nav-item' onClick={handleLogout}>
                <div className='logo'>
                    <img src={logout_icon}/>
                </div>
                <a onClick={handleLogout}>Logout</a>
            </li>
        </ul>

      
    </nav>
  )
}

export default Navbar
