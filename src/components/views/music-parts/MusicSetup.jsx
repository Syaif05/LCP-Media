// src/components/views/music-parts/MusicSetup.jsx
import React from 'react';
import { Music, FolderPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MusicSetup = ({ onSelectFolder }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center h-[80vh] text-center animate-in fade-in">
      <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <Music size={40} className="text-orange-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('music.setupTitle')}</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8 text-lg">
        {t('music.setupDesc')}
      </p>
      <button onClick={onSelectFolder} className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-2xl font-bold shadow-xl shadow-orange-500/30 transition-all hover:scale-105 flex items-center gap-3 text-lg">
        <FolderPlus size={24} /> {t('music.pickFolder')}
      </button>
    </div>
  );
};

export default MusicSetup;