// src/components/player/TabsSection.jsx
import React from 'react';
import { FileText, Paperclip, Save, Check, ExternalLink, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const TabsSection = ({ 
  activeTab, onTabChange, note, onNoteChange, isSaving, resources = [], 
  videoAttachments = [], onAddAttachment, onRemoveAttachment 
}) => {
  const { t } = useTranslation();
  
  const handleOpenFile = (path) => {
    window.electron.openFile(path);
  };

  return (
    <div className="flex-1 bg-white dark:bg-[#18181b] rounded-2xl border border-slate-200 dark:border-white/5 flex flex-col overflow-hidden shadow-sm">
      <div className="flex border-b border-slate-100 dark:border-white/5 justify-between items-center bg-slate-50/50 dark:bg-zinc-900/50">
        <div className="flex p-1 gap-1">
          <button onClick={() => onTabChange('notes')} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'notes' ? 'bg-white dark:bg-white/10 text-orange-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-zinc-500 hover:bg-slate-200/50 dark:hover:text-zinc-300'}`}>
            <FileText size={16} /> {t('player.notes')}
          </button>
          <button onClick={() => onTabChange('files')} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${activeTab === 'files' ? 'bg-white dark:bg-white/10 text-orange-600 dark:text-blue-400 shadow-sm' : 'text-slate-500 dark:text-zinc-500 hover:bg-slate-200/50 dark:hover:text-zinc-300'}`}>
            <Paperclip size={16} /> 
            {t('player.files')} 
            {(resources.length + videoAttachments.length) > 0 && <span className="ml-1 text-xs bg-slate-200 dark:bg-zinc-800 px-1.5 rounded-full text-slate-600 dark:text-zinc-400">{resources.length + videoAttachments.length}</span>}
          </button>
        </div>
        
        {activeTab === 'notes' && (
          <div className="pr-4 flex items-center gap-2">
            {isSaving ? (
              <span className="text-xs text-orange-500 dark:text-blue-400 flex items-center gap-1 animate-pulse"><Save size={12} /> {t('player.saving')}</span>
            ) : (
              <span className="text-xs text-slate-400 dark:text-zinc-600 flex items-center gap-1"><Check size={12} /> {t('player.saved')}</span>
            )}
          </div>
        )}
      </div>
      
      <div className="p-0 flex-1 overflow-hidden relative">
        {activeTab === 'notes' ? (
          <textarea 
            className="w-full h-full bg-transparent p-6 resize-none focus:outline-none text-slate-700 dark:text-zinc-300 placeholder-slate-400 dark:placeholder-zinc-700 text-sm leading-relaxed font-sans"
            placeholder={t('player.placeholder')}
            value={note}
            onChange={onNoteChange}
          />
        ) : (
          <div className="h-full overflow-y-auto custom-scrollbar p-4 flex flex-col gap-6">
            
            {/* MANUAL FILES */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                 <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-widest">{t('player.linked')}</h4>
                 <button onClick={onAddAttachment} className="flex items-center gap-1 text-[10px] bg-orange-100 dark:bg-blue-600/20 text-orange-600 dark:text-blue-400 px-2 py-1 rounded hover:bg-orange-200 dark:hover:bg-blue-600 transition-colors font-bold">
                   <Plus size={12} /> {t('player.addFile')}
                 </button>
              </div>

              {videoAttachments.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-slate-200 dark:border-zinc-800 rounded-xl bg-slate-50/50 dark:bg-transparent">
                  <p className="text-xs text-slate-400 dark:text-zinc-600">No specific files linked yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                   {videoAttachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-orange-50 dark:bg-blue-900/10 border border-orange-100 dark:border-blue-500/20 hover:border-orange-300 transition-all group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-sm text-orange-500 dark:text-blue-400 font-bold text-[10px] w-8 h-8 flex items-center justify-center border border-orange-100 dark:border-white/5">
                          {file.type}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-800 dark:text-blue-200 truncate font-semibold">{file.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-zinc-500">Linked manually</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleOpenFile(file.path)} className="p-1.5 text-slate-400 hover:text-orange-600 hover:bg-orange-100 dark:hover:bg-white/10 rounded-md transition-colors"><ExternalLink size={14} /></button>
                        <button onClick={() => onRemoveAttachment(file.path)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="h-px bg-slate-100 dark:bg-zinc-800 w-full"></div>

            {/* FOLDER FILES */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 dark:text-zinc-400 uppercase tracking-widest">{t('player.generalFiles')}</h4>
              {resources.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-4 text-slate-400 dark:text-zinc-600 gap-2">
                  <p className="text-xs">No files found in folder.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {resources.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-zinc-800/30 border border-slate-100 dark:border-white/5 hover:border-orange-200 dark:hover:border-zinc-700 transition-all shadow-sm group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-slate-50 dark:bg-zinc-900 rounded-lg border border-slate-100 dark:border-white/5 text-slate-500 font-bold text-[10px] w-8 h-8 flex items-center justify-center">
                          {file.type}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-700 dark:text-zinc-300 truncate font-medium">{file.name}</p>
                          <p className="text-[10px] text-slate-400 dark:text-zinc-600">{file.size}</p>
                        </div>
                      </div>
                      <button onClick={() => handleOpenFile(file.path)} className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md transition-colors">
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsSection;