import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useApp } from '../context/AppContext';

const studentLinks = [
  { path: '/student/dashboard', label: 'Dashboard' },
  { path: '/student/submit', label: 'Submit Assignment' },
  { path: '/student/grades', label: 'Grades' }
];

export default function StudentDashboard() {
  const { assignments, logout, loadData, user } = useApp();

  useEffect(() => {
    if (user?.id) {
      loadData(user.id);
    }
  }, [user?.id]);

  return (
    <div className="layout">
      <Navbar links={studentLinks} onLogout={logout} />
      <main className="main-content">
        <h1>Student Dashboard</h1>
        <p className="page-desc">Available assignments</p>
        <div className="card-grid">
          {assignments.map((assignment) => (
            <Card key={assignment.id}>
              <h3>{assignment.title}</h3>
              <p className="card-desc">{assignment.description}</p>
              <p className="card-meta">
                <span className="badge">Deadline: {assignment.deadline}</span>
              </p>
              <Link to="/student/submit" className="btn btn-outline btn-sm">
                Submit
              </Link>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
