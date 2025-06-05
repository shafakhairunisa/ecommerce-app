package com.stiwk2024.backend.service;

import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.model.UserVoucher;
import com.stiwk2024.backend.model.Voucher;
import java.util.List;
import java.util.Optional;

public interface UserVoucherService {
    
    // Get a user voucher by id
    Optional<UserVoucher> getUserVoucherById(Long id);
    
    // Get all vouchers for a user
    List<UserVoucher> getUserVouchers(User user);
    
    // Get all unused vouchers for a user
    List<UserVoucher> getUserUnusedVouchers(User user);
    
    // Assign a voucher to a user
    UserVoucher assignVoucherToUser(User user, Voucher voucher);
    
    // Mark a voucher as used
    UserVoucher markVoucherAsUsed(Long userVoucherId);
    
    // Check if a user has a specific voucher that's unused
    boolean hasUnusedVoucher(User user, Voucher voucher);
} 