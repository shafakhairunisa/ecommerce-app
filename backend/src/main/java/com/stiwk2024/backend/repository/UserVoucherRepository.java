package com.stiwk2024.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.model.UserVoucher;
import com.stiwk2024.backend.model.Voucher;

@Repository
public interface UserVoucherRepository extends JpaRepository<UserVoucher, Long> {
    
    List<UserVoucher> findByUserAndIsUsedFalse(User user);
    
    Optional<UserVoucher> findByUserAndVoucherAndIsUsedFalse(User user, Voucher voucher);
    
    boolean existsByUserAndVoucherAndIsUsedFalse(User user, Voucher voucher);
    
    Optional<UserVoucher> findById(Long id);
    
    void deleteByVoucher_Id(Long voucherId);
}