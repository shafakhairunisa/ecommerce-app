package com.stiwk2024.backend.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.model.UserVoucher;
import com.stiwk2024.backend.model.Voucher;

public interface VoucherService {
    
    // Get all vouchers in the system
    List<Voucher> getAllVouchers();
    
    // Get voucher by id
    Optional<Voucher> getVoucherById(Long id);
    
    // Get voucher by code
    Optional<Voucher> getVoucherByCode(String code);
    
    // Get all vouchers assigned to a user that haven't been used
    List<UserVoucher> getUserAvailableVouchers(User user);
    
    // Assign a voucher to a user
    UserVoucher assignVoucherToUser(User user, Voucher voucher);
    
    // Mark a user's voucher as used
    void markVoucherAsUsed(UserVoucher userVoucher);
    
    // Create or update a voucher
    Voucher saveVoucher(Voucher voucher);
    
    // Auto-assign voucher based on purchase amount (for first-time buyers)
    Optional<UserVoucher> autoAssignVoucherBasedOnAmount(User user, BigDecimal amount);
    
    // Delete a voucher by id
    void deleteVoucher(Long id);
}