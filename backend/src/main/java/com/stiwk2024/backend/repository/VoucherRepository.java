package com.stiwk2024.backend.repository;

import com.stiwk2024.backend.model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoucherRepository extends JpaRepository<Voucher, Long> {
    
    Optional<Voucher> findByCode(String code);
    
    List<Voucher> findByMinPurchaseLessThanEqualOrderByMinPurchaseDesc(BigDecimal amount);
    
    // Find voucher with the highest discount for a specific purchase amount
    default Optional<Voucher> findBestVoucherForAmount(BigDecimal amount) {
        List<Voucher> vouchers = findByMinPurchaseLessThanEqualOrderByMinPurchaseDesc(amount);
        return vouchers.isEmpty() ? Optional.empty() : Optional.of(vouchers.get(0));
    }
} 