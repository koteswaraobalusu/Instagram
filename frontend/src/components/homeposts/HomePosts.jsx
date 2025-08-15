import React, { useState } from 'react';
import './homeposts.css';
import kotes from '../../assets/koteswararao.jpg';
import like_logo from '../../assets/like_logo.png';
import comment_logo from '../../assets/comment_logo.png';
import share_logo from '../../assets/share_logo.png';
import download_logo from '../../assets/download_logo.png';
import { useUserPostsQuery } from '../../api/userAuthenticationApi';
import profile_logo from '../../assets/profile_logo.png';
import PostMediaCarousel from '../mediacarousel/PostMediaCaurosel';





const HomePosts = () => {
    const [postbtn,setPostbtn]=useState(false);

    const {data,isLoading,isError}=useUserPostsQuery();
    console.log(data)
    

    const handleComment=(e)=>{
        if(e.target.value===""){
            setPostbtn(false)
        }
        setPostbtn(true)

    }
    {
        isLoading && <p>Loading....</p>
    }
    {
        isError && <p>something went wrong</p>
    }
   
  return (
    <div>
        <div className='user-posts'>

            {
                data && data.map((post,id)=>(
                    <>

                        <div className="post-user-info" key={post.post_id}>
                            <div className='user-details'>
                                <div className='user-profile-ring'>
                                    <img src={post.user.profile_picture==null?profile_logo:`http://localhost:8000/${post.user.profile_picture}`} className='user-profile-img'/>
                                </div>
                                <div className='post-user-details-info'>
                                    <h3>{post.user.username}</h3>
                                    <p>Hyderabad,Telangana</p>
                                </div>
                            </div>
                            <div>
                                <div className='post-user-follow-btn'>

                                    <button className='follow-btn'>Follow</button>

                                </div>
                            </div>
                        </div>
                        
      
                        <div className='user-uploaded-post'>
                           
                                <div key={post.post_id}>
                                    <PostMediaCarousel mediaFiles={post.media_files} />
                                </div>
                            
                            
                        </div>
                        <div className='post-details'>
                            <div>
                                <img src={like_logo} className='action-logo'/>
                                <img src={comment_logo} className='action-logo'/>
                                <img src={share_logo} className='action-logo'/>
                            </div>
                            <div>
                                <img src={download_logo} className='action-logo'/>
                            </div>

                        </div>
                        <div className='post-comment'>
                            <input type='text' placeholder='Add a comment...' onChange={handleComment}/>
                            {postbtn && (<button className="post-btn">Post</button>)}
                        </div>
                        <div className='border'>

                        </div>
                        
                    

                </>
                ))
            }
    </div>
    </div>
  )
}

export default HomePosts
