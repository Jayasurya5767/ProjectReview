import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

// Mock initial data
const initialAssignments = [
  {
    id: 1,
    title: 'Introduction to React',
    description: 'Create a simple React component with useState and useEffect hooks.',
    deadline: '2025-03-01',
    createdAt: '2025-02-15'
  },
  {
    id: 2,
    title: 'REST API Design',
    description: 'Design RESTful API endpoints for a blog application.',
    deadline: '2025-03-10',
    createdAt: '2025-02-18'
  },
  {
    id: 3,
    title: 'Database Schema',
    description: 'Design normalized database schema for an e-commerce system.',
    deadline: '2025-03-15',
    createdAt: '2025-02-20'
  }
];

const initialSubmissions = [
  {
    id: 1,
    assignmentId: 1,
    studentName: 'John Doe',
    fileName: 'react-component.jsx',
    submittedAt: '2025-02-25T10:30:00',
    marks: 85,
    feedback: 'Good implementation. Consider adding error boundaries.',
    status: 'graded'
  },
  {
    id: 2,
    assignmentId: 1,
    studentName: 'Jane Smith',
    fileName: 'my-component.jsx',
    submittedAt: '2025-02-26T14:20:00',
    marks: null,
    feedback: null,
    status: 'pending'
  },
  {
    id: 3,
    assignmentId: 2,
    studentName: 'John Doe',
    fileName: 'api-design.pdf',
    submittedAt: '2025-03-01T09:15:00',
    marks: null,
    feedback: null,
    status: 'pending'
  }
];

export function AppProvider({ children }) {
  const [assignments, setAssignments] = useState(initialAssignments);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [userRole, setUserRole] = useState(null); // 'teacher' | 'student'
  const [currentStudent] = useState('John Doe'); // Simulated logged-in student

  const addAssignment = (assignment) => {
    const newAssignment = {
      ...assignment,
      id: Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAssignments(prev => [newAssignment, ...prev]);
  };

  const addSubmission = (submission) => {
    const newSubmission = {
      ...submission,
      id: Date.now(),
      studentName: currentStudent,
      submittedAt: new Date().toISOString(),
      marks: null,
      feedback: null,
      status: 'pending'
    };
    setSubmissions(prev => [newSubmission, ...prev]);
  };

  const gradeSubmission = (submissionId, marks, feedback) => {
    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === submissionId
          ? { ...sub, marks, feedback, status: 'graded' }
          : sub
      )
    );
  };

  const logout = () => setUserRole(null);

  const value = {
    assignments,
    submissions,
    userRole,
    setUserRole,
    currentStudent,
    addAssignment,
    addSubmission,
    gradeSubmission,
    logout
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
