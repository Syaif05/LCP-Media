// src/components/modals/ActionModal.jsx
import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, Edit3, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ActionModal = ({ isOpen, type, title, message, initialValue, onClose, onConfirm }) => {
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (isOpen && initialValue) setInputValue(initialValue);
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(inputValue);
  };

  const isDelete = type === 'delete';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
        >
          <div className={`p-5 flex items-center gap-3 ${isDelete ? 'bg-red-50 dark:bg-red-900/20' : 'bg-slate-50 dark:bg-zinc-800/50'}`}>
            <div className={`p-2 rounded-lg ${isDelete ? 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-slate-200 text-slate-600 dark:bg-white/10 dark:text-white'}`}>
               {isDelete ? <Trash2 size={20} /> : <Edit3 size={20} />}
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex-1">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <p className="text-sm text-slate-500 dark:text-zinc-400 mb-4 leading-relaxed">{message}</p>
            
            {!isDelete && (
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full px-4 py-2 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 outline-none text-slate-800 dark:text-white mb-6"
                autoFocus
              />
            )}

            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                Cancel
              </button>
              <button 
                type="submit" 
                className={`px-6 py-2 text-sm font-bold text-white rounded-lg shadow-lg transition-all flex items-center gap-2 ${isDelete ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'}`}
              >
                {isDelete ? 'Yes, Delete' : 'Save Changes'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ActionModal;