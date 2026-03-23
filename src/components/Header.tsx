import { Settings, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface HeaderProps {
  mode: 'chat' | 'image';
  setMode: (mode: 'chat' | 'image') => void;
  onOpenSettings: () => void;
}

export function Header({ mode, setMode, onOpenSettings }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span className="text-white font-bold text-sm">A</span>
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Astrio AI</h1>
      </div>

      <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 p-1 rounded-full relative">
        <button
          onClick={() => setMode('chat')}
          className={cn(
            "relative flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-colors z-10",
            mode === 'chat' ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <MessageSquare className="w-4 h-4" />
          <span className="hidden sm:inline">Chat</span>
        </button>
        <button
          onClick={() => setMode('image')}
          className={cn(
            "relative flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full transition-colors z-10",
            mode === 'image' ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          )}
        >
          <ImageIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Image</span>
        </button>
        
        {/* Animated background pill */}
        <motion.div
          className="absolute inset-y-1 bg-white dark:bg-zinc-800 rounded-full shadow-sm"
          initial={false}
          animate={{
            left: mode === 'chat' ? '4px' : '50%',
            width: mode === 'chat' ? 'calc(50% - 4px)' : 'calc(50% - 4px)',
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      </div>

      <button
        onClick={onOpenSettings}
        className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5" />
      </button>
    </header>
  );
}
