package com.stiwk2024.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.security.JwtTokenUtil;
import com.stiwk2024.backend.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        // Check if username or email already exist
        if (userService.findByUsername(request.getUsername()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
        }
        if (userService.findByEmail(request.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
        }

        // Check if this is an admin registration
        boolean isAdmin = false;
        if (request.getAdminKey() != null && request.getAdminKey().equals("admin-secret-key")) {
            isAdmin = true;
        }

        // Create new user with proper role
        User user = new User(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                request.getAddress(),
                isAdmin // Will be true for admin registrations
        );

        // Save the user
        user = userService.saveUser(user);

        // Generate token
        final UserDetails userDetails = userService.loadUserByUsername(user.getUsername());
        final String token = jwtTokenUtil.generateToken(userDetails);

        return ResponseEntity.status(HttpStatus.CREATED).body(
                new AuthResponse(token, user.getUsername(), user.isAdmin())
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            final UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            final String token = jwtTokenUtil.generateToken(userDetails);

            // Get user from database
            User user = userService.findByUsername(userDetails.getUsername())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), user.isAdmin()));
        } catch (BadCredentialsException e) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
        }
    }

    // Data transfer objects
    public static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String address;
        private String adminKey; // Add this field

        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getAdminKey() { return adminKey; }
        public void setAdminKey(String adminKey) { this.adminKey = adminKey; }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AuthResponse {
        private String token;
        private String username;
        private boolean isAdmin;

        public AuthResponse(String token, String username, boolean isAdmin) {
            this.token = token;
            this.username = username;
            this.isAdmin = isAdmin;
        }

        // Getters
        public String getToken() { return token; }
        public String getUsername() { return username; }
        public boolean isAdmin() { return isAdmin; }
    }
}