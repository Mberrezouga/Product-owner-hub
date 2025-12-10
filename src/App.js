import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/Layout';
import Dashboard from './pages/DashboardEnhanced';
import Projects from './pages/ProjectsEnhanced';
import Teams from './pages/Teams';
import Kanban from './pages/KanbanEnhanced';
import Timeline from './pages/Timeline';
import Budget from './pages/Budget';
import CalendarView from './pages/CalendarViewLarge';
import Auth from './pages/Auth';
import { Toaster } from './components/ui/sonner';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-teal-50 to-slate-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <DataProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/teams" element={<Teams />} />
                        <Route path="/kanban" element={<Kanban />} />
                        <Route path="/timeline" element={<Timeline />} />
                        <Route path="/budget" element={<Budget />} />
                        <Route path="/calendar" element={<CalendarView />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
          </DataProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;