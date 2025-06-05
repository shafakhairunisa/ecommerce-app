package com.stiwk2024.backend.service;

import com.stiwk2024.backend.model.Order;
import com.stiwk2024.backend.model.OrderItem;
import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.model.UserVoucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface OrderService {

    // Get order by id
    Optional<Order> getOrderById(Long id);
    
    // Get all orders for a specific user
    List<Order> getUserOrders(User user);
    
    // Get user orders with pagination
    Page<Order> getUserOrders(User user, Pageable pageable);
    
    // Get all orders with a specific status
    List<Order> getOrdersByStatus(Order.OrderStatus status);
    
    // Get orders by status with pagination
    Page<Order> getOrdersByStatus(Order.OrderStatus status, Pageable pageable);
    
    // Search orders by username (for admin)
    List<Order> searchOrdersByUsername(String username);
    
    // Search orders by username with pagination (for admin)
    Page<Order> searchOrdersByUsername(String username, Pageable pageable);
    
    // Create a new order
    Order createOrder(User user, List<OrderItem> orderItems, UserVoucher userVoucher, BigDecimal deliveryFee);
    
    // Update order status
    Order updateOrderStatus(Long orderId, Order.OrderStatus status);
    
    // Get all orders (for admin)
    List<Order> getAllOrders();
    
    // Get all orders with pagination (for admin)
    Page<Order> getAllOrders(Pageable pageable);
} 