package com.stiwk2024.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stiwk2024.backend.model.Cart;
import com.stiwk2024.backend.model.CartItem;
import com.stiwk2024.backend.model.Product;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    
    Optional<CartItem> findByCartAndProduct(Cart cart, Product product);
    
    void deleteByCart(Cart cart);
    
    void deleteByCartAndProduct(Cart cart, Product product);
}