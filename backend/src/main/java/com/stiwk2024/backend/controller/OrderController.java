package com.stiwk2024.backend.controller;

import com.stiwk2024.backend.model.Order;
import com.stiwk2024.backend.model.OrderItem;
import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.model.UserVoucher;
import com.stiwk2024.backend.service.OrderService;
import com.stiwk2024.backend.service.UserService;
import com.stiwk2024.backend.service.UserVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final UserVoucherService userVoucherService;

    @Autowired
    public OrderController(OrderService orderService,
                          UserService userService,
                          UserVoucherService userVoucherService) {
        this.orderService = orderService;
        this.userService = userService;
        this.userVoucherService = userVoucherService;
    }

    // Get all orders (admin only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderResponseDTO>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction) {
        
        Sort.Direction dir = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(dir, sort));
        
        Page<Order> orders = orderService.getAllOrders(pageable);
        Page<OrderResponseDTO> orderDTOs = orders.map(OrderResponseDTO::new);
        
        return ResponseEntity.ok(orderDTOs);
    }

    // Get orders for the current user
    @GetMapping("/my-orders")
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Order> orders = orderService.getUserOrders(user);
        List<OrderResponseDTO> orderDTOs = orders.stream()
                .map(OrderResponseDTO::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(orderDTOs);
    }

    // Get order by id
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(
            @PathVariable Long id,
            Authentication authentication) {
        
        Optional<Order> orderOpt = orderService.getOrderById(id);
        
        if (!orderOpt.isPresent()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        }
        
        Order order = orderOpt.get();
        User currentUser = getCurrentUser(authentication);
        
        // Check if the user is admin or the owner of the order
        if (!currentUser.isAdmin() && !order.getUser().getId().equals(currentUser.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        
        return ResponseEntity.ok(new OrderResponseDTO(order));
    }

    // Create a new order
    @PostMapping
    public ResponseEntity<OrderResponseDTO> createOrder(
            @RequestBody CreateOrderRequest request,
            Authentication authentication) {
        
        User user = getCurrentUser(authentication);
        
        // Check if user has an address (required for delivery)
        if (user.getAddress() == null || user.getAddress().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User address is required for order placement");
        }
        
        // Get user voucher if provided
        UserVoucher userVoucher = null;
        if (request.getUserVoucherId() != null) {
            userVoucher = userVoucherService.getUserVoucherById(request.getUserVoucherId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Voucher not found"));
            
            // Ensure voucher belongs to the user and is not used
            if (!userVoucher.getUser().getId().equals(user.getId()) || userVoucher.isUsed()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid voucher");
            }
        }
        
        // Create the order
        Order order = orderService.createOrder(
                user,
                request.getOrderItems(),
                userVoucher,
                request.getDeliveryFee() != null ? request.getDeliveryFee() : new BigDecimal("5.00") // Default delivery fee
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(new OrderResponseDTO(order));
    }

    // Update order status (admin only)
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponseDTO> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request) {
        
        // Validate status
        Order.OrderStatus status;
        try {
            status = Order.OrderStatus.valueOf(request.getStatus().toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status. Must be 'pending' or 'confirmed'");
        }
        
        // Update the order status
        try {
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(new OrderResponseDTO(updatedOrder));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    // Search orders by username (admin only)
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<OrderResponseDTO>> searchOrdersByUsername(
            @RequestParam String username,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Order> orders = orderService.searchOrdersByUsername(username, pageable);
        Page<OrderResponseDTO> orderDTOs = orders.map(OrderResponseDTO::new);
        
        return ResponseEntity.ok(orderDTOs);
    }

    // Get orders by status (admin only)
    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponseDTO>> getOrdersByStatus(@PathVariable String status) {
        Order.OrderStatus orderStatus;
        try {
            orderStatus = Order.OrderStatus.valueOf(status.toLowerCase());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid status. Must be 'pending' or 'confirmed'");
        }
        
        List<Order> orders = orderService.getOrdersByStatus(orderStatus);
        List<OrderResponseDTO> orderDTOs = orders.stream()
                .map(OrderResponseDTO::new)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(orderDTOs);
    }

    // Helper method to get current user
    private User getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }
        
        return userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    // Request object for creating an order
    public static class CreateOrderRequest {
        private List<OrderItem> orderItems;
        private Long userVoucherId;
        private BigDecimal deliveryFee;

        // Getters and setters
        public List<OrderItem> getOrderItems() {
            return orderItems;
        }

        public void setOrderItems(List<OrderItem> orderItems) {
            this.orderItems = orderItems;
        }

        public Long getUserVoucherId() {
            return userVoucherId;
        }

        public void setUserVoucherId(Long userVoucherId) {
            this.userVoucherId = userVoucherId;
        }

        public BigDecimal getDeliveryFee() {
            return deliveryFee;
        }

        public void setDeliveryFee(BigDecimal deliveryFee) {
            this.deliveryFee = deliveryFee;
        }
    }

    // Request object for updating order status
    public static class UpdateOrderStatusRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    // DTO for order responses with product details
    private static class OrderResponseDTO {
        private Long id;
        private String username;
        private String status;
        private BigDecimal totalPrice;
        private BigDecimal deliveryFee;
        private String voucherCode;
        private String createdAt;
        private List<OrderItemDTO> items;
        
        public OrderResponseDTO(Order order) {
            this.id = order.getId();
            this.username = order.getUser().getUsername();
            this.status = order.getStatus().toString();
            this.totalPrice = order.getTotalPrice();
            this.deliveryFee = order.getDeliveryFee();
            this.voucherCode = order.getVoucher() != null ? order.getVoucher().getCode() : null;
            this.createdAt = order.getCreatedAt().toString();
            this.items = order.getOrderItems().stream()
                    .map(OrderItemDTO::new)
                    .collect(Collectors.toList());
        }
        
        // Getters
        public Long getId() { return id; }
        public String getUsername() { return username; }
        public String getStatus() { return status; }
        public BigDecimal getTotalPrice() { return totalPrice; }
        public BigDecimal getDeliveryFee() { return deliveryFee; }
        public String getVoucherCode() { return voucherCode; }
        public String getCreatedAt() { return createdAt; }
        public List<OrderItemDTO> getItems() { return items; }
    }

    // DTO for order items with product details
    private static class OrderItemDTO {
        private Long id;
        private Long productId;
        private String productName;
        private String productDescription;
        private String productImagePath;
        private Integer quantity;
        private BigDecimal price;
        private BigDecimal subtotal;
        
        public OrderItemDTO(OrderItem item) {
            this.id = item.getId();
            this.productId = item.getProduct().getId();
            this.productName = item.getProduct().getName();
            this.productDescription = item.getProduct().getDescription();
            this.productImagePath = item.getProduct().getImagePath();
            this.quantity = item.getQuantity();
            this.price = item.getPrice();
            this.subtotal = item.getSubtotal();
        }
        
        // Getters
        public Long getId() { return id; }
        public Long getProductId() { return productId; }
        public String getProductName() { return productName; }
        public String getProductDescription() { return productDescription; }
        public String getProductImagePath() { return productImagePath; }
        public Integer getQuantity() { return quantity; }
        public BigDecimal getPrice() { return price; }
        public BigDecimal getSubtotal() { return subtotal; }
    }
} 