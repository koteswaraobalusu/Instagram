import React from 'react'
import './suggestfollowers.css';
import { useUsersQuery } from '../../api/userAuthenticationApi';
import kotes from'../../assets/koteswararao.jpg';


const SuggestFollowers = () => {
    const {data}=useUsersQuery();
    console.log(data)

  return (
    <div className='suggest-followers'>
        <div className='followers-heading'>
            <h2>Suggest followers</h2>
            <button className='switch-btn'>See all</button>
        </div>
        <div className='users'>

           {
                data && Array.isArray(data.users) && data.users.length === 0 && <p className='no-suggest'>No suggested users</p>
            }

    
            {data?.users?.map((user) => (
                <div className='user-follow' key={user.id}>
                    <div className='user-switch'>
                                <div className='user-profile-ring'>
                                    <img src={kotes} className='user-profile-img'/>
                                </div>
                                <div className='post-user-details'>
                                    <h4>kotes</h4>
                                    <p>{user.email}</p>
                                </div>
                            </div>
                    
                            <div className='post-user-follow-btn'>
                    
                                <button className='switch-btn'>Follow</button>
                    
                            </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default SuggestFollowers