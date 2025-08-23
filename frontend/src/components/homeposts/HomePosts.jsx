import React, { useState ,useEffect} from 'react';
import './homeposts.css';
import kotes from '../../assets/koteswararao.jpg';
import like_logo from '../../assets/like_logo.png';
import comment_logo from '../../assets/comment_logo.png';
import share_logo from '../../assets/share_logo.png';
import download_logo from '../../assets/download_logo.png';
import { useLikepostMutation, usePostCommentsMutation, usePostDeleteMutation, useUnlikepostMutation, useUserFollowRequestMutation, useUserPostsQuery, useUserUnFollowRequestMutation } from '../../api/userAuthenticationApi';
import profile_logo from '../../assets/profile_logo.png';
import PostMediaCarousel from '../mediacarousel/PostMediaCaurosel';
import PostComments from '../postcomments/PostComments';
import { useNavigate } from 'react-router-dom';
import delete_logo from '../../assets/delete_logo.png';




const HomePosts = () => {
    const [postbtn,setPostbtn]=useState(false);
    const [commentText, setCommentText] = useState('');
    const [postBtn, setPostBtn] = useState(false);
    const [likesData, setLikesData] = useState({});
    const {data,isLoading,isError}=useUserPostsQuery();
    const [followRequest]=useUserFollowRequestMutation();
    const [unfollowRequest]=useUserUnFollowRequestMutation();
    const [followStatus,setFollowStatus]=useState({});
    const [commentsByPostId, setCommentsByPostId] = useState({});
    const [visibleCommentsPostId, setVisibleCommentsPostId] = useState(null);
    const [commentTextByPostId, setCommentTextByPostId] = useState({});
    const [postingCommentId, setPostingCommentId] = useState(null);
    const [likePost]=useLikepostMutation();
    const [unlikePost]=useUnlikepostMutation();
    const [postComments]=usePostCommentsMutation();
    const [displayComments,setDisplayComments]=useState(false);
    const [comments,setComments]=useState({});
    const [postdelete]=usePostDeleteMutation();
    const navigate=useNavigate();
    console.log(data)
    

    const handleDelete=async (post_id)=>{
        try{
            const res=await postdelete({'post_id':post_id});
            if(res){
                console.log('delete',res)
            }
        }
        catch(err){
            console.log(err)
                
        }


    }









    const handleComment = (e) => {
        const value = e.target.value;
        setCommentText(value);
        setPostBtn(value.trim().length > 0);
    };
//     const handlePostComment = async (post_id) => {
//     if (commentText.trim() === '') return;

//     try {
//         const res = await postComments({ post_id, comment: commentText }).unwrap();

//         if (res?.success) {
//             // Refresh comments for this post
//             await getComments(post_id);
//             setCommentText('');
//             setPostBtn(false);
//         }
//     } catch (error) {
//         console.error('Failed to post comment', error);
//     }
// };
//     const handlePostComment = async (post_id) => {
//   const commentText = commentTextByPostId[post_id];
//   if (!commentText || commentText.trim() === '') return;

//   try {
//     const res = await postComments({ post_id, comment: commentText }).unwrap();

//     if (res?.success) {
//       await getComments(post_id);
//       // Clear the input for this post
//       setCommentTextByPostId((prev) => ({
//         ...prev,
//         [post_id]: '',
//       }));
//     }
//   } catch (error) {
//     console.error('Failed to post comment', error);
//   }
// };

//     const handleFollowRequest=async (id)=>{
//         try{
//             const res=await followRequest({'id':id}).unwrap();
//             if(res){
//                 setFollowStatus((prev)=>({...prev, [id]: false}))
//             }
//         }
//         catch(err){
//             console.log(err)
//         }
//     }
//     const handleUnFollowRequest= async(id)=>{
//         try{
//             const res=await unfollowRequest({'id':id}).unwrap();
//             if(res){
//                 setFollowStatus((prev)=>({...prev, [id]: true}))

//             }
//         }
//         catch(err){
//             console.log(err)
//         }
//     }

    const handlePostComment = async (post_id) => {
  const commentText = commentTextByPostId[post_id];
  if (!commentText || commentText.trim() === '') return;

  try {
    setPostingCommentId(post_id); // ⏳ Set loading
    const res = await postComments({ post_id, comment: commentText }).unwrap();
    console.log(res)

    if (res?.success) {
      await getComments(post_id);
      setCommentTextByPostId((prev) => ({
        ...prev,
        [post_id]: '',
      }));
    }
  } catch (error) {
    console.error('Failed to post comment', error);
  } finally {
    setPostingCommentId(null); // ✅ Done
  }
};



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

    const getComments = async (post_id) => {
    try {
        const res = await postComments({ post_id }).unwrap();
        if (res) {
            setCommentsByPostId((prev) => ({
                ...prev,
                [post_id]: res.comments,
            }));
            setVisibleCommentsPostId(post_id);
        }
    } catch (err) {
        console.log(err);
    }
};
    

    const handleShare = async (post) => {
    const shareUrl = `${window.location.origin}/post/${post.post_id}`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: post.title || 'Check out this post!',
                text: post.content || '',
                url: shareUrl,
            });
            console.log('Shared successfully');
        } catch (error) {
            console.error('Share failed:', error);
        }
    } else {
        // Fallback: copy to clipboard
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
        } catch (err) {
            alert('Failed to copy the link.');
        }
    }
};
    
    
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
                                <button className='action-button' onClick={()=>{handleShare(post)}}>
                                <img src={share_logo} className='action-logo' alt='Share' />
                                </button>
                            </div>
                            <div className='post-actions-right'>
                                <button className='action-button' onClick={()=>handleDownloadMedia(post.media_files)}>
                                <img src={download_logo} className='action-logo' alt='Download' />
                                </button>
                                {
                                    post.user.id===data.user.id && (
                                        
                                            <button className='action-button' onClick={()=>handleDelete(post.post_id)}>
                                                <img src={delete_logo} className='action-logo' alt='Download' />
                                            </button>
                                        
                                    )
                                }
                                {/* <button className='action-button' onClick={()=>handleDelete(post.post_id)}>
                                <img src={delete_logo} className='action-logo' alt='Download' />
                                </button> */}
                            </div>
                        </div>

                        <div className='post-comment'>
                            * <input
                                type='text'
                                placeholder='Add a comment...'
                                value={commentText}
                                onChange={handleComment}
                            /> 
                            {/* <input
                                type='text'
                                placeholder='Add a comment...'
                                value={commentTextByPostId[post.post_id] || ''}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setCommentTextByPostId((prev) => ({
                                    ...prev,
                                    [post.post_id]: value,
                                    }));
                                }}
                                /> */}

                            {/* {postBtn && (
                                <button className='post-btn' onClick={()=>{handlePostComment(post.post_id)}}>
                                    Post
                                </button>
                            )} */}
                            {/* {(commentTextByPostId[post.post_id]?.trim().length > 0) && (
                                <button
                                    className='post-btn'
                                    onClick={() => handlePostComment(post.post_id)}
                                >
                                    Post
                                </button>
                                )} */}
                                <button
                                    className='post-btn'
                                    onClick={() => handlePostComment(post.post_id)}
                                    disabled={postingCommentId === post.post_id}
                                    >
                                    {postingCommentId === post.post_id ? 'Posting...' : 'Post'}
                                </button>


                        </div>
                        <div className='border'></div>
                        
                        <div>
                            {
                                visibleCommentsPostId === post.post_id &&
                                commentsByPostId[post.post_id]?.map((comment) => (
                                <p key={comment.id}>{comment.comment}</p>
                            ))}


                        </div>
                </>
                ))
            }
    </div>
    </div>
  )
}

export default HomePosts
