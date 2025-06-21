package my.stiwk2124.qurba.Controllers;

import my.stiwk2124.qurba.JPAentities.Cart;
import my.stiwk2124.qurba.Security.CustomUserDetails;
import my.stiwk2124.qurba.service.CartService;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")  
public class CartController {
private static final Logger logger = LoggerFactory.getLogger(CartController.class);
    @Autowired
    private CartService cartService;
    
    @GetMapping("/test")
    public ResponseEntity<String> testAuth() {
        return ResponseEntity.ok("Authentication successful");
    }

     @GetMapping("/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Long userId) {
        try {
            // Verify user authorization
            if (!isAuthorizedUser(userId)) {
                logger.warn("Unauthorized access attempt for cart userId: {}", userId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Unauthorized access");
            }
            Cart cart = cartService.getOrCreateCart(userId);
            logger.info("Successfully retrieved cart for userId: {}", userId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            logger.error("Error getting cart for userId {}: {}", userId, e.getMessage());
            return ResponseEntity.status(500).body("Error getting cart: " + e.getMessage());
        }
    }

    @PostMapping("/{userId}/add")
    public ResponseEntity<?> addToCart(
            @PathVariable Long userId,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") int quantity) {
        try {
            Cart cart = cartService.addItemToCart(userId, productId, quantity);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error adding to cart: " + e.getMessage());
        }
    }

    @PutMapping("/{userId}/update")
    public ResponseEntity<?> updateCartItem(
            @PathVariable Long userId,
            @RequestParam Long productId,
            @RequestParam int quantity) {
        try {
            Cart cart = cartService.updateCartItem(userId, productId, quantity);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error updating cart: " + e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/remove")
    public ResponseEntity<?> removeFromCart(
            @PathVariable Long userId,
            @RequestParam Long productId) {
        try {
            Cart cart = cartService.removeItemFromCart(userId, productId);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error removing item from cart: " + e.getMessage());
        }
    }

    @DeleteMapping("/{userId}/clear")
    public ResponseEntity<Cart> clearCart(@PathVariable Long userId) {
        cartService.clearCart(userId);
        // Return an empty cart after clearing
        return ResponseEntity.ok(cartService.getOrCreateCart(userId));
    }

        private boolean isAuthorizedUser(Long userId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();
            return userDetails.getUser().getUserId().equals(userId) || 
                   auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        }
        return false;
    }
}