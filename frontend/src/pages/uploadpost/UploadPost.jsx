import React, { useState } from 'react'
import './uploadpost.css';
import media_logo from '../../assets/media_logo.png';
import arrow_left_logo from '../../assets/arrow_left_logo.png';
import arrow_right_logo from '../../assets/arrow_right_logo.png';
import { useCreate_post_idMutation, useUpload_postsMutation } from '../../api/userAuthenticationApi';
import { useNavigate } from 'react-router-dom';



const UploadPost = () => {
    const [mediaPreviews,setMediaPreviews]=useState([]);
    const [currentIndex,setCurrentIndex]=useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const navigate=useNavigate();

    const [create_post_id]=useCreate_post_idMutation();
    const [uploadPosts]=useUpload_postsMutation();
    const handleFileChange=(e)=>{
        const files=Array.from(e.target.files);
        console.log(files)
        const validFiles=files.filter((file)=>
            file.type.startsWith('image/') || file.type.startsWith('video/')

        );
        console.log(validFiles)
        const readFiles=validFiles.map((file)=>{
            return new Promise((resolve,reject)=>{
                const reader=new FileReader();
                reader.onload=()=>
                    resolve({
                        name:file.name,
                        type:file.type,
                        url:reader.result,
                        file:file,
                    });
                reader.onerror=()=>
                    reject(new Error('File read error'))
                reader.readAsDataURL(file);
            })
        })
        Promise.all(readFiles).then((results)=>{
            setMediaPreviews(results);
            setCurrentIndex(0)
        })
        .catch((err)=>console.error('Error reading files',err))
    }

    const showPrevious=()=>{
        setCurrentIndex((prev)=>(prev>0? prev-1:mediaPreviews.length-1))
    }
    const showNext=()=>{
        setCurrentIndex((prev)=>(prev<mediaPreviews.length-1?prev+1:0))
    }

    const uploadMediaPosts=async()=>{
        try{
            setIsUploading(true); // Start loader
            setUploadSuccess(false); 
            setUploadError(null)
            const res=await create_post_id();
            const postId=res.data.post_id;
            if(postId){
                    const formData = new FormData();
                    formData.append('post_id', postId);
                    mediaPreviews.forEach((media) => {
                    formData.append('media', media.file); // ✅ actual File object
                    });
                
               
                    const upload=await uploadPosts(formData).unwrap();
                 
    
                
                    setIsUploading(false);
                    setUploadSuccess(true);
                
                
            }

        }
        catch(err){
            setIsUploading(false);

            if (err?.data?.errors) {
                setUploadError(JSON.stringify(err.data.errors));
            } else if (err?.data?.error) {
                setUploadError(err.data.error);
            } else {
                setUploadError("Something went wrong while uploading. Please try again.");
            }
        }

    }
  return (
    <div className='upload-post'>
      <div className='create-post'>

        <div className='post-heading'>
            <h3>Create new post</h3>
            <button onClick={()=>{
                setMediaPreviews([]);
                setUploadSuccess(false);
                navigate('/')
                }}>Close</button>
        </div>

        
            

        <div className='post-data'>
            {isUploading ? (
                <div className="upload-loader">
                <div className="spinner"></div>
                <p>Uploading...</p>
                </div>
            ) : uploadSuccess ? (
                <div className="upload-success">
                <h4>Upload successful!</h4>
                <button onClick={() => {
                    setMediaPreviews([]);
                    setUploadSuccess(false);
                    navigate('/upload-post')
                }}>
                    Upload New Post
                </button>

                </div>
            ) : uploadError ? (
                <div className="upload-error">
                    <p>Error: {uploadError}</p>
                </div>
            ): mediaPreviews.length === 0 ? (
                <>
                <div className='media-logo'>
                    <img src={media_logo} alt='media-logo'/>
                </div>
                <p>Drag photos and videos here</p>
                <label htmlFor='upload-file' className='file-label'>Select from computer</label>
                <input type='file' id='upload-file' multiple style={{display:'none'}} onChange={handleFileChange}/>
    
                </>
            ) : (
                <>
                <button className='post-btn' onClick={uploadMediaPosts}>Post</button>
                <div className='media-carousel'>
                    <button className='nav-button' onClick={showPrevious}>
                    <img src={arrow_left_logo} alt='left-arrow'/>
                    </button>
                    <div className='media-preview'>
                    {mediaPreviews[currentIndex].type.startsWith('image/') ? (
                        <img src={mediaPreviews[currentIndex].url} alt='preview-img'/>
                    ) : (
                        <video src={mediaPreviews[currentIndex].url} controls width='100%' height='100%'/>
                    )}
                    </div>
                    <button className='nav-button' onClick={showNext}>
                    <img src={arrow_right_logo} alt='right-arrow'/>
                    </button>
                </div>
                </>
            )}
        </div>


        </div>

      </div>
 
  )
}

export default UploadPost
