
import React from 'react';
import { CoffeeCupIcon, MoonIcon, SunIcon } from './icons';

interface HeaderProps {
  isBrewed: boolean;
  onSettingsClick: () => void;
  onAboutClick: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onHomeClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ isBrewed, onSettingsClick, onAboutClick, isDarkMode, toggleDarkMode, onHomeClick }) => {
  return (
    <header className="bg-off-white/80 dark:bg-coffee-mid/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <button onClick={onHomeClick} className="flex items-center space-x-2 text-left p-1 -ml-1 rounded-md focus:outline-none focus:ring-2 focus:ring-cream-dark dark:focus:ring-coffee-mid">
            <CoffeeCupIcon className="w-8 h-8 text-coffee-light dark:text-cream" checked={isBrewed} />
            <h1 className="text-xl font-serif font-bold text-coffee-dark dark:text-cream hidden sm:block">Daily Drip</h1>
          </button>
          <nav className="flex items-center space-x-4 md:space-x-6 text-sm font-medium text-coffee-light dark:text-cream-dark">
            <button onClick={onAboutClick} className="hover:text-coffee-dark dark:hover:text-cream transition-colors">About</button>
            <button onClick={onSettingsClick} className="hover:text-coffee-dark dark:hover:text-cream transition-colors">Settings</button>
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
              {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
