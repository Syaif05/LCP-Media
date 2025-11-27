// src/components/player/video-parts/SubtitleSettings.jsx
import React from 'react';

const SubtitleSettings = ({ settings, onChange, onClose }) => {
  return (
    <div className="absolute bottom-full right-0 mb-3 w-64 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl p-4 z-50">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Appearance</h4>
        <button onClick={onClose} className="text-xs text-orange-500 hover:underline">Close</button>
      </div>
      
      <div className="mb-3">
        <label className="text-xs text-slate-500 mb-1 block">Size</label>
        <div className="flex bg-slate-100 dark:bg-zinc-800 rounded-lg p-1">
          {['Small', 'Medium', 'Large'].map((size) => (
            <button key={size} onClick={() => onChange({...settings, size})} className={`flex-1 py-1 text-xs rounded-md ${settings.size === size ? 'bg-white dark:bg-zinc-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-400'}`}>
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="text-xs text-slate-500 mb-1 block">Color</label>
        <div className="flex gap-2">
          {['#ffffff', '#facc15', '#4ade80', '#ef4444'].map(color => (
            <button key={color} onClick={() => onChange({...settings, color})} className={`w-6 h-6 rounded-full border-2 ${settings.color === color ? 'border-orange-500' : 'border-transparent'}`} style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs text-slate-500 mb-1 block">Background</label>
        <div className="flex gap-2">
          <button onClick={() => onChange({...settings, bg: 'rgba(0,0,0,0.7)'})} className={`px-2 py-1 text-[10px] rounded border ${settings.bg.includes('0.7') ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600' : 'border-slate-200 dark:border-zinc-700 text-slate-500'}`}>Box</button>
          <button onClick={() => onChange({...settings, bg: 'transparent'})} className={`px-2 py-1 text-[10px] rounded border ${settings.bg === 'transparent' ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 text-orange-600' : 'border-slate-200 dark:border-zinc-700 text-slate-500'}`}>None</button>
        </div>
      </div>
    </div>
  );
};

export default SubtitleSettings;