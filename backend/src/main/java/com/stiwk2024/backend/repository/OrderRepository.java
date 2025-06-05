package com.stiwk2024.backend.repository;

import com.stiwk2024.backend.model.Order;
import com.stiwk2024.backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    List<Order> findByUser(User user);
    
    Page<Order> findByUser(User user, Pageable pageable);
    
    List<Order> findByStatus(Order.OrderStatus status);
    
    Page<Order> findByStatus(Order.OrderStatus status, Pageable pageable);
    
    @Query("SELECT o FROM Order o WHERE LOWER(o.user.username) LIKE LOWER(CONCAT('%', :username, '%'))")
    List<Order> searchByUsername(@Param("username") String username);
    
    @Query("SELECT o FROM Order o WHERE LOWER(o.user.username) LIKE LOWER(CONCAT('%', :username, '%'))")
    Page<Order> searchByUsername(@Param("username") String username, Pageable pageable);
    
    // Check if user has any previous orders (for voucher assignment logic)
    boolean existsByUser(User user);
} 