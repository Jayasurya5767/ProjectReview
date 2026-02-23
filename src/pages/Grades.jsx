import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useApp } from '../context/AppContext';

const studentLinks = [
  { path: '/student/dashboard', label: 'Dashboard' },
  { path: '/student/submit', label: 'Submit Assignment' },
  { path: '/student/grades', label: 'Grades' }
];

export default function Grades() {
  const { assignments, submissions, currentStudent, logout } = useApp();

  const mySubmissions = submissions.filter(
    (s) => s.studentName === currentStudent
  );

  const getAssignmentTitle = (assignmentId) => {
    return assignments.find((a) => a.id === assignmentId)?.title ?? 'Unknown';
  };

  return (
    <div className="layout">
      <Navbar links={studentLinks} onLogout={logout} />
      <main className="main-content">
        <h1>My Grades</h1>
        <p className="page-desc">View your assignment grades and feedback</p>
        <div className="card-grid">
          {mySubmissions.length === 0 ? (
            <Card>
              <p>No submissions yet.</p>
              <Link to="/student/submit" className="btn btn-primary btn-sm">
                Submit an Assignment
              </Link>
            </Card>
          ) : (
            mySubmissions.map((sub) => (
              <Card key={sub.id}>
                <div className="grade-header">
                  <h3>{getAssignmentTitle(sub.assignmentId)}</h3>
                  <span className={`status-badge ${sub.status}`}>
                    {sub.status === 'graded' ? 'Graded' : 'Pending'}
                  </span>
                </div>
                {sub.status === 'graded' ? (
                  <>
                    <p className="grade-marks">
                      <strong>Marks:</strong> {sub.marks}/100
                    </p>
                    <p className="grade-feedback">
                      <strong>Feedback:</strong> {sub.feedback}
                    </p>
                  </>
                ) : (
                  <p className="grade-pending">Awaiting grading</p>
                )}
                <p className="grade-meta">
                  Submitted: {new Date(sub.submittedAt).toLocaleString()} • {sub.fileName}
                </p>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
