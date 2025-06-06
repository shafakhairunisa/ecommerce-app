package com.stiwk2024.backend.service;

import java.util.List;

import com.stiwk2024.backend.model.Cart;
import com.stiwk2024.backend.model.CartItem;
import com.stiwk2024.backend.model.Product;
import com.stiwk2024.backend.model.User;

public interface CartService {
    
    // Get or create user's cart
    Cart getOrCreateCart(User user);
    
    // Get cart items
    List<CartItem> getCartItems(User user);
    
    // Add product to cart
    CartItem addToCart(User user, Product product, Integer quantity);
    
    // Update cart item quantity
    CartItem updateCartItemQuantity(User user, Long productId, Integer quantity);
    
    // Remove product from cart
    void removeFromCart(User user, Long productId);
    
    // Clear cart
    void clearCart(User user);
    
    // Get cart total
    java.math.BigDecimal getCartTotal(User user);
}