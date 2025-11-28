// src/components/TitleBar.jsx
import React from 'react';
import { Minus, Square, X } from 'lucide-react';

const TitleBar = () => {
  
  const handleMinimize = () => window.electron.minimize();
  const handleMaximize = () => window.electron.maximize();
  const handleClose = () => window.electron.close();

  return (
    <div className="h-8 w-full flex items-center justify-between select-none z-50 shrink-0 app-drag-region px-2 pt-2">
      {/* Kosongkan kiri agar bersih */}
      <div className="flex-1"></div>

      {/* Window Controls (Mac Styleish but for Windows) */}
      <div className="flex items-center gap-1 no-drag bg-white/50 dark:bg-black/30 backdrop-blur-md rounded-lg p-1 border border-white/10 shadow-sm">
        <button 
          onClick={handleMinimize}
          className="w-8 h-6 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
        >
          <Minus size={14} />
        </button>
        <button 
          onClick={handleMaximize}
          className="w-8 h-6 flex items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-colors"
        >
          <Square size={12} />
        </button>
        <button 
          onClick={handleClose}
          className="w-8 h-6 flex items-center justify-center rounded hover:bg-red-500 hover:text-white text-slate-500 dark:text-slate-400 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default TitleBar;