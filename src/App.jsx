// src/App.jsx
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Toaster } from 'sonner';
import { Loader2 } from 'lucide-react';
import MainLayout from './layouts/MainLayout';
import ActionModal from './components/modals/ActionModal';
import ErrorBoundary from './components/ErrorBoundary';

const DashboardView = lazy(() => import('./components/views/DashboardView'));
const LibraryView = lazy(() => import('./components/views/LibraryView'));
const SettingsView = lazy(() => import('./components/views/SettingsView'));
const MusicView = lazy(() => import('./components/views/MusicView'));
const CoursePlayer = lazy(() => import('./components/CoursePlayer'));
const QuickPlayerView = lazy(() => import('./components/views/QuickPlayerView'));

const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center text-orange-500">
    <Loader2 size={40} className="animate-spin" />
  </div>
);

function App() {
  const [courses, setCourses] = useState([]);
  const [view, setView] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quickFilePath, setQuickFilePath] = useState(null);
  const [isMiniMode, setIsMiniMode] = useState(false);
  
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
    if (window.electron && window.electron.onOpenFileDirect) {
      window.electron.onOpenFileDirect((filePath) => {
        setQuickFilePath(filePath);
        setView('quickplay');
        setIsSidebarCollapsed(true);
      });
    }
  }, []);

  const handleToggleMiniPlayer = async () => {
    const newState = !isMiniMode;
    await window.electron.toggleMiniPlayer(newState);
    setIsMiniMode(newState);
  };

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
    if (isMiniMode) handleToggleMiniPlayer();
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
      setView('settings');
    } else if (menuId === 'library') {
      setView('library');
    } else if (menuId === 'music') {
      setView('music');
    } else {
      setView('dashboard');
    }
  };

  const handleOpenSettings = async () => {
    const path = await window.electron.getAppPath();
    setAppPath(path || '');
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
      disableScroll={view === 'player' || view === 'quickplay'} 
      isMiniMode={isMiniMode}
      onToggleMiniMode={handleToggleMiniPlayer} // UPDATE: Pass Handler
    >
      <Toaster position="bottom-right" theme="system" richColors closeButton />
      
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
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

          {view === 'music' && (
            <MusicView />
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
              isMiniMode={isMiniMode}
              onToggleMiniMode={handleToggleMiniPlayer}
            />
          )}

          {view === 'quickplay' && quickFilePath && (
            <QuickPlayerView 
              filePath={quickFilePath}
              onBack={handleBackToDashboard}
            />
          )}
        </Suspense>
      </ErrorBoundary>

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