import React from 'react';
import { CoffeeCupIcon, BrainIcon } from './icons';

interface HomeScreenProps {
  onBrew: () => void;
  error: string | null;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onBrew, error }) => {
  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[70vh]">
      <CoffeeCupIcon className="w-24 h-24 text-coffee-light dark:text-cream mb-6" checked={true} />
      <h1 className="text-5xl md:text-7xl font-serif font-bold text-coffee-dark dark:text-cream mb-4">
        Daily Drip
      </h1>
      <p className="text-lg md:text-xl text-coffee-light dark:text-cream-dark mb-8">
        Your daily cup of AI-powered news, summarized and served fresh.
      </p>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6 text-sm" role="alert">
          <p>{error}</p>
        </div>
      )}

      <button 
        onClick={onBrew}
        className="bg-cream dark:bg-coffee-light text-coffee-dark dark:text-cream font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 flex items-center space-x-2 group"
      >
        <span className="text-lg">BREW YOUR DAILY DRIP</span>
        <BrainIcon className="w-6 h-6 transform group-hover:rotate-12 transition-transform" />
      </button>

      <p className="text-xs text-coffee-light/50 dark:text-cream-dark/50 mt-4">
        Your daily dose awaits.
      </p>

      <footer className="absolute bottom-4 text-xs text-coffee-light/70 dark:text-cream-dark/70 italic">
        "Good ideas start with coffee; great ideas start with Daily Drip."
      </footer>
    </div>
  );
};

export default HomeScreen;