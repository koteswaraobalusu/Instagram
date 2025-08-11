import React, { useState } from 'react'
import './suggestfollowers.css';
import { useUsersQuery } from '../../api/userAuthenticationApi';
import kotes from'../../assets/koteswararao.jpg';
import close_logo from '../../assets/close_logo.png';
import profile_logo from '../../assets/profile_logo.png'


const SuggestFollowers = () => {
    const {data}=useUsersQuery();
    console.log(data)
    const [allSuggestedUsers,setAllSuggestedUsers]=useState(false);
    const usersToDisplay = allSuggestedUsers? data?.users: data?.users?.slice(0, 5);

    console.log(data)

  return (
    <>
        <div>
            {
                !allSuggestedUsers && (
                    <div className='suggest-followers'>
                        <div className='followers-heading'>
                            <h2>Suggest followers</h2>
                            <button className='switch-btn' onClick={()=>setAllSuggestedUsers(true)}>See all</button>
                        </div>
                        <div className='users'>

                        {
                                data && Array.isArray(data.users) && data.users.length === 0 && <p className='no-suggest'>No suggested users</p>
                        }

                    
                        { !allSuggestedUsers && data?.users?.slice(0,5).map((user) => (
                                <div className='user-follow' key={user.id}>
                                    <div className='user-switch'>
                                        <div className='user-profile-ring'>
                                            <img src={user.profile_picture===null?profile_logo:user.profile_picture} alt={user.username} className='user-profile-img'/>
                                        </div>
                                        <div className='post-user-details'>
                                            <h4>{user.username}</h4>
                                            <p>{user.email}</p>
                                        </div>
                                    </div>
                                    
                                    <div className='post-user-follow-btn'>
                            
                                        <button className='switch-btn'>Follow</button>
                            
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            )
        }
    {
        allSuggestedUsers && (
            <div className='suggest-followers'>
                <div className='followers-heading'>
                    <h2>Suggest followers</h2>
                    <button className='switch-btn' onClick={()=>setAllSuggestedUsers(false)}><img src={close_logo} alt='close'/></button>
                </div>
                <div className={`users ${allSuggestedUsers? `users-scroll`: ''}`}>

                    {
                        data && Array.isArray(data.users) && data.users.length === 0 && <p className='no-suggest'>No suggested users</p>
                    }

            
                    { allSuggestedUsers && data?.users?.map((user) => (
                            <div className='user-follow' key={user.id}>
                                <div className='user-switch'>
                                    <div className='user-profile-ring'>
                                        <img src={user.profile_picture===null?profile_logo:user.profile_picture} alt={user.username} className='user-profile-img'/>
                                    </div>
                                    <div className='post-user-details'>
                                        <h4>{user.username}</h4>
                                        <p>{user.email}</p>
                                    </div>
                                </div>
                                
                                <div className='post-user-follow-btn'>
                        
                                    <button className='switch-btn'>Follow</button>
                        
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
        </div>
    {/* <div className='suggest-followers'>
      <div className='followers-heading'>
                   <h2>Suggest followers</h2>
             <button className='switch-btn' onClick={()=>setAllSuggestedUsers(true)}>See all</button>
         </div>
         <div className='users'>

            {
                 data && Array.isArray(data.users) && data.users.length === 0 && <p className='no-suggest'>No suggested users</p>
             }

    
            { !allSuggestedUsers && data?.users?.slice(0,5).map((user) => (
                <div className='user-follow' key={user.id}>
                    <div className='user-switch'>
                                <div className='user-profile-ring'>
                                    <img src={kotes} className='user-profile-img'/>
                                </div>
                                <div className='post-user-details'>
                                     <h4>{user.username}</h4>
                                     <p>{user.email}</p>
                                 </div>
                             </div>
                    
                             <div className='post-user-follow-btn'>
                    
                                 <button className='switch-btn'>Follow</button>
                    
                             </div>
                </div>
             ))}
         </div>
     </div> */}
</>
  )
}

export default SuggestFollowers