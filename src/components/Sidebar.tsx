import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Film, 
  Users, 
  Calendar, 
  Settings,
  PenTool,
  Layers,
  Scissors,
  Table,
  Pin,
  ChevronLeft,
  Menu,
  FileSpreadsheet,
  User
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isPinned, setIsPinned] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsPinned(false);
        setIsVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { icon: Home, label: 'ダッシュボード', path: '/' },
    { icon: Film, label: '作品管理', path: '/projects' },
    { icon: Layers, label: 'カット管理', path: '/cut-sheet' },
    { icon: Scissors, label: 'カット詳細', path: '/cut-management' },
    { icon: Table, label: 'カット進行表', path: '/cut-progress' },
    { icon: FileSpreadsheet, label: '香盤表', path: '/kouban-hyou' },
    { icon: User, label: 'キャラクター設定', path: '/character-settings' },
    { icon: Users, label: 'スタッフ', path: '/staff' },
    { icon: Calendar, label: 'スケジュール', path: '/schedule' },
    { icon: Settings, label: '設定', path: '/settings' },
  ];

  const handleMouseEnter = () => {
    if (!isPinned && !isMobile) {
      setIsVisible(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned && !isMobile) {
      setIsVisible(false);
    }
  };

  const togglePin = () => {
    setIsPinned(!isPinned);
    if (!isPinned) {
      setIsVisible(true);
    }
  };

  const toggleMobileMenu = () => {
    setIsVisible(!isVisible);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      setIsVisible(false);
    }
  };

  return (
    <>
      {isMobile && (
        <button
          onClick={toggleMobileMenu}
          className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {isMobile && isVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsVisible(false)}
        />
      )}

      {!isMobile && !isVisible && !isPinned && (
        <div
          className="fixed left-0 top-0 w-4 h-screen z-20"
          onMouseEnter={handleMouseEnter}
        />
      )}

      <div
        className={`h-screen bg-gradient-to-b from-horizon-600 to-horizon-800 text-white transition-all duration-300 ease-in-out
          ${isVisible || isPinned ? 'w-64' : 'w-0'}
          ${isPinned && !isMobile ? 'relative' : 'fixed left-0 top-0'}
          ${isMobile ? 'z-50' : 'z-30'}
          ${isMobile && !isVisible ? '-translate-x-full' : 'translate-x-0'}
        `}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`p-4 flex items-center justify-between border-b border-white/10 overflow-hidden transition-opacity duration-300 ${
          isVisible || isPinned ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="flex items-center gap-2">
            <PenTool className="w-8 h-8 flex-shrink-0" />
            <span className="text-xl font-bold tracking-wider whitespace-nowrap">アニメスタジオ</span>
          </div>
          {!isMobile && (
            <button
              onClick={togglePin}
              className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                isPinned ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              <Pin className={`w-5 h-5 ${isPinned ? 'text-horizon-200' : 'text-white'}`} />
            </button>
          )}
        </div>
        
        <nav className="mt-8 overflow-hidden">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-white/10 transition-colors whitespace-nowrap ${
                  isActive ? 'bg-white/10 border-r-4 border-horizon-200' : ''
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className={`font-medium transition-opacity duration-300 ${
                  isVisible || isPinned ? 'opacity-100' : 'opacity-0'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;