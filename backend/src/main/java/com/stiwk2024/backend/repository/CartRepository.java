package com.stiwk2024.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stiwk2024.backend.model.Cart;
import com.stiwk2024.backend.model.User;

@Repository
public interface CartRepository extends JpaRepository<Cart, Long> {
    
    Optional<Cart> findByUser(User user);
    
    boolean existsByUser(User user);
}