package com.stiwk2024.backend.service.impl;

import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.model.UserVoucher;
import com.stiwk2024.backend.model.Voucher;
import com.stiwk2024.backend.repository.OrderRepository;
import com.stiwk2024.backend.repository.UserVoucherRepository;
import com.stiwk2024.backend.repository.VoucherRepository;
import com.stiwk2024.backend.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;
    private final UserVoucherRepository userVoucherRepository;
    private final OrderRepository orderRepository;

    @Autowired
    public VoucherServiceImpl(VoucherRepository voucherRepository,
                             UserVoucherRepository userVoucherRepository,
                             OrderRepository orderRepository) {
        this.voucherRepository = voucherRepository;
        this.userVoucherRepository = userVoucherRepository;
        this.orderRepository = orderRepository;
    }

    @Override
    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    @Override
    public Optional<Voucher> getVoucherById(Long id) {
        return voucherRepository.findById(id);
    }

    @Override
    public Optional<Voucher> getVoucherByCode(String code) {
        return voucherRepository.findByCode(code);
    }

    @Override
    public List<UserVoucher> getUserAvailableVouchers(User user) {
        return userVoucherRepository.findByUserAndIsUsedFalse(user);
    }

    @Override
    @Transactional
    public UserVoucher assignVoucherToUser(User user, Voucher voucher) {
        // Check if user already has this voucher
        if (userVoucherRepository.existsByUserAndVoucherAndIsUsedFalse(user, voucher)) {
            throw new IllegalStateException("User already has this voucher");
        }
        
        UserVoucher userVoucher = new UserVoucher(user, voucher);
        return userVoucherRepository.save(userVoucher);
    }

    @Override
    @Transactional
    public void markVoucherAsUsed(UserVoucher userVoucher) {
        userVoucher.setUsed(true);
        userVoucherRepository.save(userVoucher);
    }

    @Override
    @Transactional
    public Voucher saveVoucher(Voucher voucher) {
        return voucherRepository.save(voucher);
    }

    @Override
    @Transactional
    public Optional<UserVoucher> autoAssignVoucherBasedOnAmount(User user, BigDecimal amount) {
        // Find the appropriate voucher based on purchase amount
        // >=50, 3% off; >=100, 5% off; >=200, 8% off
        
        String voucherCode;
        if (amount.compareTo(new BigDecimal("200")) >= 0) {
            voucherCode = "VOUCHER8"; // 8% off for >=200
        } else if (amount.compareTo(new BigDecimal("100")) >= 0) {
            voucherCode = "VOUCHER5"; // 5% off for >=100
        } else if (amount.compareTo(new BigDecimal("50")) >= 0) {
            voucherCode = "VOUCHER3"; // 3% off for >=50
        } else {
            return Optional.empty(); // Amount doesn't qualify for a voucher
        }
        
        Optional<Voucher> voucher = voucherRepository.findByCode(voucherCode);
        if (voucher.isPresent()) {
            try {
                UserVoucher userVoucher = assignVoucherToUser(user, voucher.get());
                return Optional.of(userVoucher);
            } catch (IllegalStateException e) {
                // User already has this voucher, which is fine
                return Optional.empty();
            }
        }
        
        return Optional.empty();
    }
} 