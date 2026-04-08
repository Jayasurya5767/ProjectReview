import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

import LandingPage from './pages/LandingPage';
import TeacherDashboard from './pages/TeacherDashboard';
import CreateAssignment from './pages/CreateAssignment';
import Submissions from './pages/Submissions';
import StudentDashboard from './pages/StudentDashboard';
import SubmitAssignment from './pages/SubmitAssignment';
import Grades from './pages/Grades';

function ProtectedRoute({ children, allowedRole }) {
  const { user, token } = useApp();
  
  // Fallback to localStorage if context state hasn't updated yet
  let storedToken = token || localStorage.getItem('token');
  let storedUser = user;
  
  // If we don't have user from context, try to get from localStorage
  if (!storedUser) {
    try {
      const stored = localStorage.getItem('user');
      if (stored) {
        storedUser = JSON.parse(stored);
        console.log('✅ ProtectedRoute: Loaded user from localStorage:', storedUser);
      }
    } catch (e) {
      console.error('❌ ProtectedRoute: Failed to parse stored user:', e);
      localStorage.removeItem('user'); // Clear invalid data
    }
  }

  console.log('🛡️ ProtectedRoute check:', {
    path: window.location.pathname,
    hasToken: !!storedToken,
    hasUser: !!storedUser,
    userRole: storedUser?.role,
    allowedRole,
    isAuthorized: storedToken && storedUser && storedUser.role === allowedRole
  });

  // If no token, redirect to login
  if (!storedToken) {
    console.log('❌ ProtectedRoute: No token found, redirecting to /');
    return <Navigate to="/" replace />;
  }

  // If no user, redirect to login
  if (!storedUser) {
    console.log('❌ ProtectedRoute: No user found, redirecting to /');
    return <Navigate to="/" replace />;
  }

  // Check role matches
  if (storedUser.role !== allowedRole) {
    console.log(`❌ ProtectedRoute: User role mismatch. Got: ${storedUser.role}, Expected: ${allowedRole}, redirecting to /`);
    return <Navigate to="/" replace />;
  }

  console.log('✅ ProtectedRoute: Authorization granted, rendering component');
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/teacher/dashboard"
            element={
              <ProtectedRoute allowedRole="TEACHER">
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/create"
            element={
              <ProtectedRoute allowedRole="TEACHER">
                <CreateAssignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher/submissions"
            element={
              <ProtectedRoute allowedRole="TEACHER">
                <Submissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/submit"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <SubmitAssignment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/grades"
            element={
              <ProtectedRoute allowedRole="STUDENT">
                <Grades />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
