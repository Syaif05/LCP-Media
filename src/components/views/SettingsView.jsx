// src/components/views/SettingsView.jsx
import React, { useState, useEffect } from 'react';
import { FolderOpen, HardDrive, Download, RefreshCw, FileVideo, Globe, Trash2, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const SettingsView = ({ appPath, onOpenDataFolder, onResetApp, onBack }) => {
  const { t, i18n } = useTranslation();
  const [downloadPath, setDownloadPath] = useState('');
  const [downloadsInfo, setDownloadsInfo] = useState({ files: [], usedSpace: '0 MB' });
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    loadSettings();
    loadDownloadsInfo();
  }, []);

  const loadSettings = async () => {
    const settings = await window.electron.getSettings();
    setDownloadPath(settings.downloadPath);
  };

  const loadDownloadsInfo = async () => {
    const info = await window.electron.getDownloadsInfo();
    setDownloadsInfo(info);
  };

  const handleChangeDir = async () => {
    const newPath = await window.electron.selectDownloadDir();
    if (newPath) {
      setDownloadPath(newPath);
      await window.electron.saveSettings({ downloadPath: newPath });
      loadDownloadsInfo();
    }
  };

  const handleDeleteFile = async (filePath) => {
    if (confirm('Delete this file permanently?')) {
      await window.electron.deleteDownload(filePath);
      loadDownloadsInfo();
    }
  };

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="max-w-4xl mx-auto pt-4 fade-in">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors text-slate-500 dark:text-zinc-400">
          <FolderOpen size={20} className="rotate-180" /> 
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('settings.title')}</h1>
          <p className="text-xs text-slate-500 dark:text-zinc-500">Manage preferences and storage</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Settings */}
        <div className="w-full md:w-56 flex-shrink-0 space-y-1">
           <button onClick={() => setActiveTab('general')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'general' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}>
             <Globe size={18} /> {t('settings.general')}
           </button>
           <button onClick={() => setActiveTab('downloads')} className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${activeTab === 'downloads' ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'}`}>
             <Download size={18} /> {t('settings.downloads')}
           </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* Language Selector */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wider opacity-80">
                  <Languages size={16} /> {t('settings.language')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => changeLanguage('en')}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${i18n.language === 'en' ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-100 dark:border-zinc-800 hover:border-orange-200'}`}
                  >
                    <span className="text-2xl">🇺🇸</span>
                    <div className="text-left">
                      <div className={`font-bold text-sm ${i18n.language === 'en' ? 'text-orange-700 dark:text-orange-400' : 'text-slate-700 dark:text-white'}`}>English</div>
                      <div className="text-[10px] text-slate-400">United States</div>
                    </div>
                  </button>

                  <button 
                    onClick={() => changeLanguage('id')}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${i18n.language === 'id' ? 'border-orange-500 bg-orange-50 dark:bg-orange-500/10' : 'border-slate-100 dark:border-zinc-800 hover:border-orange-200'}`}
                  >
                    <span className="text-2xl">🇮🇩</span>
                    <div className="text-left">
                      <div className={`font-bold text-sm ${i18n.language === 'id' ? 'text-orange-700 dark:text-orange-400' : 'text-slate-700 dark:text-white'}`}>Indonesia</div>
                      <div className="text-[10px] text-slate-400">Bahasa Indonesia</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* App Data */}
              <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wider opacity-80">
                  <HardDrive size={16} /> {t('settings.appData')}
                </h3>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-black/30 p-3 rounded-lg border border-slate-200 dark:border-zinc-800 mb-4">
                  <code className="text-xs text-slate-600 dark:text-zinc-400 font-mono flex-1 break-all">{appPath}</code>
                </div>
                <button onClick={onOpenDataFolder} className="text-sm font-semibold text-orange-600 hover:underline">{t('settings.openFolder')}</button>
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50/50 dark:bg-red-900/5 border border-red-100 dark:border-red-500/10 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-red-600 dark:text-red-400 mb-4 uppercase tracking-wider opacity-80">{t('settings.danger')}</h3>
                <button onClick={onResetApp} className="px-4 py-2 bg-white dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                  {t('settings.reset')}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'downloads' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
               {/* Location Card */}
               <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wider opacity-80">
                    <Download size={16} /> {t('settings.downloadLoc')}
                  </h3>
                  <div className="flex gap-2 mb-2">
                     <div className="flex-1 bg-slate-50 dark:bg-black/30 p-3 rounded-lg border border-slate-200 dark:border-zinc-800 text-xs font-mono text-slate-600 dark:text-zinc-400 break-all">
                        {downloadPath}
                     </div>
                     <button onClick={handleChangeDir} className="px-4 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-lg text-xs font-bold text-slate-600 dark:text-zinc-300 transition-colors">
                       {t('settings.change')}
                     </button>
                  </div>
                  <p className="text-xs text-slate-400">{t('settings.usedSpace')}: <span className="font-bold text-orange-500">{downloadsInfo.usedSpace}</span></p>
               </div>

               {/* Files List */}
               <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
                  <div className="p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-black/20 flex justify-between items-center">
                     <h4 className="font-bold text-sm text-slate-700 dark:text-zinc-300">{t('settings.files')}</h4>
                     <button onClick={loadDownloadsInfo} className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-full transition-colors"><RefreshCw size={14} /></button>
                  </div>
                  <div className="max-h-96 overflow-y-auto custom-scrollbar p-2">
                     {downloadsInfo.files.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-xs">{t('settings.noFiles')}</div>
                     ) : (
                        downloadsInfo.files.map((file, idx) => (
                           <div key={idx} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-zinc-800/50 rounded-lg transition-colors group">
                              <div className="flex items-center gap-3 overflow-hidden">
                                 <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg text-blue-500"><FileVideo size={18} /></div>
                                 <div className="min-w-0">
                                    <p className="text-sm font-medium text-slate-800 dark:text-zinc-200 truncate">{file.name}</p>
                                    <p className="text-[10px] text-slate-400">{file.size}</p>
                                 </div>
                              </div>
                              <button onClick={() => handleDeleteFile(file.path)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={16} /></button>
                           </div>
                        ))
                     )}
                  </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SettingsView;