import React, { useState } from 'react';
import './homeposts.css';
import kotes from '../../assets/koteswararao.jpg';
import like_logo from '../../assets/like_logo.png';
import comment_logo from '../../assets/comment_logo.png';
import share_logo from '../../assets/share_logo.png';
import download_logo from '../../assets/download_logo.png';





const HomePosts = () => {
    const [postbtn,setPostbtn]=useState(false);
    const handleComment=(e)=>{
        if(e.target.value===""){
            setPostbtn(false)
        }
        setPostbtn(true)

    }

  return (
    <div>
        <div className='user-posts'>
            <div className="post-user-info">
                <div className='user-profile-ring'>
                    <img src={kotes} className='user-profile-img'/>
                </div>
                <div className='post-user-details'>
                    <h3>kotes</h3>
                    <p>Hyderabad,Telangana</p>
                </div>
            </div>
            <div className='post-user-follow-btn'>

                <buttnon className='follow-btn'>Follow</buttnon>

            </div>
      
        </div>
        <div className='user-uploaded-post'>
            <img src={kotes}/>
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
    </div>
  )
}

export default HomePosts
