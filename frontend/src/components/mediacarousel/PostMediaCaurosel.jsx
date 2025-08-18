import React, { useState } from 'react';
import './postmediacaurosel.css'
const PostMediaCarousel = ({ mediaFiles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaFiles.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? mediaFiles.length - 1 : prev - 1
    );
  };

  if (!mediaFiles || mediaFiles.length === 0) {
    return null;
  }

  return (
    <div className="media-carousel">
        <button onClick={handlePrev}>⟨</button>
      <img
        src={`${mediaFiles[currentIndex].file}`}
        alt={`Media ${currentIndex + 1}`}
        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
      />
      <button onClick={handleNext}>⟩</button>
      

      {/* <div style={{ marginTop: '10px' }}>
        <button onClick={handlePrev}>⟨ Prev</button>
        <span style={{ margin: '0 10px' }}>
          {currentIndex + 1}/{mediaFiles.length}
        </span>
        <button onClick={handleNext}>Next ⟩</button>
      </div> */}
    </div>
  );
};
export default PostMediaCarousel