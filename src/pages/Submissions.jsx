import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import GradeModal from '../components/GradeModal';
import { useApp } from '../context/AppContext';

const teacherLinks = [
  { path: '/teacher/dashboard', label: 'Dashboard' },
  { path: '/teacher/create', label: 'Create Assignment' },
  { path: '/teacher/submissions', label: 'Submissions' }
];

export default function Submissions() {
  const { assignments, submissions, gradeSubmission, logout } = useApp();
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const getAssignmentTitle = (assignmentId) => {
    return assignments.find((a) => a.id === assignmentId)?.title ?? 'Unknown';
  };

  const handleGrade = (submissionId, marks, feedback) => {
    gradeSubmission(submissionId, marks, feedback);
    setSelectedSubmission(null);
  };

  return (
    <div className="layout">
      <Navbar links={teacherLinks} onLogout={logout} />
      <main className="main-content">
        <h1>Submissions</h1>
        <p className="page-desc">Review and grade student submissions</p>
        <div className="submissions-list">
          {submissions.map((submission) => (
            <Card key={submission.id} className="submission-card">
              <div className="submission-header">
                <div>
                  <h3>{getAssignmentTitle(submission.assignmentId)}</h3>
                  <p className="submission-meta">
                    {submission.studentName} • {submission.fileName} •{' '}
                    {new Date(submission.submittedAt).toLocaleString()}
                  </p>
                </div>
                <span className={`status-badge ${submission.status}`}>
                  {submission.status === 'graded' ? 'Graded' : 'Pending'}
                </span>
              </div>
              {submission.status === 'graded' && (
                <p className="submission-grade">
                  Marks: <strong>{submission.marks}/100</strong> • {submission.feedback}
                </p>
              )}
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setSelectedSubmission(submission)}
              >
                {submission.status === 'graded' ? 'View / Edit Grade' : 'Grade'}
              </button>
            </Card>
          ))}
        </div>
      </main>
      {selectedSubmission && (
        <GradeModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onSave={handleGrade}
        />
      )}
    </div>
  );
}
