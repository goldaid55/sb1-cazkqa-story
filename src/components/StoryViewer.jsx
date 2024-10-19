import React, { useRef, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { FaDownload, FaArrowLeft } from 'react-icons/fa';

function StoryViewer({ story, goBack }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5; // Установите громкость на 50%
    }
  }, [story]);

  if (!story) return null;

  const downloadImage = async () => {
    const element = document.getElementById('story-image');
    if (element) {
      const dataUrl = await toPng(element);
      saveAs(dataUrl, 'story-image.png');
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
      <h2 className="text-3xl mb-6 font-bold text-center text-purple-800">{story.title}</h2>
      <div id="story-image" className="relative mb-6" style={{width: '100%', height: '400px'}}>
        {story.mediaType === 'image' ? (
          <img src={story.media} alt="Story background" className="w-full h-full object-cover rounded-lg" />
        ) : (
          <video src={story.media} className="w-full h-full object-cover rounded-lg" autoPlay loop muted controls />
        )}
        <div 
          className={`absolute inset-0 flex items-center p-6 ${
            story.textPosition === 'left' ? 'justify-start' :
            story.textPosition === 'right' ? 'justify-end' : 'justify-center'
          }`}
        >
          <div
            className="text-center max-w-full break-words"
            style={{
              fontFamily: story.font,
              fontSize: `${story.fontSize}px`,
              color: story.textColor,
              textShadow: `2px 2px 4px ${story.gradientColor1}, -2px -2px 4px ${story.gradientColor2}`,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              maxWidth: '90%'
            }}
          >
            {story.content}
          </div>
        </div>
      </div>
      {story.music && (
        <div className="mb-4">
          <audio ref={audioRef} src={story.music} controls className="w-full" />
        </div>
      )}
      <div className="flex justify-center space-x-4">
        <button
          onClick={downloadImage}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline flex items-center transition duration-300 ease-in-out transform hover:scale-105"
        >
          <FaDownload className="mr-2" />
          Скачать изображение
        </button>
        <button
          onClick={goBack}
          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline flex items-center transition duration-300 ease-in-out transform hover:scale-105"
        >
          <FaArrowLeft className="mr-2" />
          Назад к историям
        </button>
      </div>
    </div>
  );
}

export default StoryViewer;