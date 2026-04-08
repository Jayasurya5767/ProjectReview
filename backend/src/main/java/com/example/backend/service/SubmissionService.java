package com.example.backend.service;

import com.example.backend.dto.SubmissionDTO;
import com.example.backend.model.Assignment;
import com.example.backend.model.Submission;
import com.example.backend.model.User;
import com.example.backend.repository.AssignmentRepository;
import com.example.backend.repository.SubmissionRepository;
import com.example.backend.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;

    public SubmissionService(SubmissionRepository submissionRepository,
                           AssignmentRepository assignmentRepository,
                           UserRepository userRepository) {
        this.submissionRepository = submissionRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
    }

    public List<SubmissionDTO> getAllSubmissions() {
        return submissionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Page<SubmissionDTO> getSubmissionsByStudent(Long studentId, Pageable pageable) {
        return submissionRepository.findByStudentId(studentId, pageable)
                .map(this::toDTO);
    }

    public Page<SubmissionDTO> getSubmissionsByAssignment(Long assignmentId, Pageable pageable) {
        return submissionRepository.findByAssignmentId(assignmentId, pageable)
                .map(this::toDTO);
    }

    public SubmissionDTO getSubmissionById(Long id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));
        return toDTO(submission);
    }

    public SubmissionDTO createSubmission(Long studentId, Long assignmentId, String content, String filePath) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        // Check deadline
        LocalDateTime now = LocalDateTime.now();
        Submission.Status status = now.isAfter(assignment.getDueDate()) ? Submission.Status.LATE : Submission.Status.SUBMITTED;

        Submission submission = new Submission();
        submission.setStudent(student);
        submission.setAssignment(assignment);
        submission.setContent(content);
        submission.setFilePath(filePath);
        submission.setStatus(status);
        submission.setSubmittedAt(now);

        submission = submissionRepository.save(submission);
        return toDTO(submission);
    }

    public SubmissionDTO gradeSubmission(Long id, Integer grade, String feedback) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        submission.setGrade(grade);
        submission.setFeedback(feedback);
        submission.setStatus(Submission.Status.GRADED);

        submission = submissionRepository.save(submission);
        return toDTO(submission);
    }

    public void deleteSubmission(Long id) {
        submissionRepository.deleteById(id);
    }

    private SubmissionDTO toDTO(Submission submission) {
        return new SubmissionDTO(
                submission.getId(),
                submission.getStudent().getId(),
                submission.getStudent().getUsername(),
                submission.getAssignment().getId(),
                submission.getContent(),
                submission.getFilePath(),
                submission.getGrade(),
                submission.getFeedback(),
                submission.getStatus().name(),
                submission.getSubmittedAt()
        );
    }
}