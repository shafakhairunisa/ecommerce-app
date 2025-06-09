package com.stiwk2024.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;  // Add this import
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.stiwk2024.backend.security.JwtAuthenticationEntryPoint;
import com.stiwk2024.backend.security.JwtRequestFilter;
import com.stiwk2024.backend.service.UserService; // CHANGED: Import UserService

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    @Lazy  // Add this annotation
    private UserService userService; // CHANGED: Use UserService instead of CustomUserDetailsService
    
    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    
    @Autowired
    private JwtRequestFilter jwtRequestFilter;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                // Allow public access to product endpoints and authentication
                .requestMatchers("/api/products/**").permitAll()
                .requestMatchers("/api/categories/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/vouchers/all").permitAll()
                .requestMatchers("/api/vouchers/{id}").permitAll()
                
                // Require admin role for admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/orders").hasRole("ADMIN")
                .requestMatchers("/api/orders/search").hasRole("ADMIN")
                .requestMatchers("/api/orders/status/**").hasRole("ADMIN")
                
                // Require authentication for cart endpoints
                .requestMatchers("/api/customer/cart/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/orders").authenticated()
                .requestMatchers("/api/orders/my-orders").authenticated()
                .requestMatchers("/api/vouchers").authenticated()
                
                // All other requests need authentication
                .anyRequest().authenticated()
            )
            .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthenticationEntryPoint))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        
        // Add JWT filter before the standard filter chain
        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}