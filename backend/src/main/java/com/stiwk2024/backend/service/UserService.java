package com.stiwk2024.backend.service;

import com.stiwk2024.backend.model.User;
import java.util.Optional;

public interface UserService {
    
    // Find user by username
    Optional<User> findByUsername(String username);
    
    // Find user by id
    Optional<User> findById(Long id);
    
    // Find user by email
    Optional<User> findByEmail(String email);
    
    // Save a user
    User saveUser(User user);
    
    // Check if a user is an admin
    boolean isAdmin(User user);
    
    // Update user address
    User updateAddress(Long userId, String address);
    
    // Update user password
    User updatePassword(Long userId, String oldPassword, String newPassword);
} 