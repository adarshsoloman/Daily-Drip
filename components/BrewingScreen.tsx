
import React, { useState, useEffect } from 'react';

const messages = [
  "Roasting insights...",
  "Clustering headlines...",
  "Pouring the drip...",
  "Your brew is nearly ready!"
];

const BrewingScreen: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[70vh]">
      <div className="relative w-48 h-48 mb-8">
        <div className="absolute inset-0 border-4 border-cream-dark/50 rounded-full animate-ping"></div>
        <div className="w-full h-full flex items-center justify-center bg-coffee-mid/50 rounded-full">
            <svg className="w-32 h-32 text-cream animate-pulse" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M80,75 C70,95 30,95 20,75 C10,55 20,30 50,30 C80,30 90,55 80,75 Z" fill="currentColor" />
              <path d="M50 30 C 50 20, 60 20, 60 30" stroke="currentColor" strokeWidth="4" fill="none" />
              <path d="M50 30 C 50 15, 65 15, 65 30" stroke="currentColor" strokeWidth="2" fill="none" />
            </svg>
        </div>
      </div>
      <div className="h-10">
        <p className="text-xl text-cream-dark animate-fade-in-out" key={messageIndex}>
          {messages[messageIndex]}
        </p>
      </div>
    </div>
  );
};

const styles = `
  @keyframes fade-in-out {
    0%, 100% { opacity: 0; transform: translateY(10px); }
    20%, 80% { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-out {
    animation: fade-in-out 2.5s ease-in-out infinite;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);


export default BrewingScreen;
