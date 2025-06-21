package my.stiwk2124.qurba.Controllers;

import my.stiwk2124.qurba.JPAentities.Order;
import my.stiwk2124.qurba.JPAentities.User;
import my.stiwk2124.qurba.Security.CustomUserDetails;
import my.stiwk2124.qurba.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/checkout")
// Temporarily comment out PreAuthorize for testing
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
public class CheckoutController {
    @Autowired
    private OrderService orderService;

    // Temporarily disabled for testing
    private void verifyUserId(Long userId) {
        try {
            CustomUserDetails userDetails = (CustomUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userDetails.getUser();
            if (!user.getUserId().equals(userId)) {
                throw new SecurityException("Unauthorized access to checkout");
            }
        } catch (Exception e) {
            // Log the exception but continue for testing
            System.out.println("User verification bypassed for testing: " + e.getMessage());
        }
    }

    @PostMapping("/{userId}")
    public ResponseEntity<?> checkout(@PathVariable Long userId) {
        try {
            // Verify user authorization
            if (!isAuthorizedUser(userId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("Unauthorized access");
            }

            Order order = orderService.checkout(userId);
            return ResponseEntity.ok(order);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error processing checkout: " + e.getMessage());
        }
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