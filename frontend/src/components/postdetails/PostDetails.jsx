import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BASE_URL = 'http://localhost:8000';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/posts/post/${postId}`);
        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error('Failed to fetch post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  const mediaFiles = post.media_files || [];
  const currentFile = mediaFiles[currentIndex]?.file;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaFiles.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? mediaFiles.length - 1 : prev - 1
    );
  };

  if (loading) return <p>Loading...</p>;
  if (!post || Object.keys(post).length === 0) return <p>Post not found.</p>;
  if (!currentFile) return <p>No media available.</p>;

  return (
    <div className="media-carousel">
      <button onClick={handlePrev}>⟨</button>
      <img
        src={`${BASE_URL}${currentFile}`}
        alt={`Media ${currentIndex + 1}`}
        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
      />
      <button onClick={handleNext}>⟩</button>
    </div>
  );
};

export default PostDetails;
