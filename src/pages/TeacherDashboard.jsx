import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useApp } from '../context/AppContext';

const teacherLinks = [
  { path: '/teacher/dashboard', label: 'Dashboard' },
  { path: '/teacher/create', label: 'Create Assignment' },
  { path: '/teacher/submissions', label: 'Submissions' }
];

export default function TeacherDashboard() {
  const { assignments, logout } = useApp();

  return (
    <div className="layout">
      <Navbar links={teacherLinks} onLogout={logout} />
      <main className="main-content">
        <h1>Teacher Dashboard</h1>
        <p className="page-desc">Overview of all assignments</p>
        <div className="card-grid">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <h3>{assignment.title}</h3>
              <p className="card-desc">{assignment.description}</p>
              <p className="card-meta">
                <span className="badge">Deadline: {assignment.deadline}</span>
              </p>
              <Link to="/teacher/submissions" className="btn btn-outline btn-sm">
                View Submissions
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
