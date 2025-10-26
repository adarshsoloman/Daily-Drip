
import React from 'react';
import { NewsArticle } from '../types';
import NewsCard from './NewsCard';
import { DownloadIcon, RefreshIcon } from './icons';

interface NewsScreenProps {
  news: NewsArticle[];
  onBrewAgain: () => void;
  toggleStar: (headline: string) => void;
}

const NewsScreen: React.FC<NewsScreenProps> = ({ news, onBrewAgain, toggleStar }) => {
  const today = new Date();
  const dateString = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const exportNews = () => {
    const content = news.map(article => 
      `Headline: ${article.headline}\nTags: ${article.tags.join(' ')}\nSummary: ${article.summary}\nSource: ${article.source}\n\n`
    ).join('');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DailyDrip-${dateString}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-coffee-dark dark:text-cream">
          {dateString} - Your Daily Drip
        </h2>
        <button onClick={onBrewAgain} className="text-sm text-coffee-light dark:text-cream-dark hover:text-coffee-dark dark:hover:text-cream transition-colors mt-1 group flex items-center space-x-1.5">
          <RefreshIcon className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
          <span>Brew Again?</span>
        </button>
      </div>

      <div className="space-y-6">
        {news.map((article, index) => (
          <NewsCard 
            key={index} 
            article={article} 
            toggleStar={toggleStar}
          />
        ))}
      </div>

      <div className="mt-12 text-center">
        <button 
          onClick={exportNews}
          className="bg-cream dark:bg-coffee-light text-coffee-dark dark:text-cream font-bold py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center space-x-2 mx-auto"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Export Daily Drip</span>
        </button>
      </div>
    </div>
  );
};


const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


export default NewsScreen;
