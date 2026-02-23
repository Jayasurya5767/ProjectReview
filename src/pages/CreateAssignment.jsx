import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { useApp } from '../context/AppContext';

const teacherLinks = [
  { path: '/teacher/dashboard', label: 'Dashboard' },
  { path: '/teacher/create', label: 'Create Assignment' },
  { path: '/teacher/submissions', label: 'Submissions' }
];

export default function CreateAssignment() {
  const navigate = useNavigate();
  const { addAssignment, logout } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addAssignment({ title, description, deadline });
    setTitle('');
    setDescription('');
    setDeadline('');
    navigate('/teacher/dashboard');
  };

  return (
    <div className="layout">
      <Navbar links={teacherLinks} onLogout={logout} />
      <main className="main-content">
        <h1>Create Assignment</h1>
        <p className="page-desc">Add a new assignment for students</p>
        <Card className="form-card">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Assignment title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Assignment description"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="deadline">Deadline</label>
              <input
                id="deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Create Assignment
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/teacher/dashboard')}
              >
                Cancel
              </button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
}
