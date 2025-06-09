package com.stiwk2024.backend.service.impl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.repository.UserRepository;
import com.stiwk2024.backend.service.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Implementation for UserDetailsService
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        
        // Add ROLE_ADMIN if the user is an admin
        if (user.isAdmin()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }
        
        // Regular user authority
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(), 
                user.getPassword(), 
                authorities);
    }

    @Override
    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public User saveUser(User user) {
        // Encode password if it's not already encoded
        if (user.getId() == null) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    @Override
    public boolean isAdmin(User user) {
        return user.isAdmin();
    }

    @Override
    @Transactional
    public User updateAddress(Long userId, String address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        user.setAddress(address);
        return userRepository.save(user);
    }

    @Override
    @Transactional
    public User updatePassword(Long userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + userId));
        
        // Verify old password
        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }
        
        // Update password
        user.setPassword(passwordEncoder.encode(newPassword));
        return userRepository.save(user);
    }
}