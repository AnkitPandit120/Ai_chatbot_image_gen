import { useState, useRef, useEffect } from 'react';
import { Image as ImageIcon, Loader2, Download, Sparkles, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateImage } from '../lib/api';

type ImageMessage = {
  id: string;
  prompt: string;
  imageUrl?: string;
  isLoading: boolean;
  error?: string;
};

export function ImageMode() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ImageMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const apiKey = localStorage.getItem('HUGGINGFACE_API_KEY');
    if (!apiKey) {
      alert('Please set your Hugging Face API key in settings.');
      return;
    }

    const newMessageId = Date.now().toString();
    const currentPrompt = prompt.trim();
    
    setMessages(prev => [...prev, {
      id: newMessageId,
      prompt: currentPrompt,
      isLoading: true
    }]);
    
    setPrompt('');

    try {
      const blob = await generateImage(currentPrompt, apiKey);
      const url = URL.createObjectURL(blob);
      
      setMessages(prev => prev.map(msg => 
        msg.id === newMessageId 
          ? { ...msg, imageUrl: url, isLoading: false }
          : msg
      ));
    } catch (err: any) {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessageId 
          ? { ...msg, error: err.message || 'Failed to generate image', isLoading: false }
          : msg
      ));
      console.error(err);
    }
  };

  const handleDownload = (url: string, promptText: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `astrio-ai-${promptText.replace(/\s+/g, '-').slice(0, 20)}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-73px)] w-full max-w-5xl mx-auto relative">
      {/* Chat History Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 pb-32">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-4 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-pink-500/20 mb-2">
              <Sparkles className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              Imagine with Astrio AI
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
              Describe what you want to see, and I'll generate an image for you.
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={msg.id} 
              className="space-y-6"
            >
              {/* User Prompt */}
              <div className="flex items-start gap-4 justify-end">
                <div className="bg-indigo-600 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                  <p className="text-[15px] leading-relaxed">{msg.prompt}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>

              {/* AI Response */}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                
                <div className="flex-1 max-w-[80%]">
                  {msg.isLoading ? (
                    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 flex items-center gap-4 shadow-sm w-fit">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                      <span className="text-zinc-600 dark:text-zinc-400 font-medium">Generating your image...</span>
                    </div>
                  ) : msg.error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl border border-red-100 dark:border-red-900/30">
                      {msg.error}
                    </div>
                  ) : msg.imageUrl ? (
                    <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 inline-block">
                      <img
                        src={msg.imageUrl}
                        alt={msg.prompt}
                        className="max-w-full h-auto max-h-[500px] object-contain"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button
                          onClick={() => handleDownload(msg.imageUrl!, msg.prompt)}
                          className="flex items-center gap-2 px-6 py-3 bg-white text-zinc-900 font-medium rounded-full hover:scale-105 transition-transform shadow-lg"
                        >
                          <Download className="w-5 h-5" />
                          Download
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-zinc-50 via-zinc-50 to-transparent dark:from-zinc-950 dark:via-zinc-950 pt-10">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative flex items-center bg-white dark:bg-zinc-900 rounded-3xl shadow-lg border border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-indigo-500/50 focus-within:border-indigo-500 transition-all p-2">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A futuristic city with flying cars at sunset..."
              className="w-full py-3 px-6 bg-transparent focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 text-lg"
            />
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="ml-2 w-12 h-12 bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white rounded-full disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shrink-0 shadow-md"
            >
              <Send className="w-5 h-5 ml-1" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
