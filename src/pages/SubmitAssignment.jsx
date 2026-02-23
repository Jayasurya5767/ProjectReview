import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useApp } from '../context/AppContext';

const studentLinks = [
  { path: '/student/dashboard', label: 'Dashboard' },
  { path: '/student/submit', label: 'Submit Assignment' },
  { path: '/student/grades', label: 'Grades' }
];

export default function SubmitAssignment() {
  const { assignments, addSubmission, logout } = useApp();
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [fileName, setFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAssignment || !fileName) return;
    addSubmission({
      assignmentId: parseInt(selectedAssignment, 10),
      fileName
    });
    setSelectedAssignment('');
    setFileName('');
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="layout">
      <Navbar links={studentLinks} onLogout={logout} />
      <main className="main-content">
        <h1>Submit Assignment</h1>
        <p className="page-desc">Upload your assignment file</p>
        <Card className="form-card">
          {submitted && (
            <div className="alert alert-success">Assignment submitted successfully!</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="assignment">Select Assignment</label>
              <select
                id="assignment"
                value={selectedAssignment}
                onChange={(e) => setSelectedAssignment(e.target.value)}
                required
              >
                <option value="">Choose an assignment...</option>
                {assignments.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} (Deadline: {a.deadline})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="file">Upload File</label>
              <input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.js,.jsx,.txt"
              />
              {fileName && <p className="file-name">Selected: {fileName}</p>}
            </div>
            <button type="submit" className="btn btn-primary" disabled={!fileName}>
              Submit
            </button>
          </form>
        </Card>
      </main>
    </div>
  );
}
