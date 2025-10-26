
import React, { useState } from 'react';
import { NewsArticle } from '../types';
import { SpeakerIcon, StarIcon } from './icons';
import { textToSpeech, decode, decodeAudioData } from '../services/geminiService';

interface NewsCardProps {
  article: NewsArticle;
  toggleStar: (headline: string) => void;
}

// Global audio context to avoid creating multiple contexts
let audioContext: AudioContext | null = null;
const getAudioContext = () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContext;
};


const NewsCard: React.FC<NewsCardProps> = ({ article, toggleStar }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVoiceBrew = async () => {
    if (isSpeaking) return;

    setIsSpeaking(true);
    setError(null);
    try {
      const textToRead = `${article.headline}. ${article.summary}`;
      const base64Audio = await textToSpeech(textToRead);
      const audioBytes = decode(base64Audio);
      const ctx = getAudioContext();
      const audioBuffer = await decodeAudioData(audioBytes, ctx);
      
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.start();
      source.onended = () => setIsSpeaking(false);

    } catch (err) {
      console.error(err);
      setError("Could not play audio.");
      setIsSpeaking(false);
    }
  };


  return (
    <div className="bg-off-white dark:bg-coffee-mid p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 relative">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold font-serif text-coffee-dark dark:text-cream pr-12">
          {article.headline}
        </h3>
        <button onClick={() => toggleStar(article.headline)} className="absolute top-4 right-4 text-coffee-light dark:text-cream-dark hover:text-amber-500 dark:hover:text-amber-400 transition-colors">
          <StarIcon className="w-6 h-6" filled={article.isStarred} />
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-3">
         <div className="flex space-x-2 text-sm">
            {article.tags.map((tag, i) => <span key={i}>{tag}</span>)}
          </div>
        <button onClick={handleVoiceBrew} disabled={isSpeaking} className="flex items-center space-x-1 text-sm text-coffee-light dark:text-cream-dark hover:text-coffee-dark dark:hover:text-cream disabled:opacity-50 transition-colors">
          <SpeakerIcon className={`w-5 h-5 ${isSpeaking ? 'animate-pulse text-amber-500' : ''}`} />
          <span>{isSpeaking ? 'Playing...' : 'Voice Brew'}</span>
        </button>
      </div>
      
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

      <p className="text-base text-coffee-light dark:text-cream-dark mb-4">
        {article.summary}
      </p>

      <a href={article.source} target="_blank" rel="noopener noreferrer" className="text-sm text-coffee-light dark:text-cream-dark hover:underline">
        Source
      </a>
    </div>
  );
};

export default NewsCard;
