package com.example.backend;

import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class BackendApplication implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        // Create demo users if they don't exist
        if (userRepository.findByUsername("teacher").isEmpty()) {
            User teacher = new User();
            teacher.setUsername("teacher");
            teacher.setEmail("teacher@example.com");
            teacher.setPassword(passwordEncoder.encode("password"));
            teacher.setRole(User.Role.TEACHER);
            userRepository.save(teacher);
            System.out.println("Created demo teacher user");
        }

        if (userRepository.findByUsername("student").isEmpty()) {
            User student = new User();
            student.setUsername("student");
            student.setEmail("student@example.com");
            student.setPassword(passwordEncoder.encode("password"));
            student.setRole(User.Role.STUDENT);
            userRepository.save(student);
            System.out.println("Created demo student user");
        }
    }
}
