// src/hooks/useKeyboardShortcuts.js
import { useEffect } from 'react';

const useKeyboardShortcuts = ({ 
  togglePlay, 
  seekForward, 
  seekBackward, 
  increaseVolume, 
  decreaseVolume, 
  toggleMute, 
  toggleFullscreen 
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Jangan jalankan shortcut jika user sedang mengetik di input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      switch(e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
        case 'KeyL':
          e.preventDefault(); // Mencegah scroll horizontal browser
          seekForward();
          break;
        case 'ArrowLeft':
        case 'KeyJ':
          e.preventDefault();
          seekBackward();
          break;
        case 'ArrowUp':
          e.preventDefault(); // Mencegah scroll vertikal browser
          increaseVolume();
          break;
        case 'ArrowDown':
          e.preventDefault();
          decreaseVolume();
          break;
        case 'KeyM':
          toggleMute();
          break;
        case 'KeyF':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, seekForward, seekBackward, increaseVolume, decreaseVolume, toggleMute, toggleFullscreen]);
};

export default useKeyboardShortcuts;