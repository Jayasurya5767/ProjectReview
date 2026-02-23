import React, { useState } from 'react';

export default function GradeModal({ submission, onClose, onSave }) {
  const [marks, setMarks] = useState(submission?.marks ?? '');
  const [feedback, setFeedback] = useState(submission?.feedback ?? '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedMarks = parseInt(marks, 10);
    if (!isNaN(parsedMarks) && parsedMarks >= 0 && parsedMarks <= 100) {
      onSave(submission.id, parsedMarks, feedback);
      onClose();
    }
  };

  if (!submission) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Grade Submission</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          <p><strong>Student:</strong> {submission.studentName}</p>
          <p><strong>File:</strong> {submission.fileName}</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="marks">Marks (0-100)</label>
              <input
                id="marks"
                type="number"
                min="0"
                max="100"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="feedback">Feedback</label>
              <textarea
                id="feedback"
                rows="4"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter feedback for the student..."
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Grade
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
