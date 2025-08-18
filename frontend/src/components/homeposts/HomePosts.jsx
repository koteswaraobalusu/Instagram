import React, { useState ,useEffect} from 'react';
import './homeposts.css';
import kotes from '../../assets/koteswararao.jpg';
import like_logo from '../../assets/like_logo.png';
import comment_logo from '../../assets/comment_logo.png';
import share_logo from '../../assets/share_logo.png';
import download_logo from '../../assets/download_logo.png';
import { useLikepostMutation, usePostCommentsMutation, useUnlikepostMutation, useUserFollowRequestMutation, useUserPostsQuery, useUserUnFollowRequestMutation } from '../../api/userAuthenticationApi';
import profile_logo from '../../assets/profile_logo.png';
import PostMediaCarousel from '../mediacarousel/PostMediaCaurosel';
import PostComments from '../postcomments/PostComments';
import { useNavigate } from 'react-router-dom';





const HomePosts = () => {
    const [postbtn,setPostbtn]=useState(false);
    const [commentText, setCommentText] = useState('');
    const [postBtn, setPostBtn] = useState(false);
    const [likesData, setLikesData] = useState({});
    const {data,isLoading,isError}=useUserPostsQuery();
    const [followRequest]=useUserFollowRequestMutation();
    const [unfollowRequest]=useUserUnFollowRequestMutation();
    const [followStatus,setFollowStatus]=useState({});
    const [likePost]=useLikepostMutation();
    const [unlikePost]=useUnlikepostMutation();
    const [postComments]=usePostCommentsMutation();
    const [displayComments,setDisplayComments]=useState(false);
    const [comments,setComments]=useState({});

    const navigate=useNavigate();
    console.log(data)
    
    const handleComment = (e) => {
        const value = e.target.value;
        setCommentText(value);
        setPostBtn(value.trim().length > 0);
    };
    const handlePostComment = () => {
        if (commentText.trim() === '') return;

        // Call your API or update state
        console.log('Posting comment:', commentText);

        // Reset input
        setCommentText('');
        setPostBtn(false);
    };
    const handleFollowRequest=async (id)=>{
        try{
            const res=await followRequest({'id':id}).unwrap();
            if(res){
                setFollowStatus((prev)=>({...prev, [id]: false}))
            }
        }
        catch(err){
            console.log(err)
        }
    }
    const handleUnFollowRequest= async(id)=>{
        try{
            const res=await unfollowRequest({'id':id}).unwrap();
            if(res){
                setFollowStatus((prev)=>({...prev, [id]: true}))

            }
        }
        catch(err){
            console.log(err)
        }
    }


    // const handleDownloadMedia = (media_files) => {
    //     media_files.forEach((media) => {
    //         const link = document.createElement('a');
    //         link.href = media.file; // ⬅️ get the actual file URL
    //         link.download = media.file.split('/').pop(); // ⬅️ use filename from URL
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     });
    // };

    const handleDownloadMedia = async (media_files) => {
        for (const media of media_files) {
            const fileUrl = media.file;
            try {
                const response = await fetch(fileUrl, {
                    mode: 'cors',
                    // If using authentication, add headers here
                    // headers: { Authorization: 'Bearer token' }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch ${fileUrl}`);
                }

                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = fileUrl.split('/').pop(); // Optional: provide a filename
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
            } catch (error) {
                console.error('Download error:', error);
                alert('Failed to download media.');
            }
        }
    };

    const handleLike=async (post_id)=>{
        try{
            const res=await likePost({'post_id':post_id})
            if (res){
                console.log(res)
            }
        }
        catch(err){
            console.log(err)
        }
    }

    useEffect(() => {
                if (data && data.posts) {
                    const initialLikes = {};
                    data.posts.forEach(post => {
                    initialLikes[post.post_id] = {
                        count: post.likes_count,
                        isLiked: post.is_liked,  // if you have this flag in response
                    };
                });
                setLikesData(initialLikes);
            }
        }, [data]);
    const toggleLike = async (post_id) => {
        const current = likesData[post_id];

        if (!current) return;

        const updated = { ...likesData };

        try {
            if (current.isLiked) {
            await unlikePost({ post_id }).unwrap();
            updated[post_id] = {
                count: current.count - 1,
                isLiked: false,
            };
            } else {
            await likePost({ post_id }).unwrap();
            updated[post_id] = {
                count: current.count + 1,
                isLiked: true,
            };
            }
            setLikesData(updated);
        } catch (err) {
            console.error("Like/unlike failed", err);
        }
    };

    const getComments=async (post_id)=>{

        try{
            const res=await postComments({'post_id':post_id})
            if(res){
                console.log(res.data)
                setDisplayComments(true)
                setComments(res.data)
                
            }
        }
        catch(err){
            console.log(err)
        }

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
                data && data.posts.map((post,id)=>(
                    <>

                        <div className="post-user-info" key={post.post_id}>
                            <div className='user-details'>
                                <div className='user-profile-ring'>
                                    <img src={post.user.profile_picture==null?profile_logo:`${post.user.profile_picture}`} className='user-profile-img'/>
                                </div>
                                <div className='post-user-details-info'>
                                    <h3>{post.user.username}</h3>
                                    <p>Hyderabad,Telangana</p>
                                </div>
                            </div>
                            <div>
                                <div className='post-user-follow-btn'>

                                    {
                                        post.user.id===data.user.id ? ``:
                                        followStatus[id] || post.is_following ? (
                                            <button className="switch-btn" onClick={() => handleUnFollowRequest(post.user.id)}>Following</button>
                                        ) : (
                                            <button className="switch-btn" onClick={() => handleFollowRequest(post.user.id)}>Follow</button>
                                        )
                                    
                                    }

                                    
                                    {/* {
                                        followStatus[id] || post.is_following ? (
                                            <button className="switch-btn" onClick={() => handleUnFollowRequest(post.user.id)}>Following</button>
                                        ) : (
                                            <button className="switch-btn" onClick={() => handleFollowRequest(post.user.id)}>Follow</button>
                                        )
                                    } */}



                                </div>
                            </div>
                        </div>
                        
      
                        <div className='user-uploaded-post'>
                           
                                <div key={post.post_id}>
                                    <PostMediaCarousel mediaFiles={post.media_files} />
                                    
                                </div>
                            
                            
                        </div>
                        <div className='post-details'>
                            <div className='post-actions-left'>
                                {/* <button className='action-button' onClick={()=>{handleLike(post.post_id)}} onDoubleClick={()=>{handleUnlikePost}}>
                                <img src={like_logo} className='action-logo' alt='Like' />
                                <p>{post.likes_count}</p>
                                </button> */}
                                <button className='action-button'
                            onClick={() => toggleLike(post.post_id)}
                            >
                            <img
                                src={like_logo}
                                className='action-logo'
                                alt='Like'
                                style={{
                                            filter: likesData[post.post_id]?.isLiked ? 'none' : 'grayscale(100%)',
                                            transform: likesData[post.post_id]?.isLiked ? 'scale(1.1)' : 'scale(1)',
                                            transition: 'all 0.2s ease'
                                        }}
                            />
                            <p>{likesData[post.post_id]?.count ?? post.likes_count}</p>
                            </button>

                                <button className='action-button' onClick={()=>{getComments(post.post_id)}}>
                                <img src={comment_logo} className='action-logo' alt='Comment' />
                                </button>
                                <button className='action-button'>
                                <img src={share_logo} className='action-logo' alt='Share' />
                                </button>
                            </div>
                            <div className='post-actions-right'>
                                <button className='action-button' onClick={()=>handleDownloadMedia(post.media_files)}>
                                <img src={download_logo} className='action-logo' alt='Download' />
                                </button>
                            </div>
                        </div>

                        <div className='post-comment'>
                            <input
                                type='text'
                                placeholder='Add a comment...'
                                value={commentText}
                                onChange={handleComment}
                            />
                            {postBtn && (
                                <button className='post-btn' onClick={handlePostComment}>
                                Post
                                </button>
                            )}
                        </div>
                        <div className='border'></div>
                        
                        <div>
                            {
                                displayComments && comments?.comments?.map((comment)=>(
                                    <>
                                        <p>{comment.comment}</p>
                                    </>
                                ))
                            }

                        </div>
                </>
                ))
            }
    </div>
    </div>
  )
}

export default HomePosts
