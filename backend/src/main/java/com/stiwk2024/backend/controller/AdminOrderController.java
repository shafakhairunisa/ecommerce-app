package com.stiwk2024.backend.controller;

import com.stiwk2024.backend.model.Order;
import com.stiwk2024.backend.model.OrderItem;
import com.stiwk2024.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    @Autowired
    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        List<OrderDTO> orderDTOs = orders.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailDTO> getOrderById(@PathVariable Long id) {
        Optional<Order> orderOpt = orderService.getOrderById(id);
        if (orderOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        }
        return ResponseEntity.ok(convertToDetailDTO(orderOpt.get()));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request) {

        Order.OrderStatus status;
        try {
            status = Order.OrderStatus.valueOf(request.getStatus().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status");
        }

        try {
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(convertToDTO(updatedOrder));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    @GetMapping("/counts")
    public ResponseEntity<Map<String, Long>> getOrderCounts() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("total", (long) orderService.getAllOrders().size());

        for (Order.OrderStatus status : Order.OrderStatus.values()) {
            counts.put(status.name(), (long) orderService.getOrdersByStatus(status).size());
        }

        return ResponseEntity.ok(counts);
    }

    private OrderDTO convertToDTO(Order order) {
        return new OrderDTO(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getUsername(),
                order.getStatus().toString(),
                order.getTotalPrice(),
                order.getDeliveryFee(),
                order.getCreatedAt().toString(),
                order.getOrderItems().size());
    }

    private OrderDetailDTO convertToDetailDTO(Order order) {
        List<OrderItemDTO> items = order.getOrderItems().stream()
                .map(this::convertToItemDTO)
                .collect(Collectors.toList());

        return new OrderDetailDTO(
                order.getId(),
                order.getUser().getId(),
                order.getUser().getUsername(),
                order.getStatus().toString(),
                order.getTotalPrice(),
                order.getDeliveryFee(),
                order.getCreatedAt().toString(),
                order.getVoucher() != null ? order.getVoucher().getCode() : null,
                items);
    }

    private OrderItemDTO convertToItemDTO(OrderItem item) {
        return new OrderItemDTO(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                item.getPrice(),
                item.getQuantity(),
                item.getSubtotal(),
                item.getProduct().getImagePath());
    }

    // DTO classes
    public static class OrderDTO {
        private Long id;
        private Long userId;
        private String username;
        private String status;
        private BigDecimal total;
        private BigDecimal deliveryFee;
        private String createdAt;
        private int itemCount;

        public OrderDTO(Long id, Long userId, String username, String status,
                BigDecimal total, BigDecimal deliveryFee,
                String createdAt, int itemCount) {
            this.id = id;
            this.userId = userId;
            this.username = username;
            this.status = status;
            this.total = total;
            this.deliveryFee = deliveryFee;
            this.createdAt = createdAt;
            this.itemCount = itemCount;
        }

        // Getters
        public Long getId() {
            return id;
        }

        public Long getUserId() {
            return userId;
        }

        public String getUsername() {
            return username;
        }

        public String getStatus() {
            return status;
        }

        public BigDecimal getTotal() {
            return total;
        }

        public BigDecimal getDeliveryFee() {
            return deliveryFee;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public int getItemCount() {
            return itemCount;
        }
    }

    public static class OrderDetailDTO {
        private Long id;
        private Long userId;
        private String username;
        private String status;
        private BigDecimal total;
        private BigDecimal deliveryFee;
        private String createdAt;
        private String voucherCode;
        private List<OrderItemDTO> items;

        public OrderDetailDTO(Long id, Long userId, String username, String status,
                BigDecimal total, BigDecimal deliveryFee, String createdAt,
                String voucherCode, List<OrderItemDTO> items) {
            this.id = id;
            this.userId = userId;
            this.username = username;
            this.status = status;
            this.total = total;
            this.deliveryFee = deliveryFee;
            this.createdAt = createdAt;
            this.voucherCode = voucherCode;
            this.items = items;
        }

        // Getters
        public Long getId() {
            return id;
        }

        public Long getUserId() {
            return userId;
        }

        public String getUsername() {
            return username;
        }

        public String getStatus() {
            return status;
        }

        public BigDecimal getTotal() {
            return total;
        }

        public BigDecimal getDeliveryFee() {
            return deliveryFee;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public String getVoucherCode() {
            return voucherCode;
        }

        public List<OrderItemDTO> getItems() {
            return items;
        }
    }

    public static class OrderItemDTO {
        private Long id;
        private Long productId;
        private String productName;
        private BigDecimal price;
        private Integer quantity;
        private BigDecimal subtotal;
        private String imagePath;

        public OrderItemDTO(Long id, Long productId, String productName,
                BigDecimal price, Integer quantity, BigDecimal subtotal,
                String imagePath) {
            this.id = id;
            this.productId = productId;
            this.productName = productName;
            this.price = price;
            this.quantity = quantity;
            this.subtotal = subtotal;
            this.imagePath = imagePath;
        }

        // Getters
        public Long getId() {
            return id;
        }

        public Long getProductId() {
            return productId;
        }

        public String getProductName() {
            return productName;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public BigDecimal getSubtotal() {
            return subtotal;
        }

        public String getImagePath() {
            return imagePath;
        }
    }

    public static class UpdateOrderStatusRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}
