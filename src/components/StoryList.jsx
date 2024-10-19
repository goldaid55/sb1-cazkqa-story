import React from 'react';
import { FaEye } from 'react-icons/fa';

function StoryList({ stories, viewStory }) {
  return (
    <div className="bg-gradient-to-r from-purple-100 to-pink-100 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
      <h2 className="text-3xl mb-6 font-bold text-center text-purple-800">Мои истории</h2>
      {stories.length === 0 ? (
        <p className="text-center text-gray-600">У вас пока нет созданных историй.</p>
      ) : (
        <ul className="space-y-4">
          {stories.map((story) => (
            <li key={story.id} className="bg-white bg-opacity-70 rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out hover:shadow-xl">
              <div className="flex items-center p-4">
                {story.media && (
                  <div className="w-24 h-24 flex-shrink-0 mr-4">
                    {story.mediaType === 'image' ? (
                      <img 
                        src={story.media} 
                        alt="Story thumbnail" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <video 
                        src={story.media} 
                        className="w-full h-full object-cover rounded-lg"
                        muted
                      />
                    )}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-purple-800 truncate">{story.title}</p>
                  <p className="text-sm text-gray-600 truncate" style={{ fontFamily: story.font }}>
                    {story.content.substring(0, 50)}...
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => viewStory(story)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:scale-105"
                  >
                    <FaEye className="mr-2" />
                    Просмотр
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StoryList;