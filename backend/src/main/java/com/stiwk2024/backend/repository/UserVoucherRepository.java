package com.stiwk2024.backend.repository;

import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.model.UserVoucher;
import com.stiwk2024.backend.model.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserVoucherRepository extends JpaRepository<UserVoucher, Long> {
    
    List<UserVoucher> findByUserAndIsUsedFalse(User user);
    
    Optional<UserVoucher> findByUserAndVoucherAndIsUsedFalse(User user, Voucher voucher);
    
    boolean existsByUserAndVoucherAndIsUsedFalse(User user, Voucher voucher);
    
    Optional<UserVoucher> findById(Long id);
} 