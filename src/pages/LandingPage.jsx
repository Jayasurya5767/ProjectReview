import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { setUserRole } = useApp();

  const handleTeacherLogin = () => {
    setUserRole('teacher');
    navigate('/teacher/dashboard');
  };

  const handleStudentLogin = () => {
    setUserRole('student');
    navigate('/student/dashboard');
  };

  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">Online Assignment Submission & Grading System</h1>
        <p className="landing-subtitle">
          Streamline assignments, submissions, and grading in one place
        </p>
        <div className="landing-buttons">
          <button className="btn btn-primary btn-lg" onClick={handleTeacherLogin}>
            Login as Teacher
          </button>
          <button className="btn btn-secondary btn-lg" onClick={handleStudentLogin}>
            Login as Student
          </button>
        </div>
      </div>
    </div>
  );
}
