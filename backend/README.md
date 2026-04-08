# Spring Boot Backend for Assignment Submission and Grading System

This backend provides a complete REST API for an online assignment submission and grading system with JWT authentication, role-based access control, file uploads, and deadline management.

## Features
- JWT Authentication & Authorization (TEACHER/ STUDENT roles)
- CRUD operations for Assignments and Submissions
- File upload for assignment submissions
- Deadline checking and status tracking
- Pagination support
- Global exception handling
- Swagger UI documentation
- MySQL persistence

## Tech Stack
- Spring Boot 3.2.4
- Spring Security with JWT
- Spring Data JPA
- MySQL
- Maven

## Setup
1. Install Java 17 and Maven
2. Create MySQL database: `assignment_db`
3. Update `application.properties` with your MySQL credentials
4. Run: `mvn spring-boot:run`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Assignments (TEACHER role required for create/update/delete)
- `GET /api/assignments` - Get all assignments
- `GET /api/assignments/{id}` - Get assignment by ID
- `POST /api/assignments` - Create new assignment
- `PUT /api/assignments/{id}` - Update assignment
- `DELETE /api/assignments/{id}` - Delete assignment

### Submissions
- `GET /api/submissions` - Get all submissions (TEACHER)
- `GET /api/submissions/student/{studentId}` - Get student's submissions (STUDENT)
- `GET /api/submissions/assignment/{assignmentId}` - Get submissions for assignment (TEACHER)
- `GET /api/submissions/{id}` - Get submission by ID
- `POST /api/submissions` - Submit assignment (with optional file)
- `PUT /api/submissions/{id}/grade` - Grade submission (TEACHER)
- `DELETE /api/submissions/{id}` - Delete submission (TEACHER)

## Example API Usage

### Register User
```json
POST /api/auth/register
{
  "username": "teacher1",
  "email": "teacher@example.com",
  "password": "password123",
  "role": "TEACHER"
}
```

### Login
```json
POST /api/auth/login
{
  "username": "teacher1",
  "password": "password123"
}
```

Response:
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "username": "teacher1",
    "email": "teacher@example.com",
    "role": "TEACHER"
  }
}
```

### Create Assignment (Include JWT in Authorization header: Bearer <token>)
```json
POST /api/assignments
{
  "title": "Java Assignment",
  "description": "Implement a REST API",
  "dueDate": "2024-12-31T23:59:59",
  "totalPoints": 100
}
```

### Submit Assignment
```http
POST /api/submissions
Content-Type: multipart/form-data

assignmentId: 1
content: "My submission content"
file: [uploaded file]
```

## Database Schema
- `users` - User accounts with roles
- `assignments` - Assignment details with deadlines
- `submissions` - Student submissions with status and grades

## Security
- JWT tokens required for protected endpoints
- Role-based access control
- Password encryption with BCrypt

## File Upload
- Files stored in `uploads/` directory
- Supported formats: PDF, DOC, DOCX, etc.
- Max file size: 10MB

## Status Tracking
- SUBMITTED: Initial submission
- GRADED: Teacher has graded
- LATE: Submitted after deadline
