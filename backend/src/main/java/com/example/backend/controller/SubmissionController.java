package com.example.backend.controller;

import com.example.backend.dto.SubmissionDTO;
import com.example.backend.model.User;
import com.example.backend.service.SubmissionService;
import com.example.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {
    private final SubmissionService submissionService;
    private final UserService userService;
    private final Path fileStorageLocation = Paths.get("uploads").toAbsolutePath().normalize();

    public SubmissionController(SubmissionService submissionService, UserService userService) {
        this.submissionService = submissionService;
        this.userService = userService;
        try {
            Files.createDirectories(fileStorageLocation);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory");
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('TEACHER')")
    public List<SubmissionDTO> getAllSubmissions() {
        return submissionService.getAllSubmissions();
    }

    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT')")
    public Page<SubmissionDTO> getSubmissionsByStudent(@PathVariable Long studentId,
                                                     @RequestParam(defaultValue = "0") int page,
                                                     @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return submissionService.getSubmissionsByStudent(studentId, pageable);
    }

    @GetMapping("/assignment/{assignmentId}")
    @PreAuthorize("hasRole('TEACHER')")
    public Page<SubmissionDTO> getSubmissionsByAssignment(@PathVariable Long assignmentId,
                                                        @RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return submissionService.getSubmissionsByAssignment(assignmentId, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubmissionDTO> getSubmissionById(@PathVariable Long id) {
        try {
            SubmissionDTO submission = submissionService.getSubmissionById(id);
            return ResponseEntity.ok(submission);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<SubmissionDTO> createSubmission(@RequestParam Long assignmentId,
                                                        @RequestParam String content,
                                                        @RequestParam(required = false) MultipartFile file,
                                                        Authentication authentication) {
        try {
            String username = authentication.getName();
            User user = userService.findByUsername(username);
            Long studentId = user.getId();

            String filePath = null;
            if (file != null && !file.isEmpty()) {
                String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path targetLocation = fileStorageLocation.resolve(fileName);
                Files.copy(file.getInputStream(), targetLocation);
                filePath = targetLocation.toString();
            }

            SubmissionDTO submission = submissionService.createSubmission(studentId, assignmentId, content, filePath);
            return ResponseEntity.ok(submission);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/grade")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<SubmissionDTO> gradeSubmission(@PathVariable Long id,
                                                       @RequestParam Integer grade,
                                                       @RequestParam String feedback) {
        try {
            SubmissionDTO submission = submissionService.gradeSubmission(id, grade, feedback);
            return ResponseEntity.ok(submission);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Void> deleteSubmission(@PathVariable Long id) {
        try {
            submissionService.deleteSubmission(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
