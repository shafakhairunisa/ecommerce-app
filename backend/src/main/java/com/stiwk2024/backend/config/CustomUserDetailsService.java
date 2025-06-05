package com.stiwk2024.backend.config;

import java.util.ArrayList;
import java.util.Collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        
        // Important: Add ROLE_ADMIN (with the ROLE_ prefix) if the user is an admin
        if (user.isAdmin()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }
        
        // Regular user authority
        authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
        
        // Return Spring Security UserDetails with our User's plaintext password for now
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(), 
                user.getPassword(), 
                authorities);
    }
}