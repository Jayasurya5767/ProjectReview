import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

// API base URL
const API_BASE = '/api';

export function AppProvider({ children }) {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [user, setUser] = useState(null); // {id, username, email, role}
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  // Set up axios interceptor for token
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        // Set up axios headers
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } catch (e) {
        logout();
      }
    }
  }, []);

  const loadData = async (userId) => {
    const idToUse = userId || user?.id;
    if (!idToUse || !token) return;
    
    try {
      const [assignmentsRes] = await Promise.all([
        axios.get(`${API_BASE}/assignments`)
      ]);
      setAssignments(assignmentsRes.data.map(a => ({
        ...a,
        deadline: a.dueDate ? a.dueDate.split('T')[0] : '',
        createdAt: a.dueDate ? a.dueDate.split('T')[0] : ''
      })));

      // Only load student submissions if user is a student
      if (user?.role === 'STUDENT') {
        try {
          const submissionsRes = await axios.get(
            `${API_BASE}/submissions/student/${idToUse}?page=0&size=10`
          );
          setSubmissions(submissionsRes.data.content?.map(s => ({
            ...s,
            assignmentId: s.assignment.id,
            marks: s.grade,
            status: s.grade !== null ? 'graded' : 'pending',
            submittedAt: s.submittedAt,
            fileName: 'submission.txt'
          })) || []);
        } catch (e) {
          console.error('Failed to load submissions:', e);
        }
      }
    } catch (error) {
      console.error('Failed to load assignments:', error);
    }
  };

  const login = async (username, password) => {
    setLoading(true);
    console.log('🔑 AppContext: Starting login for', username);
    
    try {
      console.log('📡 AppContext: Making POST request to /api/auth/login');
      const response = await axios.post(`${API_BASE}/auth/login`, { username, password });
      
      console.log('✅ AppContext: Login response received:', response.data);
      
      const { token: newToken, user: userData } = response.data;
      
      console.log('💾 AppContext: Storing token and user:', { 
        tokenLength: newToken?.length,
        userData 
      });
      
      // Set headers for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Update state
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('✨ AppContext: State updated, returning success');
      
      // Return success with user data
      return { success: true, user: userData };
    } catch (error) {
      console.error('❌ AppContext: Login error:', error);
      console.error('📋 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password, role) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/auth/register`, { username, email, password, role });
      return { success: true, user: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAssignments([]);
    setSubmissions([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const addAssignment = async (assignment) => {
    if (!token) return;
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/assignments`, {
        title: assignment.title,
        description: assignment.description,
        dueDate: assignment.deadline,
        totalPoints: 100,
      });
      const newAssignment = response.data;
      setAssignments(prev => [newAssignment, ...prev]);
    } catch (error) {
      console.error('Failed to add assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSubmission = async (submission) => {
    if (!token) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('assignmentId', submission.assignmentId);
      formData.append('content', submission.content);
      if (submission.file) {
        formData.append('file', submission.file);
      }

      const response = await axios.post(`${API_BASE}/submissions`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newSubmission = response.data;
      setSubmissions(prev => [newSubmission, ...prev]);
    } catch (error) {
      console.error('Failed to add submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const gradeSubmission = async (submissionId, marks, feedback) => {
    if (!token) return;
    setLoading(true);
    try {
      await axios.put(`${API_BASE}/submissions/${submissionId}/grade`, null, {
        params: { grade: marks, feedback }
      });
      setSubmissions(prev =>
        prev.map(sub =>
          sub.id === submissionId
            ? { ...sub, grade: marks, status: 'graded' }
            : sub
        )
      );
    } catch (error) {
      console.error('Failed to grade submission:', error);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    assignments,
    submissions,
    user,
    token,
    loading,
    login,
    register,
    logout,
    addAssignment,
    addSubmission,
    gradeSubmission,
    loadData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
