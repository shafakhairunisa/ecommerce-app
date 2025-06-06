package com.stiwk2024.backend.service.impl;

import com.stiwk2024.backend.model.Cart;
import com.stiwk2024.backend.model.CartItem;
import com.stiwk2024.backend.model.Product;
import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.repository.CartItemRepository;
import com.stiwk2024.backend.repository.CartRepository;
import com.stiwk2024.backend.repository.ProductRepository;
import com.stiwk2024.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CartServiceImpl implements CartService {
    
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    
    @Autowired
    public CartServiceImpl(
            CartRepository cartRepository,
            CartItemRepository cartItemRepository,
            ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
    }
    
    @Override
    @Transactional
    public Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = new Cart(user);
                    return cartRepository.save(newCart);
                });
    }
    
    @Override
    public List<CartItem> getCartItems(User user) {
        Optional<Cart> cartOpt = cartRepository.findByUser(user);
        return cartOpt.map(Cart::getCartItems).orElse(new ArrayList<>());
    }
    
    @Override
    @Transactional
    public CartItem addToCart(User user, Product product, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        
        // Check if product exists
        if (!productRepository.existsById(product.getId())) {
            throw new IllegalArgumentException("Product not found");
        }
        
        // Get or create user's cart
        Cart cart = getOrCreateCart(user);
        
        // Check if product is already in cart
        Optional<CartItem> existingItem = cartItemRepository.findByCartAndProduct(cart, product);
        
        if (existingItem.isPresent()) {
            // Update quantity of existing item
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        } else {
            // Add new item to cart
            CartItem newItem = new CartItem(cart, product, quantity);
            cart.addCartItem(newItem);
            return cartItemRepository.save(newItem);
        }
    }
    
    @Override
    @Transactional
    public CartItem updateCartItemQuantity(User user, Long productId, Integer quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }
        
        Cart cart = getOrCreateCart(user);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        
        CartItem item = cartItemRepository.findByCartAndProduct(cart, product)
                .orElseThrow(() -> new IllegalArgumentException("Product not found in cart"));
        
        item.setQuantity(quantity);
        return cartItemRepository.save(item);
    }
    
    @Override
    @Transactional
    public void removeFromCart(User user, Long productId) {
        Cart cart = getOrCreateCart(user);
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        
        cartItemRepository.deleteByCartAndProduct(cart, product);
    }
    
    @Override
    @Transactional
    public void clearCart(User user) {
        Optional<Cart> cartOpt = cartRepository.findByUser(user);
        
        if (cartOpt.isPresent()) {
            Cart cart = cartOpt.get();
            cartItemRepository.deleteByCart(cart);
            cart.getCartItems().clear();
        }
    }
    
    @Override
    public BigDecimal getCartTotal(User user) {
        List<CartItem> items = getCartItems(user);
        
        return items.stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}