package com.stiwk2024.backend.controller;

import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserService userService;

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        String username = authentication.getName();
        return userService.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    // DTO for viewing profile
    public static class UserProfileDTO {
        private Long id;
        private String username;
        private String email;
        private String address;

        public UserProfileDTO(Long id, String username, String email, String address) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.address = address;
        }

        // Getters
        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getEmail() { return email; }
        public String getAddress() { return address; }
    }

    // DTO for updating profile
    public static class UpdateProfileRequestDTO {
        @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
        private String username;

        @Email(message = "Email should be valid")
        private String email;

        private String address;

        // Getters and Setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
    }

    // DTO for changing password
    public static class ChangePasswordRequestDTO {
        @NotEmpty(message = "Old password cannot be empty")
        private String oldPassword;

        @NotEmpty(message = "New password cannot be empty")
        @Size(min = 6, message = "New password must be at least 6 characters long")
        private String newPassword;

        // Getters and Setters
        public String getOldPassword() { return oldPassword; }
        public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    @GetMapping
    public ResponseEntity<UserProfileDTO> getUserProfile(Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        UserProfileDTO profileDTO = new UserProfileDTO(
                currentUser.getId(),
                currentUser.getUsername(),
                currentUser.getEmail(),
                currentUser.getAddress()
        );
        return ResponseEntity.ok(profileDTO);
    }

    @PutMapping
    public ResponseEntity<UserProfileDTO> updateUserProfile(@Valid @RequestBody UpdateProfileRequestDTO request, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);

        boolean updated = false;

        if (request.getUsername() != null && !request.getUsername().equals(currentUser.getUsername())) {
            // Check if new username is already taken by another user
            if (!currentUser.getUsername().equalsIgnoreCase(request.getUsername()) && userService.findByUsername(request.getUsername()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Username already exists");
            }
            currentUser.setUsername(request.getUsername());
            updated = true;
        }

        if (request.getEmail() != null && !request.getEmail().equals(currentUser.getEmail())) {
            // Check if new email is already taken by another user
            if (!currentUser.getEmail().equalsIgnoreCase(request.getEmail()) && userService.findByEmail(request.getEmail()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already exists");
            }
            currentUser.setEmail(request.getEmail());
            updated = true;
        }

        if (request.getAddress() != null && !request.getAddress().equals(currentUser.getAddress())) {
            currentUser.setAddress(request.getAddress());
            updated = true;
        }

        if (updated) {
            userService.saveUser(currentUser); // Assuming saveUser handles updates if ID exists
        }

        UserProfileDTO profileDTO = new UserProfileDTO(
                currentUser.getId(),
                currentUser.getUsername(),
                currentUser.getEmail(),
                currentUser.getAddress()
        );
        return ResponseEntity.ok(profileDTO);
    }

    @PutMapping("/password")
    public ResponseEntity<String> changePassword(@Valid @RequestBody ChangePasswordRequestDTO request, Authentication authentication) {
        User currentUser = getCurrentUser(authentication);
        try {
            userService.updatePassword(currentUser.getId(), request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok("Password updated successfully");
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
}