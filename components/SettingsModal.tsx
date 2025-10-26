
import React, { useState, useEffect } from 'react';
import { CloseIcon, CheckIcon, XIcon, SunIcon, MoonIcon } from './icons';
import { NewsArticle } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  starredNews: NewsArticle[];
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, isDarkMode, toggleDarkMode, starredNews 
}) => {
  const [view, setView] = useState<'settings' | 'saved'>('settings');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-off-white dark:bg-coffee-dark rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-fade-in-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-cream dark:border-coffee-light flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold text-coffee-dark dark:text-cream">Settings</h2>
          <button onClick={onClose} className="text-coffee-light dark:text-cream-dark hover:text-coffee-dark dark:hover:text-cream">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-2 bg-cream/50 dark:bg-coffee-mid/50 border-b border-cream dark:border-coffee-light">
            <div className="flex justify-center space-x-2">
                <button 
                    onClick={() => setView('settings')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${view === 'settings' ? 'bg-cream dark:bg-coffee-light text-coffee-dark dark:text-cream' : 'text-coffee-light dark:text-cream-dark hover:bg-cream/50 dark:hover:bg-coffee-light/50'}`}
                >
                    General
                </button>
                <button 
                    onClick={() => setView('saved')}
                    className={`px-4 py-2 rounded-md text-sm font-medium ${view === 'saved' ? 'bg-cream dark:bg-coffee-light text-coffee-dark dark:text-cream' : 'text-coffee-light dark:text-cream-dark hover:bg-cream/50 dark:hover:bg-coffee-light/50'}`}
                >
                    Saved Brews ({starredNews.length})
                </button>
            </div>
        </div>

        <div className="p-6 overflow-y-auto">
          {view === 'settings' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-coffee-dark dark:text-cream mb-2">
                  Morning / Evening Mode
                </label>
                <button 
                  onClick={toggleDarkMode}
                  className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-coffee-mid border border-cream-dark dark:border-coffee-light rounded-md"
                >
                  <div className="flex items-center space-x-2">
                    {isDarkMode ? <MoonIcon className="w-5 h-5" /> : <SunIcon className="w-5 h-5" />}
                    <span>{isDarkMode ? 'Evening Mode' : 'Morning Mode'}</span>
                  </div>
                  <div className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out ${isDarkMode ? 'bg-coffee-light' : 'bg-cream-dark'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${isDarkMode ? 'translate-x-6' : ''}`}></div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
             <div className="space-y-4">
               {starredNews.length === 0 ? (
                 <p className="text-center text-coffee-light dark:text-cream-dark py-8">You have no saved brews.</p>
               ) : (
                 starredNews.map((article, index) => (
                   <div key={index} className="bg-white dark:bg-coffee-mid/50 p-3 rounded-md">
                     <h4 className="font-bold text-coffee-dark dark:text-cream">{article.headline}</h4>
                     <a href={article.source} target="_blank" rel="noopener noreferrer" className="text-xs text-coffee-light dark:text-cream-dark hover:underline">
                       Read source
                     </a>
                   </div>
                 ))
               )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};


const styles = `
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.3s ease-out forwards;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


export default SettingsModal;
