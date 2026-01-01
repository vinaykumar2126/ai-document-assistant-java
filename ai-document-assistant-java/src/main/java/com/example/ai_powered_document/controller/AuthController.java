package com.example.ai_powered_document.controller;

import com.example.ai_powered_document.model.User;
import com.example.ai_powered_document.repository.UserRepository;
import com.example.ai_powered_document.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.ai_powered_document.dto.RegisterRequest;
import com.example.ai_powered_document.dto.LoginRequest;
import com.example.ai_powered_document.dto.AuthResponse;
import java.time.LocalDateTime;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ✅ NEW: Register endpoint
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        
        System.out.println("📝 Register attempt: " + request.getUsername());
        
        // Check if username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        
        // Create new user
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        
        // Encrypt password with BCrypt
        String encryptedPassword = passwordEncoder.encode(request.getPassword());
        user.setPassword(encryptedPassword);
        
        // Save to database
        userRepository.save(user);
        
        System.out.println("✅ User registered: " + request.getUsername());
        
        return ResponseEntity.ok("User registered successfully");
    }

    // ✅ UPDATED: Login endpoint (Database version)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        
        System.out.println("🔐 Login attempt: " + request.getUsername());
        
        // Find user in database
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());
        
        if (userOptional.isEmpty()) {
            System.out.println("❌ User not found: " + request.getUsername());
            return ResponseEntity.status(401).body("Invalid username or password");
        }
        
        User user = userOptional.get();
        
        // Verify password using BCrypt
        boolean passwordMatches = passwordEncoder.matches(
            request.getPassword(), 
            user.getPassword()
        );
        
        if (!passwordMatches) {
            System.out.println("❌ Invalid password for: " + request.getUsername());
            return ResponseEntity.status(401).body("Invalid username or password");
        }
        
        // Update last login time
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getUsername());
        
        System.out.println("✅ Login successful: " + request.getUsername());
        
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername()));
    }
}
 