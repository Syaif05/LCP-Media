// src/layouts/MainLayout.jsx
import React from 'react';
import TitleBar from '../components/TitleBar';
import Sidebar from '../components/Sidebar';
import { ThemeProvider } from '../context/ThemeContext';

const MainLayout = ({ 
  children, 
  activeMenu, 
  onChangeMenu, 
  recentCourses, 
  onOpenCourse,
  isSidebarCollapsed,
  toggleSidebar,
  disableScroll = false, 
  isMiniMode = false,
  onToggleMiniMode // Prop baru untuk sinkronisasi tombol close mini player
}) => {
  
  // TAMPILAN MINI MODE
  if (isMiniMode) {
    return (
      <ThemeProvider>
        <div className="h-screen w-screen bg-black overflow-hidden relative border border-white/20 select-none group">
          {/* Area Drag Window (Atas) */}
          <div className="absolute top-0 left-0 right-0 h-12 z-50 app-drag-region hover:bg-gradient-to-b from-black/50 to-transparent transition-all">
             {/* Tombol Close Mini Mode (Kembali ke Normal) */}
             <div 
               className="absolute top-3 right-3 p-1.5 bg-black/50 hover:bg-red-500 rounded-full text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity no-drag" 
               onClick={onToggleMiniMode}
               title="Exit Mini Player"
             >
               <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
             </div>
             
             {/* Tombol Resize (Kiri Atas - Opsional) */}
             <div className="absolute top-3 left-3 text-[10px] font-bold text-white/50 opacity-0 group-hover:opacity-100 select-none pointer-events-none">
               Mini Player
             </div>
          </div>
          {children}
        </div>
      </ThemeProvider>
    );
  }

  // TAMPILAN NORMAL
  return (
    <ThemeProvider>
      <div className="ambient-bg" />
      
      <div className="flex flex-col h-screen w-screen overflow-hidden text-day-text dark:text-night-text font-sans relative z-10">
        <TitleBar />
        
        <div className="flex flex-1 overflow-hidden p-3 gap-3">
          <aside 
            className={`flex-shrink-0 h-full transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${
              isSidebarCollapsed ? 'w-20' : 'w-72'
            }`}
          >
            <div className="h-full w-full glass-panel rounded-3xl overflow-hidden shadow-2xl shadow-black/5 border border-white/20 dark:border-white/10">
              <Sidebar 
                activeMenu={activeMenu} 
                onChangeMenu={onChangeMenu}
                recentCourses={recentCourses}
                onOpenCourse={onOpenCourse}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={toggleSidebar}
              />
            </div>
          </aside>

          <main className="flex-1 h-full relative min-w-0">
            <div className="h-full w-full glass-panel rounded-3xl overflow-hidden shadow-2xl shadow-black/5 border border-white/20 dark:border-white/10 relative flex flex-col">
              {/* LOGIKA PENTING: Jika disableScroll aktif (Mode Video), gunakan h-full & overflow-hidden */}
              <div className={`flex-1 ${disableScroll ? 'overflow-hidden h-full flex flex-col' : 'overflow-y-auto custom-scrollbar p-6 md:p-8 scroll-smooth'}`}>
                <div className={`mx-auto transition-all duration-500 ${disableScroll ? 'h-full w-full max-w-full' : (isSidebarCollapsed ? 'max-w-[1600px]' : 'max-w-7xl')}`}>
                  {children}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;