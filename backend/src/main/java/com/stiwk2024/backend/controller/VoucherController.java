package com.stiwk2024.backend.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.model.UserVoucher;
import com.stiwk2024.backend.model.Voucher;
import com.stiwk2024.backend.service.UserService;
import com.stiwk2024.backend.service.VoucherService;

@RestController
@RequestMapping("/api/vouchers")
public class VoucherController {
    
    private final VoucherService voucherService;
    private final UserService userService;
    
    @Autowired
    public VoucherController(VoucherService voucherService, UserService userService) {
        this.voucherService = voucherService;
        this.userService = userService;
    }
    
    // Get all available system vouchers
    @GetMapping("/all")
    public ResponseEntity<List<Voucher>> getAllVouchers() {
        return ResponseEntity.ok(voucherService.getAllVouchers());
    }
    
    // Get current user's available vouchers
    @GetMapping
    public ResponseEntity<List<UserVoucherDTO>> getUserVouchers(Authentication authentication) {
        User user = getCurrentUser(authentication);
        
        List<UserVoucher> userVouchers = voucherService.getUserAvailableVouchers(user);
        List<UserVoucherDTO> userVoucherDTOs = userVouchers.stream()
                .map(uv -> new UserVoucherDTO(
                        uv.getId(),
                        uv.getVoucher().getId(),
                        uv.getVoucher().getCode(),
                        uv.getVoucher().getDiscountPercent(),
                        uv.getVoucher().getMinPurchase(),
                        uv.getVoucher().getDescription(),
                        uv.getVoucher().getImagePath(),
                        uv.isUsed(),
                        uv.getAssignedAt()))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(userVoucherDTOs);
    }
    
    // Get a specific voucher by id
    @GetMapping("/{id}")
    public ResponseEntity<Voucher> getVoucherById(@PathVariable Long id) {
        return voucherService.getVoucherById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Voucher not found"));
    }
    
    // Create a new voucher (admin only)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Voucher> createVoucher(@RequestBody Voucher voucher) {
        return ResponseEntity.status(HttpStatus.CREATED).body(voucherService.saveVoucher(voucher));
    }
    
    // Update an existing voucher (admin only)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Voucher> updateVoucher(@PathVariable Long id, @RequestBody Voucher voucher) {
        if (!voucherService.getVoucherById(id).isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Voucher not found");
        }
        
        voucher.setId(id);
        return ResponseEntity.ok(voucherService.saveVoucher(voucher));
    }
    
    // Trigger voucher generation (for testing)
    @GetMapping("/trigger")
    public ResponseEntity<String> triggerVoucherGeneration(
            Authentication authentication,
            @RequestParam(required = false, defaultValue = "100.00") BigDecimal amount) {
        
        User user = getCurrentUser(authentication);
        
        Optional<UserVoucher> userVoucher = voucherService.autoAssignVoucherBasedOnAmount(user, amount);
        
        if (userVoucher.isPresent()) {
            return ResponseEntity.ok("Voucher assigned successfully: " + userVoucher.get().getVoucher().getCode() + 
                    " (" + userVoucher.get().getVoucher().getDiscountPercent() + "% off)");
        } else {
            return ResponseEntity.ok("No voucher assigned. Either the amount doesn't qualify for a voucher or you already have the eligible voucher.");
        }
    }
    
    // Delete a voucher by id (admin only)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteVoucher(@PathVariable Long id) {
        Optional<Voucher> voucher = voucherService.getVoucherById(id);
        if (!voucher.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Voucher not found");
        }
        
        // Actually call the service method
        voucherService.deleteVoucher(id);
        
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
    
    // DTO for sending user voucher info to client
    private static class UserVoucherDTO {
        private Long id;
        private Long voucherId;
        private String code;
        private BigDecimal discountPercent;
        private BigDecimal minPurchase;
        private String description;
        private String imagePath;
        private boolean used;
        private String assignedAt;
        
        public UserVoucherDTO(Long id, Long voucherId, String code, BigDecimal discountPercent, 
                            BigDecimal minPurchase, String description, boolean used, 
                            java.time.LocalDateTime assignedAt) {
            this.id = id;
            this.voucherId = voucherId;
            this.code = code;
            this.discountPercent = discountPercent;
            this.minPurchase = minPurchase;
            this.description = description;
            this.used = used;
            this.assignedAt = assignedAt.toString();
        }
        
        public UserVoucherDTO(Long id, Long voucherId, String code, BigDecimal discountPercent, 
                            BigDecimal minPurchase, String description, String imagePath, 
                            boolean used, java.time.LocalDateTime assignedAt) {
            this.id = id;
            this.voucherId = voucherId;
            this.code = code;
            this.discountPercent = discountPercent;
            this.minPurchase = minPurchase;
            this.description = description;
            this.imagePath = imagePath;
            this.used = used;
            this.assignedAt = assignedAt.toString();
        }
        
        // Getters
        public Long getId() { return id; }
        public Long getVoucherId() { return voucherId; }
        public String getCode() { return code; }
        public BigDecimal getDiscountPercent() { return discountPercent; }
        public BigDecimal getMinPurchase() { return minPurchase; }
        public String getDescription() { return description; }
        public String getImagePath() { return imagePath; }
        public boolean isUsed() { return used; }
        public String getAssignedAt() { return assignedAt; }
    }
}