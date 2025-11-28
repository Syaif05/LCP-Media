// src/components/modals/DownloadModal.jsx
import React from 'react';
import { Download, X, HardDrive, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DownloadModal = ({ isOpen, onClose, onConfirm, fileInfo, progress, isDownloading }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="p-5 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-900/50">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Download size={20} className="text-orange-500" />
              {isDownloading ? 'Downloading...' : 'Download to Local'}
            </h3>
            {!isDownloading && (
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X size={20} />
              </button>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            
            {/* File Info Card */}
            <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-xl border border-slate-100 dark:border-white/5 flex items-start gap-4">
               <div className="p-3 bg-orange-100 dark:bg-orange-500/10 rounded-lg text-orange-600 dark:text-orange-400">
                 <HardDrive size={24} />
               </div>
               <div className="flex-1 min-w-0">
                 <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{fileInfo?.name}</p>
                 <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Target: {fileInfo?.targetDir}</p>
               </div>
            </div>

            {/* Progress Section */}
            {isDownloading ? (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-zinc-300">
                   <span>{progress?.speed || 'Calculating...'}</span>
                   <span>{progress?.percent || 0}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                   <motion.div 
                     className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                     initial={{ width: 0 }}
                     animate={{ width: `${progress?.percent || 0}%` }}
                   />
                </div>
                <div className="text-center text-[10px] text-slate-400">
                   {progress?.downloaded} / {progress?.total}
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                This will copy the file from the cloud drive to your local application storage for smoother offline playback.
              </p>
            )}

          </div>

          {/* Footer */}
          {!isDownloading && (
            <div className="p-5 border-t border-slate-100 dark:border-white/5 flex justify-end gap-3 bg-slate-50/50 dark:bg-zinc-900/50">
              <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-white/5 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={onConfirm} className="px-6 py-2 text-sm font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-lg shadow-orange-500/20 transition-all flex items-center gap-2">
                Start Download
              </button>
            </div>
          )}
          
          {/* Success State */}
          {progress?.percent === 100 && (
             <div className="absolute inset-0 bg-white/90 dark:bg-zinc-900/90 flex flex-col items-center justify-center text-center p-6 z-50">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-green-500 mb-4">
                   <CheckCircle size={64} fill="currentColor" className="text-white dark:text-zinc-900" />
                </motion.div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Download Complete!</h3>
                <button onClick={onClose} className="px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-black rounded-lg font-bold">
                  Close
                </button>
             </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DownloadModal;