import React, { useState, useEffect } from 'react';
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/clerk-react";
import { FaInstagram, FaUser, FaPencilAlt, FaBook } from 'react-icons/fa';
import StoryCreator from './components/StoryCreator';
import StoryList from './components/StoryList';
import StoryViewer from './components/StoryViewer';

function App() {
  const [stories, setStories] = useState([]);
  const [currentView, setCurrentView] = useState('create');
  const [selectedStory, setSelectedStory] = useState(null);

  useEffect(() => {
    // Загрузка сохраненных историй из localStorage при инициализации
    const savedStories = JSON.parse(localStorage.getItem('stories') || '[]');
    setStories(savedStories);
  }, []);

  const addStory = (newStory) => {
    const updatedStories = [...stories, { ...newStory, id: Date.now() }];
    setStories(updatedStories);
    // Сохранение обновленного списка историй в localStorage
    localStorage.setItem('stories', JSON.stringify(updatedStories));
  };

  const viewStory = (story) => {
    setSelectedStory(story);
    setCurrentView('view');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-indigo-200 text-gray-900">
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-6 shadow-lg flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center">
          <FaInstagram className="mr-3" />
          Story Creation App
        </h1>
        <SignedOut>
          <SignInButton mode="modal">
            <button className="bg-white text-purple-600 font-bold py-2 px-4 rounded-full hover:bg-purple-100 transition duration-300 flex items-center">
              <FaUser className="mr-2" />
              Войти
            </button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </header>
      <nav className="bg-white bg-opacity-80 shadow-md p-4 flex justify-center">
        <button
          onClick={() => setCurrentView('create')}
          className={`mr-4 px-6 py-3 rounded-full transition duration-300 ease-in-out ${currentView === 'create' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
        >
          <FaPencilAlt className="inline mr-2" />
          Create
        </button>
        <button
          onClick={() => setCurrentView('list')}
          className={`px-6 py-3 rounded-full transition duration-300 ease-in-out ${currentView === 'list' ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`}
        >
          <FaBook className="inline mr-2" />
          My Stories
        </button>
      </nav>
      <main className="container mx-auto mt-8 p-4">
        {currentView === 'create' && <StoryCreator addStory={addStory} />}
        {currentView === 'list' && <StoryList stories={stories} viewStory={viewStory} />}
        {currentView === 'view' && <StoryViewer story={selectedStory} goBack={() => setCurrentView('list')} />}
      </main>
    </div>
  );
}

export default App;