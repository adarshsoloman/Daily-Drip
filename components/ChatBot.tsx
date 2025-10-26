
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, GroundingSource } from '../types';
import { analyzeImage, generateChatResponseStream } from '../services/geminiService';
import { CloseIcon, SendIcon, PaperClipIcon, BrainIcon, SearchIcon, MapIcon, XIcon } from './icons';

interface ChatBotProps {
    isOpen: boolean;
    onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<{b64: string, type: string} | null>(null);

    const [useThinking, setUseThinking] = useState(false);
    const [useSearch, setUseSearch] = useState(false);
    const [useMaps, setUseMaps] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages, isLoading]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const b64 = (reader.result as string).split(',')[1];
                setImagePreview(reader.result as string);
                setUploadedImage({ b64, type: file.type });
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSend = useCallback(async () => {
        if (!input.trim() && !uploadedImage) return;

        const userInput: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            text: input,
            ...(imagePreview && { image: imagePreview })
        };

        setMessages(prev => [...prev, userInput]);
        const currentInput = input;
        const currentImage = uploadedImage;
        setInput('');
        setImagePreview(null);
        setUploadedImage(null);
        setIsLoading(true);

        const modelResponse: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: '',
            sources: [],
        };
        setMessages(prev => [...prev, modelResponse]);

        try {
            const history = messages.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.text }]
            }));
            
            if(currentImage) {
                const resultStream = await analyzeImage(currentInput, currentImage.b64, currentImage.type);
                for await (const chunk of resultStream) {
                    modelResponse.text += chunk.text;
                    setMessages(prev => prev.map(m => m.id === modelResponse.id ? {...modelResponse} : m));
                }
            } else {
                const stream = await generateChatResponseStream(history, currentInput, { useThinking, useSearch, useMaps });
                for await (const chunk of stream) {
                    modelResponse.text += chunk.text;
                    if(chunk.candidates?.[0]?.groundingMetadata?.groundingChunks){
                      const newSources: GroundingSource[] = chunk.candidates[0].groundingMetadata.groundingChunks
                        .map((c: any) => c.web || c.maps)
                        .filter(Boolean)
                        .map((s: any) => ({ title: s.title, uri: s.uri }))
                        // simple de-dupe
                        .filter((s: GroundingSource) => !modelResponse.sources?.some(es => es.uri === s.uri));

                      if(newSources.length > 0) {
                        modelResponse.sources = [...(modelResponse.sources || []), ...newSources];
                      }
                    }
                    setMessages(prev => prev.map(m => m.id === modelResponse.id ? {...modelResponse} : m));
                }
            }
        } catch (error) {
            console.error(error);
            modelResponse.text = "Sorry, I encountered an error. Please try again.";
            setMessages(prev => prev.map(m => m.id === modelResponse.id ? {...modelResponse} : m));
        } finally {
            setIsLoading(false);
        }
    }, [input, messages, uploadedImage, imagePreview, useThinking, useSearch, useMaps]);
    
    return (
        <div className={`fixed bottom-24 right-6 w-[90vw] max-w-sm h-[70vh] flex flex-col bg-off-white dark:bg-coffee-dark rounded-lg shadow-2xl z-50 transition-transform duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
            <header className="p-4 border-b border-cream dark:border-coffee-light flex justify-between items-center">
                <h3 className="font-serif font-bold text-lg text-coffee-dark dark:text-cream">Chat with Daily Drip</h3>
                <button onClick={onClose} className="text-coffee-light dark:text-cream-dark hover:text-coffee-dark dark:hover:text-cream">
                    <CloseIcon className="w-6 h-6" />
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-3 rounded-lg max-w-xs ${msg.role === 'user' ? 'bg-cream dark:bg-coffee-light text-coffee-dark dark:text-cream' : 'bg-white dark:bg-coffee-mid text-coffee-dark dark:text-cream-dark'}`}>
                           {msg.image && <img src={msg.image} alt="uploaded content" className="rounded-md mb-2 max-h-40"/>}
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            {msg.sources && msg.sources.length > 0 && (
                                <div className="mt-2 border-t border-cream-dark/50 dark:border-coffee-light/50 pt-2">
                                    <h4 className="text-xs font-bold mb-1">Sources:</h4>
                                    <ul className="space-y-1">
                                    {msg.sources.map((source, i) => (
                                        <li key={i}>
                                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 dark:text-blue-400 hover:underline break-all">
                                                {i+1}. {source.title || source.uri}
                                            </a>
                                        </li>
                                    ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="p-3 rounded-lg bg-white dark:bg-coffee-mid text-coffee-dark dark:text-cream-dark">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-cream-dark rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-cream-dark rounded-full animate-bounce delay-150"></div>
                                <div className="w-2 h-2 bg-cream-dark rounded-full animate-bounce delay-300"></div>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            
            <div className="p-1 border-t border-cream dark:border-coffee-light flex space-x-1 justify-center">
                 <ChatModeToggle active={useThinking} onClick={() => setUseThinking(!useThinking)} icon={<BrainIcon />} label="Thinking" />
                 <ChatModeToggle active={useSearch} onClick={() => setUseSearch(!useSearch)} icon={<SearchIcon />} label="Search" />
                 <ChatModeToggle active={useMaps} onClick={() => setUseMaps(!useMaps)} icon={<MapIcon />} label="Maps" />
            </div>

            {imagePreview && (
                <div className="p-2 border-t border-cream dark:border-coffee-light relative">
                    <img src={imagePreview} alt="preview" className="h-16 w-16 object-cover rounded"/>
                    <button onClick={() => {setImagePreview(null); setUploadedImage(null)}} className="absolute top-0 right-0 bg-black/50 text-white rounded-full p-0.5">
                        <XIcon className="w-4 h-4"/>
                    </button>
                </div>
            )}

            <div className="p-2 border-t border-cream dark:border-coffee-light flex items-center">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden"/>
                <button onClick={() => fileInputRef.current?.click()} className="p-2 text-coffee-light dark:text-cream-dark hover:text-coffee-dark dark:hover:text-cream">
                    <PaperClipIcon className="w-6 h-6" />
                </button>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && !isLoading && handleSend()}
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent focus:outline-none text-sm px-2 text-coffee-dark dark:text-cream"
                    disabled={isLoading}
                />
                <button onClick={handleSend} disabled={isLoading} className="p-2 text-coffee-light dark:text-cream-dark disabled:opacity-50">
                    <SendIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

const ChatModeToggle: React.FC<{active: boolean, onClick: () => void, icon: React.ReactNode, label: string}> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs transition-colors ${
            active 
            ? 'bg-cream dark:bg-coffee-light text-coffee-dark dark:text-cream' 
            : 'bg-transparent text-coffee-light dark:text-cream-dark hover:bg-cream/50 dark:hover:bg-coffee-mid'
        }`}
    >
        <div className="w-4 h-4">{icon}</div>
        <span>{label}</span>
    </button>
);


export default ChatBot;
