
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, NewsArticle } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import Header from './components/Header';
import HomeScreen from './components/HomeScreen';
import BrewingScreen from './components/BrewingScreen';
import NewsScreen from './components/NewsScreen';
import SettingsModal from './components/SettingsModal';
import AboutModal from './components/AboutModal';
import ChatBot from './components/ChatBot';
import { ChatBubbleIcon } from './components/icons';
import { getNewsSummaries } from './services/geminiService';

function App() {
  const [appState, setAppState] = useState<AppState>(AppState.Home);
  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>('daily-drip-dark-mode', true);
  const [brewedToday, setBrewedToday] = useLocalStorage<boolean>('daily-drip-brewed', false);
  const [lastBrewDate, setLastBrewDate] = useLocalStorage<string>('daily-drip-last-brew', '');
  const [news, setNews] = useLocalStorage<NewsArticle[]>('daily-drip-news', []);
  const [starredNews, setStarredNews] = useLocalStorage<NewsArticle[]>('daily-drip-starred', []);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    if (lastBrewDate !== today) {
      setBrewedToday(false);
      setNews([]);
    }
  }, [lastBrewDate, setBrewedToday, setNews]);
  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleBrew = async () => {
    setError(null);
    setAppState(AppState.Brewing);
    try {
      const articles = await getNewsSummaries();
      const articlesWithState = articles.map(a => ({ ...a, isStarred: false }));
      setNews(articlesWithState);
      setAppState(AppState.News);
      setBrewedToday(true);
      setLastBrewDate(new Date().toLocaleDateString());
    } catch (err) {
      console.error(err);
      setError("Failed to brew your daily drip. This may be due to an invalid API key or network issues. Please try again later.");
      setAppState(AppState.Home);
    }
  };

  const handleBrewAgain = () => {
    setNews([]);
    setBrewedToday(false);
    setAppState(AppState.Home);
  };
  
  const toggleStar = (headline: string) => {
    const updatedNews = news.map(article =>
      article.headline === headline ? { ...article, isStarred: !article.isStarred } : article
    );
    setNews(updatedNews);

    const articleToToggle = updatedNews.find(a => a.headline === headline);
    if (articleToToggle?.isStarred) {
      setStarredNews([...starredNews, articleToToggle]);
    } else {
      setStarredNews(starredNews.filter(a => a.headline !== headline));
    }
  };

  const goToHome = () => {
    setAppState(AppState.Home);
    setError(null);
  };

  return (
    <div className="bg-off-white dark:bg-coffee-dark min-h-screen font-sans text-coffee-dark dark:text-cream transition-colors duration-300">
      <Header 
        isBrewed={brewedToday} 
        onSettingsClick={() => setIsSettingsOpen(true)}
        onAboutClick={() => setIsAboutOpen(true)}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onHomeClick={goToHome}
      />
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        {appState === AppState.Home && <HomeScreen onBrew={handleBrew} error={error} />}
        {appState === AppState.Brewing && <BrewingScreen />}
        {appState === AppState.News && (
          <NewsScreen 
            news={news} 
            onBrewAgain={handleBrewAgain} 
            toggleStar={toggleStar}
          />
        )}
      </main>
      
      {isSettingsOpen && (
        <SettingsModal 
          isOpen={isSettingsOpen}
          onClose={() => { setIsSettingsOpen(false); setError(null); }}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          starredNews={starredNews}
        />
      )}

      {isAboutOpen && (
        <AboutModal 
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
        />
      )}

      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-cream dark:bg-coffee-light text-coffee-dark dark:text-cream p-4 rounded-full shadow-lg hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-cream-dark dark:focus:ring-coffee-mid"
        aria-label="Open Chat"
      >
        <ChatBubbleIcon className="w-8 h-8" />
      </button>

      {isChatOpen && (
        <ChatBot 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
