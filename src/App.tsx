import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { MemberDashboard } from './components/MemberDashboard';
import { MemberAttendance } from './components/MemberAttendance';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminMembersPage } from './components/AdminMembersPage';
import { Toaster } from './components/ui/sonner';
import { motion, AnimatePresence } from 'motion/react';

type Page = 'home' | 'attendance' | 'members';

const AppContent: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');

  if (!isAuthenticated || !user) {
    return <LoginPage onLoginSuccess={() => setCurrentPage('home')} />;
  }

  const renderContent = () => {
    if (user.role === 'admin') {
      switch (currentPage) {
        case 'home':
          return <AdminDashboard />;
        case 'members':
          return <AdminMembersPage />;
        case 'attendance':
          return <AdminDashboard />;
        default:
          return <AdminDashboard />;
      }
    } else {
      switch (currentPage) {
        case 'home':
          return <MemberDashboard onNavigateToAttendance={() => setCurrentPage('attendance')} />;
        case 'attendance':
          return <MemberAttendance />;
        default:
          return <MemberDashboard onNavigateToAttendance={() => setCurrentPage('attendance')} />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10"></div>
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
      </div>

      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <AnimatePresence mode="wait">
        <motion.main
          key={currentPage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="min-h-[calc(100vh-80px)]"
        >
          {renderContent()}
        </motion.main>
      </AnimatePresence>

      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            color: '#E2E8F0',
          },
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
