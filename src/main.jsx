import React, { Component } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import TeacherDashboard from './pages/TeacherDashboard';
import CreateAssignment from './pages/CreateAssignment';
import Submissions from './pages/Submissions';
import StudentDashboard from './pages/StudentDashboard';
import SubmitAssignment from './pages/SubmitAssignment';
import Grades from './pages/Grades';

import './styles.css';

function ProtectedRoute({ children, allowedRole }) {
  const { userRole } = useApp();
  if (!userRole) return <Navigate to="/" replace />;
  if (userRole !== allowedRole) return <Navigate to="/" replace />;
  return children;
}

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 20, fontFamily: 'sans-serif', color: '#c00', background: '#fee' }}>
          <h2>Error</h2>
          <pre style={{ overflow: 'auto' }}>{this.state.error.toString()}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRole="teacher"><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/create" element={<ProtectedRoute allowedRole="teacher"><CreateAssignment /></ProtectedRoute>} />
          <Route path="/teacher/submissions" element={<ProtectedRoute allowedRole="teacher"><Submissions /></ProtectedRoute>} />
          <Route path="/student/dashboard" element={<ProtectedRoute allowedRole="student"><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/submit" element={<ProtectedRoute allowedRole="student"><SubmitAssignment /></ProtectedRoute>} />
          <Route path="/student/grades" element={<ProtectedRoute allowedRole="student"><Grades /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
