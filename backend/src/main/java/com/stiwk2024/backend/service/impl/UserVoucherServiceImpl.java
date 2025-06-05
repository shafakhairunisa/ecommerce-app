package com.stiwk2024.backend.service.impl;

import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.model.UserVoucher;
import com.stiwk2024.backend.model.Voucher;
import com.stiwk2024.backend.repository.UserVoucherRepository;
import com.stiwk2024.backend.service.UserVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserVoucherServiceImpl implements UserVoucherService {

    private final UserVoucherRepository userVoucherRepository;

    @Autowired
    public UserVoucherServiceImpl(UserVoucherRepository userVoucherRepository) {
        this.userVoucherRepository = userVoucherRepository;
    }

    @Override
    public Optional<UserVoucher> getUserVoucherById(Long id) {
        return userVoucherRepository.findById(id);
    }

    @Override
    public List<UserVoucher> getUserVouchers(User user) {
        return userVoucherRepository.findAll().stream()
                .filter(uv -> uv.getUser().getId().equals(user.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<UserVoucher> getUserUnusedVouchers(User user) {
        return userVoucherRepository.findByUserAndIsUsedFalse(user);
    }

    @Override
    @Transactional
    public UserVoucher assignVoucherToUser(User user, Voucher voucher) {
        // Check if user already has this voucher unused
        if (userVoucherRepository.existsByUserAndVoucherAndIsUsedFalse(user, voucher)) {
            throw new IllegalStateException("User already has this voucher");
        }
        
        UserVoucher userVoucher = new UserVoucher();
        userVoucher.setUser(user);
        userVoucher.setVoucher(voucher);
        userVoucher.setUsed(false);
        userVoucher.setAssignedAt(LocalDateTime.now());
        
        return userVoucherRepository.save(userVoucher);
    }

    @Override
    @Transactional
    public UserVoucher markVoucherAsUsed(Long userVoucherId) {
        UserVoucher userVoucher = userVoucherRepository.findById(userVoucherId)
                .orElseThrow(() -> new IllegalArgumentException("User voucher not found with ID: " + userVoucherId));
        
        if (userVoucher.isUsed()) {
            throw new IllegalStateException("Voucher is already used");
        }
        
        userVoucher.setUsed(true);
        userVoucher.setUsedAt(LocalDateTime.now());
        
        return userVoucherRepository.save(userVoucher);
    }

    @Override
    public boolean hasUnusedVoucher(User user, Voucher voucher) {
        return userVoucherRepository.existsByUserAndVoucherAndIsUsedFalse(user, voucher);
    }
} 