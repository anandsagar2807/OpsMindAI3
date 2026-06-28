import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthenticateWithRedirectCallback } from '@clerk/react';
import { Toaster } from 'react-hot-toast';
import EnterpriseLandingPage from './pages/EnterpriseLandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import DocumentsPage from './pages/DocumentsPage';
import UploadPage from './pages/UploadPage';
import InsightsPage from './pages/InsightsPage';
import SkillsAnalysisPage from './pages/SkillsAnalysisPage';
import ChatWithSOPsPage from './pages/ChatWithSOPsPage';
import SettingsPage from './pages/SettingsPage';
import LogoShowcase from './pages/LogoShowcase';
import DashboardLayout from './layouts/EnterpriseLayout';
import PrivateRoute from './components/PrivateRoute';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f1f5f9',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: { primary: '#0ea5e9', secondary: '#f1f5f9' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#f1f5f9' },
            duration: 6000,
          },
        }}
      />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<EnterpriseLandingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/sign-in/sso-callback" element={<AuthenticateWithRedirectCallback />} />
        <Route path="/sign-up/sso-callback" element={<AuthenticateWithRedirectCallback />} />
        <Route path="/logos" element={<LogoShowcase />} />

        {/* Protected routes with dashboard layout */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="upload" element={<UploadPage />} />
          <Route path="insights/:id" element={<InsightsPage />} />
          <Route path="skills-analysis" element={<SkillsAnalysisPage />} />
          <Route path="chat" element={<ChatWithSOPsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
