import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Breadcrumb from './components/Breadcrumb';
import DashboardPage from './features/dashboard/DashboardPage';
import Projects from './pages/Projects';
import Staff from './pages/Staff';
import SchedulePage from './features/schedule/SchedulePage';
import Settings from './pages/Settings';
import CutSheetPage from './pages/CutSheetPage';
import CutManagementPage from './pages/CutManagementPage';
import CutProgressPage from './pages/CutProgressPage';
import StaffDetailPage from './pages/StaffDetailPage';
import KoubanHyouList from './components/KoubanHyouList';
import KoubanHyouInput from './components/koubanhyou/KoubanHyouInput';
import KoubanHyouOverviewPage from './pages/KoubanHyouOverviewPage';
import CharacterSettings from './pages/CharacterSettings';

function App() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <PrivateRoute>
          <div className="min-h-screen bg-horizon-50 flex">
            <Sidebar />
            <div className="flex-1 transition-all duration-300 ease-in-out">
              <Header />
              <main className="pt-16 p-6">
                <Breadcrumb />
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/staff/:staffId" element={<StaffDetailPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/cut-sheet" element={<CutSheetPage />} />
              <Route path="/cut-management" element={<CutManagementPage />} />
              <Route path="/cut-progress" element={<CutProgressPage />} />
              <Route path="/kouban-hyou" element={<KoubanHyouList />} />
              <Route path="/kouban-hyou/new" element={<KoubanHyouInput />} />
              <Route path="/kouban-hyou/:id" element={<KoubanHyouInput />} />
              <Route path="/kouban-hyou/:id/overview" element={<KoubanHyouOverviewPage />} />
                  <Route path="/character-settings" element={<CharacterSettings />} />
                </Routes>
              </main>
            </div>
          </div>
          </PrivateRoute>
        } />
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;