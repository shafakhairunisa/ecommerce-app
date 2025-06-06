package com.stiwk2024.backend.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.stiwk2024.backend.model.CartItem;
import com.stiwk2024.backend.model.Product;
import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.service.CartService;
import com.stiwk2024.backend.service.ProductService;
import com.stiwk2024.backend.service.UserService;

@RestController
@RequestMapping("/api/customer/cart")
public class CustomerCartController {
    
    private final CartService cartService;
    private final UserService userService;
    private final ProductService productService;
    
    @Autowired
    public CustomerCartController(
            CartService cartService,
            UserService userService,
            ProductService productService) {
        this.cartService = cartService;
        this.userService = userService;
        this.productService = productService;
    }
    
    // Get all items in the cart
    @GetMapping
    public ResponseEntity<CartResponse> getCart(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<CartItem> cartItems = cartService.getCartItems(user);
        BigDecimal total = cartService.getCartTotal(user);
        
        List<CartItemDTO> cartItemDTOs = cartItems.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        CartResponse response = new CartResponse(cartItemDTOs, total);
        return ResponseEntity.ok(response);
    }
    
    // Add product to cart
    @PostMapping("/items")
    public ResponseEntity<CartItemDTO> addToCart(
            @RequestBody AddToCartRequest request,
            Authentication authentication) {
        
        User user = getCurrentUser(authentication);
        
        Product product = productService.getProductById(request.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        
        try {
            CartItem cartItem = cartService.addToCart(user, product, request.getQuantity());
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(cartItem));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
    
    // Update cart item quantity
    @PutMapping("/items/{productId}")
    public ResponseEntity<CartItemDTO> updateCartItem(
            @PathVariable Long productId,
            @RequestBody UpdateCartItemRequest request,
            Authentication authentication) {
        
        User user = getCurrentUser(authentication);
        
        try {
            CartItem updatedItem = cartService.updateCartItemQuantity(user, productId, request.getQuantity());
            return ResponseEntity.ok(convertToDTO(updatedItem));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
    
    // Remove item from cart
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeFromCart(
            @PathVariable Long productId,
            Authentication authentication) {
        
        User user = getCurrentUser(authentication);
        
        try {
            cartService.removeFromCart(user, productId);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }
    
    // Clear entire cart
    @DeleteMapping
    public ResponseEntity<Void> clearCart(Authentication authentication) {
        User user = getCurrentUser(authentication);
        cartService.clearCart(user);
        return ResponseEntity.noContent().build();
    }
    
    // Helper method to get current user
    private User getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        
        return userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }
    
    // Helper method to convert CartItem to DTO
    private CartItemDTO convertToDTO(CartItem item) {
        return new CartItemDTO(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getProduct().getDescription(),
                item.getProduct().getPrice(),
                item.getQuantity(),
                item.getSubtotal(),
                item.getProduct().getImagePath()
        );
    }
    
    // DTO classes
    public static class CartItemDTO {
        private Long id;
        private Long productId;
        private String productName;
        private String productDescription;
        private BigDecimal productPrice;
        private Integer quantity;
        private BigDecimal subtotal;
        private String imagePath;
        
        public CartItemDTO(Long id, Long productId, String productName, String productDescription,
                          BigDecimal productPrice, Integer quantity, BigDecimal subtotal, String imagePath) {
            this.id = id;
            this.productId = productId;
            this.productName = productName;
            this.productDescription = productDescription;
            this.productPrice = productPrice;
            this.quantity = quantity;
            this.subtotal = subtotal;  // Add this line
            this.imagePath = imagePath;  // Add this line
        }
        
        // Getters
        public Long getId() { return id; }
        public Long getProductId() { return productId; }
        public String getProductName() { return productName; }
        public String getProductDescription() { return productDescription; }
        public BigDecimal getProductPrice() { return productPrice; }
        public Integer getQuantity() { return quantity; }
        public BigDecimal getSubtotal() { return subtotal; }
        public String getImagePath() { return imagePath; }
    }
    
    public static class CartResponse {
        private List<CartItemDTO> items;
        private BigDecimal total;
        private int itemCount;
        
        public CartResponse(List<CartItemDTO> items, BigDecimal total) {
            this.items = items;
            this.total = total;
            this.itemCount = items.size();
        }
        
        // Getters
        public List<CartItemDTO> getItems() { return items; }
        public BigDecimal getTotal() { return total; }
        public int getItemCount() { return itemCount; }
    }
    
    public static class AddToCartRequest {
        private Long productId;
        private Integer quantity;

        // Getters and Setters
        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
    
    public static class UpdateCartItemRequest {
        private Integer quantity;
        
        // Getters and setters
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
    }
}