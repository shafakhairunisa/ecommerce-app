package my.stiwk2124.qurba.Controllers;

import my.stiwk2124.qurba.JPAentities.Wishlist;
import my.stiwk2124.qurba.dto.WishlistResponse;
import my.stiwk2124.qurba.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    @Autowired
    private WishlistService wishlistService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Wishlist>> getUserWishlist(@PathVariable Long userId) {
        return ResponseEntity.ok(wishlistService.getUserWishlist(userId));
    }

    @PostMapping("/{userId}/add/{productId}")
    public ResponseEntity<?> addToWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        try {
               WishlistResponse wishlist = wishlistService.addToWishlist(userId, productId);
            return ResponseEntity.ok(wishlist);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{userId}/remove/{productId}")
    public ResponseEntity<?> removeFromWishlist(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        try {
            wishlistService.removeFromWishlist(userId, productId);
            return ResponseEntity.ok()
                .body(Map.of("message", "Product removed from wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{userId}/check/{productId}")
    public ResponseEntity<Map<String, Boolean>> checkWishlistStatus(
            @PathVariable Long userId,
            @PathVariable Long productId) {
        boolean isInWishlist = wishlistService.isInWishlist(userId, productId);
        return ResponseEntity.ok(Map.of("inWishlist", isInWishlist));
    }
}