import React from 'react';
import { Minus, Square, X } from 'lucide-react';

const TitleBar = () => {
  
  const handleMinimize = () => window.electron.minimize();
  const handleMaximize = () => window.electron.maximize();
  const handleClose = () => window.electron.close();

  return (
    <div className="h-8 w-full flex items-center justify-between bg-light-bg dark:bg-dark-bg border-b border-light-border dark:border-dark-border select-none z-50">
      
      {/* Area Drag (Judul) */}
      <div className="flex-1 h-full app-drag-region flex items-center pl-4">
        <span className="text-xs font-semibold text-slate-500 dark:text-zinc-500 tracking-wide">LCP Media</span>
      </div>

      {/* Area Tombol (No Drag) */}
      <div className="flex h-full no-drag">
        <button 
          onClick={handleMinimize}
          className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
        >
          <Minus size={14} />
        </button>
        <button 
          onClick={handleMaximize}
          className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
        >
          <Square size={12} />
        </button>
        <button 
          onClick={handleClose}
          className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>

    </div>
  );
};

export default TitleBar;