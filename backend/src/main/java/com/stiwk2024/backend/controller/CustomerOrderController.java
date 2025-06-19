package com.stiwk2024.backend.controller;

import com.stiwk2024.backend.model.Order;
import com.stiwk2024.backend.model.OrderItem;
import com.stiwk2024.backend.model.Product;
import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.model.UserVoucher;
import com.stiwk2024.backend.service.OrderService;
import com.stiwk2024.backend.service.ProductService;
import com.stiwk2024.backend.service.UserService;
import com.stiwk2024.backend.service.UserVoucherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customer/orders")
public class CustomerOrderController {

    private final OrderService orderService;
    private final UserService userService;
    private final ProductService productService;
    private final UserVoucherService userVoucherService;

    @Autowired
    public CustomerOrderController(
            OrderService orderService,
            UserService userService,
            ProductService productService,
            UserVoucherService userVoucherService) {
        this.orderService = orderService;
        this.userService = userService;
        this.productService = productService;
        this.userVoucherService = userVoucherService;
    }

    @GetMapping
    public ResponseEntity<List<OrderDTO>> getMyOrders(Authentication authentication) {
        User user = getCurrentUser(authentication);
        List<Order> orders = orderService.getUserOrders(user);

        List<OrderDTO> orderDTOs = orders.stream()
                .map(this::convertToOrderDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(orderDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailDTO> getOrderById(@PathVariable Long id, Authentication authentication) {
        User user = getCurrentUser(authentication);
        Optional<Order> orderOpt = orderService.getOrderById(id);

        if (orderOpt.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        }

        Order order = orderOpt.get();

        // Ensure the order belongs to the authenticated user
        if (!order.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        return ResponseEntity.ok(convertToOrderDetailDTO(order));
    }

    @PostMapping
    public ResponseEntity<OrderDetailDTO> createOrder(
            @RequestBody CreateOrderRequest request,
            Authentication authentication) {

        User user = getCurrentUser(authentication);

        // Check if address is available
        if (user.getAddress() == null || user.getAddress().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Shipping address is required");
        }

        // Process voucher if provided
        UserVoucher userVoucher = null;
        if (request.getVoucherId() != null) {
            userVoucher = userVoucherService.getUserVoucherById(request.getVoucherId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Voucher not found"));

            // Validate voucher belongs to user and is not used
            if (!userVoucher.getUser().getId().equals(user.getId()) || userVoucher.isUsed()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid voucher or voucher already used");
            }
        }

        // Process order items
        List<OrderItem> orderItems = new ArrayList<>();
        for (OrderItemRequest itemRequest : request.getItems()) {
            Product product = productService.getProductById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Product not found: " + itemRequest.getProductId()));

            // Check if quantity is valid
            if (itemRequest.getQuantity() <= 0) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Invalid quantity for product: " + product.getName());
            }

            // Check if product is in stock
            if (product.getQuantity() < itemRequest.getQuantity()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Not enough stock for product: " + product.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemRequest.getQuantity());
            orderItem.setPrice(product.getPrice());
            orderItems.add(orderItem);

            // Update product quantity
            product.setQuantity(product.getQuantity() - itemRequest.getQuantity());
            productService.updateProduct(product.getId(), product);
        }

        // Create the order
        BigDecimal deliveryFee = request.getDeliveryFee() != null ? request.getDeliveryFee() : new BigDecimal("5.00");

        Order order = orderService.createOrder(user, orderItems, userVoucher, deliveryFee);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(convertToOrderDetailDTO(order));
    }

    private User getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Not authenticated");
        }

        return userService.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"));
    }

    private OrderDTO convertToOrderDTO(Order order) {
        return new OrderDTO(
                order.getId(),
                order.getStatus().toString(),
                order.getTotalPrice(),
                order.getCreatedAt().toString(),
                order.getOrderItems().size());
    }

    private OrderDetailDTO convertToOrderDetailDTO(Order order) {
        List<OrderItemDTO> itemDTOs = order.getOrderItems().stream()
                .map(item -> new OrderItemDTO(
                        item.getId(),
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPrice(),
                        item.getSubtotal(),
                        item.getProduct().getImagePath()))
                .collect(Collectors.toList());

        String voucherCode = order.getVoucher() != null ? order.getVoucher().getCode() : null;

        return new OrderDetailDTO(
                order.getId(),
                order.getStatus().toString(),
                order.getTotalPrice(),
                order.getDeliveryFee(),
                voucherCode,
                order.getCreatedAt().toString(),
                itemDTOs);
    }

    // DTOs
    public static class OrderDTO {
        private Long id;
        private String status;
        private BigDecimal total;
        private String createdAt;
        private int itemCount;

        public OrderDTO(Long id, String status, BigDecimal total, String createdAt, int itemCount) {
            this.id = id;
            this.status = status;
            this.total = total;
            this.createdAt = createdAt;
            this.itemCount = itemCount;
        }

        // Getters
        public Long getId() {
            return id;
        }

        public String getStatus() {
            return status;
        }

        public BigDecimal getTotal() {
            return total;
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
        private String status;
        private BigDecimal total;
        private BigDecimal deliveryFee;
        private String voucherCode;
        private String createdAt;
        private List<OrderItemDTO> items;

        public OrderDetailDTO(Long id, String status, BigDecimal total,
                BigDecimal deliveryFee, String voucherCode,
                String createdAt, List<OrderItemDTO> items) {
            this.id = id;
            this.status = status;
            this.total = total;
            this.deliveryFee = deliveryFee;
            this.voucherCode = voucherCode;
            this.createdAt = createdAt;
            this.items = items;
        }

        // Getters
        public Long getId() {
            return id;
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

        public String getVoucherCode() {
            return voucherCode;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public List<OrderItemDTO> getItems() {
            return items;
        }
    }

    public static class OrderItemDTO {
        private Long id;
        private Long productId;
        private String productName;
        private int quantity;
        private BigDecimal price;
        private BigDecimal subtotal;
        private String imagePath;

        public OrderItemDTO(Long id, Long productId, String productName,
                int quantity, BigDecimal price,
                BigDecimal subtotal, String imagePath) {
            this.id = id;
            this.productId = productId;
            this.productName = productName;
            this.quantity = quantity;
            this.price = price;
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

        public int getQuantity() {
            return quantity;
        }

        public BigDecimal getPrice() {
            return price;
        }

        public BigDecimal getSubtotal() {
            return subtotal;
        }

        public String getImagePath() {
            return imagePath;
        }
    }

    public static class CreateOrderRequest {
        private List<OrderItemRequest> items;
        private Long voucherId;
        private BigDecimal deliveryFee;

        // Getters and setters
        public List<OrderItemRequest> getItems() {
            return items;
        }

        public void setItems(List<OrderItemRequest> items) {
            this.items = items;
        }

        public Long getVoucherId() {
            return voucherId;
        }

        public void setVoucherId(Long voucherId) {
            this.voucherId = voucherId;
        }

        public BigDecimal getDeliveryFee() {
            return deliveryFee;
        }

        public void setDeliveryFee(BigDecimal deliveryFee) {
            this.deliveryFee = deliveryFee;
        }
    }

    public static class OrderItemRequest {
        private Long productId;
        private int quantity;

        // Getters and setters
        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public int getQuantity() {
            return quantity;
        }

        public void setQuantity(int quantity) {
            this.quantity = quantity;
        }
    }
}
