package com.example.ai_powered_document.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    // In-memory storage for demo (replace with database in production)
    private Map<String, String> users = new HashMap<>();
    
    public AuthController() {
        // Add demo users
        users.put("admin", "password123");
        users.put("user", "user123");
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        // Validate input
        if (loginRequest.getUsername() == null || loginRequest.getPassword() == null) {
            return ResponseEntity.badRequest()
                .body(new LoginResponse("Username and password are required", false));
        }
        
        // Check credentials
        String storedPassword = users.get(loginRequest.getUsername());
        
        if (storedPassword != null && storedPassword.equals(loginRequest.getPassword())) {
            return ResponseEntity.ok(new LoginResponse("Login successful", true));
        }
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(new LoginResponse("Invalid credentials", false));
    }
    
    // @PostMapping("/register")
    // public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
    //     // Validate input
    //     if (registerRequest.getUsername() == null || registerRequest.getPassword() == null) {
    //         return ResponseEntity.badRequest()
    //             .body(new RegisterResponse("Username and password are required", false));
    //     }
        
    //     // Check if user already exists
    //     if (users.containsKey(registerRequest.getUsername())) {
    //         return ResponseEntity.status(HttpStatus.CONFLICT)
    //             .body(new RegisterResponse("Username already exists", false));
    //     }
        
    //     // Register new user
    //     users.put(registerRequest.getUsername(), registerRequest.getPassword());
        
    //     return ResponseEntity.ok(new RegisterResponse("User registered successfully", true));
    // }
    
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }
}

// DTO Classes
class LoginRequest {
    private String username;
    private String password;
    
    public LoginRequest() {}
    
    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}

class LoginResponse {
    private String message;
    private boolean success;
    
    public LoginResponse() {}
    
    public LoginResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
}

class RegisterRequest {
    private String username;
    private String password;
    private String email;
    
    public RegisterRequest() {}
    
    public RegisterRequest(String username, String password, String email) {
        this.username = username;
        this.password = password;
        this.email = email;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
}

class RegisterResponse {
    private String message;
    private boolean success;
    
    public RegisterResponse() {}
    
    public RegisterResponse(String message, boolean success) {
        this.message = message;
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
}