// src/App.jsx
import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import MainLayout from './layouts/MainLayout';
import CoursePlayer from './components/CoursePlayer';
import DashboardView from './components/views/DashboardView';
import SettingsView from './components/views/SettingsView';
import LibraryView from './components/views/LibraryView';
import QuickPlayerView from './components/views/QuickPlayerView'; // Import Baru
import ActionModal from './components/modals/ActionModal';

function App() {
  const [courses, setCourses] = useState([]);
  const [view, setView] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quickFilePath, setQuickFilePath] = useState(null); // State baru untuk quick play
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [appPath, setAppPath] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null, data: null });

  const loadCourses = async () => {
    try {
      if (window.electron && window.electron.getCourses) {
        const result = await window.electron.getCourses();
        setCourses(Array.isArray(result) ? result : []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCourses();
    
    // Listener untuk Open With (File Association)
    if (window.electron && window.electron.onOpenFileDirect) {
      window.electron.onOpenFileDirect((filePath) => {
        setQuickFilePath(filePath);
        setView('quickplay');
        setIsSidebarCollapsed(true); // Auto collapse sidebar biar fokus
      });
    }
  }, []);

  const filteredCourses = courses.filter(course =>
    (course.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const lastPlayedCourse = courses[0] || null;
  const recentCourses = courses.slice(0, 3);

  const handleCreateCourse = async () => {
    try {
      if (window.electron && window.electron.selectFolder) {
        await window.electron.selectFolder();
        await loadCourses();
        setActiveMenu('library');
        setView('library');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenCourse = course => {
    setSelectedCourse(course);
    setView('player');
    setIsSidebarCollapsed(true);
  };

  const handleBackToDashboard = () => {
    setSelectedCourse(null);
    setQuickFilePath(null);
    setView('dashboard');
    setActiveMenu('dashboard');
    setIsSidebarCollapsed(false);
    loadCourses();
  };

  const handleDeleteCourse = async (courseId) => {
    await window.electron.deleteCourse(courseId);
    loadCourses();
  };

  const handleRenameCourse = async (courseId, newTitle) => {
    await window.electron.renameCourse({ courseId, newTitle });
    loadCourses();
  };

  const handleChangeMenu = menuId => {
    setActiveMenu(menuId);
    if (menuId === 'settings') {
      handleOpenSettings();
    } else if (menuId === 'library') {
      setView('library');
    } else {
      setView('dashboard');
    }
  };

  const handleOpenSettings = async () => {
    const path = await window.electron.getAppPath();
    setAppPath(path || '');
    setView('settings');
  };

  const handleOpenDataFolder = async () => {
    window.electron.openPath(appPath);
  };

  const handleResetApp = async () => {
    await window.electron.resetApp();
    loadCourses();
  };

  const openRenameModal = (course) => {
    setModalConfig({ isOpen: true, type: 'rename', data: course });
  };

  const openDeleteModal = (course) => {
    setModalConfig({ isOpen: true, type: 'delete', data: course });
  };

  const handleModalConfirm = async (inputValue) => {
    if (modalConfig.type === 'delete') {
       await window.electron.deleteCourse(modalConfig.data.id);
    } else if (modalConfig.type === 'rename') {
       await window.electron.renameCourse({ 
         courseId: modalConfig.data.id, 
         newTitle: inputValue 
       });
    }
    setModalConfig({ isOpen: false, type: null, data: null });
    loadCourses();
  };

  return (
    <MainLayout 
      activeMenu={activeMenu} 
      onChangeMenu={handleChangeMenu}
      recentCourses={recentCourses}
      onOpenCourse={handleOpenCourse}
      isSidebarCollapsed={isSidebarCollapsed}
      toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
    >
      <Toaster position="bottom-right" theme="system" richColors closeButton />
      
      {view === 'dashboard' && (
        <DashboardView
          courses={filteredCourses}
          lastPlayedCourse={lastPlayedCourse}
          onOpenCourse={handleOpenCourse}
          onCreateCourse={handleCreateCourse}
          onRenameCourse={openRenameModal}
          onDeleteCourse={openDeleteModal}
          onSeeAll={() => handleChangeMenu('library')}
        />
      )}
      
      {view === 'library' && (
        <LibraryView 
          courses={filteredCourses}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenCourse={handleOpenCourse}
          onRenameCourse={openRenameModal}
          onDeleteCourse={openDeleteModal}
        />
      )}

      {view === 'settings' && (
        <SettingsView
          appPath={appPath}
          onOpenDataFolder={handleOpenDataFolder}
          onResetApp={handleResetApp}
          onBack={handleBackToDashboard}
        />
      )}
      
      {view === 'player' && selectedCourse && (
        <CoursePlayer 
          course={selectedCourse} 
          onBack={handleBackToDashboard}
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} 
        />
      )}

      {/* Tampilan Baru: Quick Player */}
      {view === 'quickplay' && quickFilePath && (
        <QuickPlayerView 
           filePath={quickFilePath}
           onBack={handleBackToDashboard}
        />
      )}

      <ActionModal 
        isOpen={modalConfig.isOpen}
        type={modalConfig.type}
        title={modalConfig.type === 'delete' ? 'Remove Course' : 'Rename Course'}
        message={modalConfig.type === 'delete' 
          ? `Are you sure you want to remove "${modalConfig.data?.displayName || modalConfig.data?.title}" from your library? The files will remain on your disk.` 
          : "Enter a new display name for this course."}
        initialValue={modalConfig.type === 'rename' ? (modalConfig.data?.displayName || modalConfig.data?.title) : ''}
        onClose={() => setModalConfig({ isOpen: false })}
        onConfirm={handleModalConfirm}
      />
    </MainLayout>
  );
}

export default App;