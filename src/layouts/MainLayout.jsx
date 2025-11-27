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
  toggleSidebar
}) => {
  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text transition-colors duration-300 font-sans selection:bg-accent-light selection:text-white">
        <TitleBar />
        <div className="flex flex-1 overflow-hidden relative">
          <div className={`${isSidebarCollapsed ? 'w-0 md:w-20' : 'w-72'} flex-shrink-0 h-full z-40 relative transition-all duration-300 ease-in-out`}>
            <Sidebar 
              activeMenu={activeMenu} 
              onChangeMenu={onChangeMenu}
              recentCourses={recentCourses}
              onOpenCourse={onOpenCourse}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={toggleSidebar}
            />
          </div>
          <main className="flex-1 h-full overflow-y-auto relative p-4 md:p-6 scroll-smooth z-10">
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-accent-light/5 to-transparent -z-10 pointer-events-none"></div>
            <div className={`mx-auto pb-10 transition-all duration-300 h-full ${isSidebarCollapsed ? 'max-w-[1600px]' : 'max-w-6xl'}`}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
