
import React, { useEffect } from 'react';
import { CloseIcon, CoffeeCupIcon } from './icons';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
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
          <h2 className="text-xl font-serif font-bold text-coffee-dark dark:text-cream">About Daily Drip</h2>
          <button onClick={onClose} className="text-coffee-light dark:text-cream-dark hover:text-coffee-dark dark:hover:text-cream">
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-coffee-light dark:text-cream-dark">
            <div className="text-center mb-6">
                <CoffeeCupIcon className="w-16 h-16 text-coffee-light dark:text-cream mx-auto" checked={true} />
            </div>
          <p>
            <strong>Daily Drip</strong> is your personal AI news barista, designed to serve you a fresh, concentrated shot of the day's most important technology news.
          </p>
          <p>
            In a world overflowing with information, Daily Drip cuts through the noise. It uses the power of Google's Gemini API to scan the latest headlines, intelligently summarizing the top 5 stories into concise, easy-to-digest drips.
          </p>
          <h4 className="font-bold text-coffee-dark dark:text-cream pt-2">Key Features:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>AI Summaries:</strong> Get the essence of the day's tech news without reading lengthy articles.</li>
            <li><strong>Voice Brew:</strong> Listen to your news summaries on the go with our text-to-speech feature.</li>
            <li><strong>Interactive Chat:</strong> Dive deeper into any topic with our integrated Gemini-powered chatbot. It can analyze images, perform grounded searches, and even use advanced reasoning.</li>
            <li><strong>Personalized Experience:</strong> Save your favorite articles, switch between morning and evening modes, and export your daily brew.</li>
          </ul>
           <p className="pt-4 italic text-center text-xs text-coffee-light/70 dark:text-cream-dark/70">
            Built with passion, powered by AI.
          </p>
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


export default AboutModal;
