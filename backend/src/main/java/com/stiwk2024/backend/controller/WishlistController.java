package com.stiwk2024.backend.controller;

import com.stiwk2024.backend.model.Product;
import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.model.Wishlist;
import com.stiwk2024.backend.service.UserService;
import com.stiwk2024.backend.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;
    private final UserService userService;

    @Autowired
    public WishlistController(WishlistService wishlistService, UserService userService) {
        this.wishlistService = wishlistService;
        this.userService = userService;
    }

    // DTOs for Wishlist
    public record ProductSummaryDTO(Long id, String name, BigDecimal price, String imagePath, String categoryName) {}
    // WishlistItemDTO can remain as is, or be renamed to WishlistDTO for consistency,
    // but its structure is based on the data we want to return.
    public record WishlistItemDTO(Long id, ProductSummaryDTO product, LocalDateTime addedAt) {}

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated");
        }
        String username = authentication.getName();
        return userService.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private WishlistItemDTO convertToDTO(Wishlist item) {
        Product product = item.getProduct();
        ProductSummaryDTO productDTO = new ProductSummaryDTO(
                product.getId(),
                product.getName(),
                product.getPrice(),
                product.getImagePath(),
                product.getCategory() != null ? product.getCategory().getName() : null
        );
        return new WishlistItemDTO(item.getId(), productDTO, item.getAddedAt());
    }

    @GetMapping
    public ResponseEntity<List<WishlistItemDTO>> getUserWishlist(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Wishlist> wishlist = wishlistService.getUserWishlist(user);
        List<WishlistItemDTO> wishlistDTOs = wishlist.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(wishlistDTOs);
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<WishlistItemDTO> addItemToWishlist(@PathVariable Long productId, Authentication authentication) {
        User user = getCurrentUser(authentication);
        try {
            Wishlist addedItem = wishlistService.addItemToWishlist(user, productId);
            return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(addedItem));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error adding item to wishlist");
        }
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeItemFromWishlistByProductId(@PathVariable Long productId, Authentication authentication) {
        User user = getCurrentUser(authentication);
        try {
            wishlistService.removeItemFromWishlist(user, productId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Item not found in wishlist or product does not exist.");
        }
    }

    @DeleteMapping("/item/{wishlistItemId}")
    public ResponseEntity<Void> removeItemFromWishlistById(@PathVariable Long wishlistItemId, Authentication authentication) {
        User user = getCurrentUser(authentication);
        try {
            wishlistService.removeItemFromWishlistById(user, wishlistItemId);
            return ResponseEntity.noContent().build();
        } catch (SecurityException e) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Wishlist item not found.");
        }
    }
}