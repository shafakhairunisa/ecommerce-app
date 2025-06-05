package com.stiwk2024.backend.repository;

import com.stiwk2024.backend.model.Order;
import com.stiwk2024.backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    List<OrderItem> findByOrder(Order order);
    
    void deleteByOrder(Order order);
} 