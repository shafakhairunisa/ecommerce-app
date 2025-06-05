package com.stiwk2024.backend.service.impl;

import com.stiwk2024.backend.model.Order;
import com.stiwk2024.backend.model.OrderItem;
import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.model.UserVoucher;
import com.stiwk2024.backend.model.Voucher;
import com.stiwk2024.backend.repository.OrderItemRepository;
import com.stiwk2024.backend.repository.OrderRepository;
import com.stiwk2024.backend.service.OrderService;
import com.stiwk2024.backend.service.VoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final VoucherService voucherService;

    @Autowired
    public OrderServiceImpl(OrderRepository orderRepository,
                          OrderItemRepository orderItemRepository,
                          VoucherService voucherService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.voucherService = voucherService;
    }

    @Override
    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Override
    public List<Order> getUserOrders(User user) {
        return orderRepository.findByUser(user);
    }

    @Override
    public Page<Order> getUserOrders(User user, Pageable pageable) {
        return orderRepository.findByUser(user, pageable);
    }

    @Override
    public List<Order> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    @Override
    public Page<Order> getOrdersByStatus(Order.OrderStatus status, Pageable pageable) {
        return orderRepository.findByStatus(status, pageable);
    }

    @Override
    public List<Order> searchOrdersByUsername(String username) {
        return orderRepository.searchByUsername(username);
    }

    @Override
    public Page<Order> searchOrdersByUsername(String username, Pageable pageable) {
        return orderRepository.searchByUsername(username, pageable);
    }

    @Override
    @Transactional
    public Order createOrder(User user, List<OrderItem> orderItems, UserVoucher userVoucher, BigDecimal deliveryFee) {
        // Calculate total price from order items
        BigDecimal totalPrice = calculateTotalPrice(orderItems);
        
        // Apply voucher discount if provided
        if (userVoucher != null) {
            BigDecimal discountPercent = userVoucher.getVoucher().getDiscountPercent();
            BigDecimal discount = totalPrice.multiply(discountPercent.divide(new BigDecimal("100")));
            totalPrice = totalPrice.subtract(discount);
        }
        
        // Add delivery fee
        totalPrice = totalPrice.add(deliveryFee);
        
        // Create the order
        Order order = new Order();
        order.setUser(user);
        order.setTotalPrice(totalPrice);
        order.setDeliveryFee(deliveryFee);
        order.setStatus(Order.OrderStatus.pending);
        if (userVoucher != null) {
            order.setVoucher(userVoucher.getVoucher());
            // Mark voucher as used
            voucherService.markVoucherAsUsed(userVoucher);
        }
        
        // Save the order first to get its ID
        order = orderRepository.save(order);
        
        // Add order items
        for (OrderItem item : orderItems) {
            item.setOrder(order);
            orderItemRepository.save(item);
            order.getOrderItems().add(item);
        }
        
        return order;
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long orderId, Order.OrderStatus status) {
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            
            // Check if status is changing from pending to confirmed
            if (order.getStatus() == Order.OrderStatus.pending && status == Order.OrderStatus.confirmed) {
                // Update the status
                order.setStatus(status);
                // Save the order
                order = orderRepository.save(order);
                
                // Auto-assign voucher based on total price
                User user = order.getUser();
                BigDecimal totalPrice = order.getTotalPrice();
                
                if (totalPrice.compareTo(new BigDecimal("200")) >= 0) {
                    // For purchases ≥ 200, assign 8% voucher
                    Optional<Voucher> voucher = voucherService.getVoucherByCode("VOUCHER8");
                    if (voucher.isPresent()) {
                        try {
                            voucherService.assignVoucherToUser(user, voucher.get());
                        } catch (IllegalStateException e) {
                            // User already has this voucher, which is fine
                        }
                    }
                } else if (totalPrice.compareTo(new BigDecimal("100")) >= 0) {
                    // For purchases ≥ 100, assign 5% voucher
                    Optional<Voucher> voucher = voucherService.getVoucherByCode("VOUCHER5");
                    if (voucher.isPresent()) {
                        try {
                            voucherService.assignVoucherToUser(user, voucher.get());
                        } catch (IllegalStateException e) {
                            // User already has this voucher, which is fine
                        }
                    }
                } else if (totalPrice.compareTo(new BigDecimal("50")) >= 0) {
                    // For purchases ≥ 50, assign 3% voucher
                    Optional<Voucher> voucher = voucherService.getVoucherByCode("VOUCHER3");
                    if (voucher.isPresent()) {
                        try {
                            voucherService.assignVoucherToUser(user, voucher.get());
                        } catch (IllegalStateException e) {
                            // User already has this voucher, which is fine
                        }
                    }
                }
                
                return order;
            } else {
                // Just update the status for other cases
                order.setStatus(status);
                return orderRepository.save(order);
            }
        } else {
            throw new IllegalArgumentException("Order not found with ID: " + orderId);
        }
    }

    @Override
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Override
    public Page<Order> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable);
    }
    
    // Helper method to calculate total price from order items
    private BigDecimal calculateTotalPrice(List<OrderItem> items) {
        BigDecimal total = BigDecimal.ZERO;
        for (OrderItem item : items) {
            total = total.add(item.getSubtotal());
        }
        return total;
    }
} 