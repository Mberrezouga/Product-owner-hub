import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  BarChart3, 
  Calendar, 
  CheckSquare,
  GanttChart,
  Menu,
  X,
  Download,
  Upload,
  Bell,
  User,
  LogOut
} from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import NotificationDropdown from './NotificationDropdown';
import Footer from './Footer';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, projects, tasks } = useData();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/projects', icon: FolderKanban, label: 'Projects' },
    { path: '/teams', icon: User, label: 'Teams' },
    { path: '/kanban', icon: CheckSquare, label: 'Kanban Board' },
    { path: '/timeline', icon: GanttChart, label: 'Timeline' },
    { path: '/budget', icon: BarChart3, label: 'Budget' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' }
  ];

  const handleExport = () => {
    const data = {
      projects,
      tasks,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `product-owner-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          localStorage.setItem('po_hub_projects', JSON.stringify(data.projects || []));
          localStorage.setItem('po_hub_tasks', JSON.stringify(data.tasks || []));
          alert('Data imported successfully! Please refresh the page.');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100 flex flex-col">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <FolderKanban className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Product Owner Hub
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} className="hidden sm:flex">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport} className="hidden sm:flex">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative"
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
              <NotificationDropdown 
                isOpen={notificationsOpen} 
                onClose={() => setNotificationsOpen(false)} 
              />
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2 ml-2 pl-2 border-l border-slate-200">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                {user?.isGuest && (
                  <p className="text-xs text-amber-600">Guest Mode</p>
                )}
              </div>
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-[57px] left-0 h-[calc(100vh-57px)] 
          bg-white/90 backdrop-blur-sm border-r border-slate-200 
          transition-transform duration-300 z-40
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          w-64
        `}>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg 
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md' 
                      : 'text-slate-700 hover:bg-slate-100'
                    }
                  `}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          {/* Mobile export/import buttons */}
          <div className="p-4 space-y-2 border-t border-slate-200 sm:hidden">
            <Button variant="outline" size="sm" onClick={handleExport} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button variant="outline" size="sm" onClick={handleImport} className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>

      {/* Footer */}
      <Footer />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden top-[57px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;