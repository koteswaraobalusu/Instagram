import React, { use } from 'react'
import './homepage.css';
import { useProtectedQuery,useUserLogoutMutation } from '../../api/userAuthenticationApi';
import FormButton from '../../components/formButtons/FormButton';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar';
import HomePosts from '../../components/homeposts/HomePosts';
import UserSuggest from '../../components/userssuggest/UserSuggest';
import SuggestFollowers from '../../components/suggestfollowers/SuggestFollowers';


const HomePage = () => {
    const { data, isLoading, isError } = useProtectedQuery();
    const navigate = useNavigate();
    
    
  return (
    <div className='page-container'>
        <Navbar/>

        
        <div className='posts-display'>
      
          <HomePosts/>
        </div>

        <div className='user-suggestions'>
          <UserSuggest/>
          <SuggestFollowers/>
        </div>
        
        
    </div>
  )
}

export default HomePage
