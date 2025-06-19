package com.stiwk2024.backend.controller;

import com.stiwk2024.backend.model.Category;
import com.stiwk2024.backend.model.Product;
import com.stiwk2024.backend.service.CategoryService;
import com.stiwk2024.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;
    private final CategoryService categoryService;

    @Autowired
    public AdminProductController(ProductService productService, CategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    // Get all products (for admin)
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    // Get product by ID (for admin)
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        if (product.isPresent()) {
            return ResponseEntity.ok(product.get());
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
        }
    }

    // Create new product (for admin)
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody ProductRequest productRequest) {
        try {
            // Get the category
            Category category = getCategoryByNameOrId(productRequest.getCategory());

            // Create product from request
            Product product = new Product();
            product.setName(productRequest.getName());
            product.setDescription(productRequest.getDescription());
            product.setPrice(new BigDecimal(productRequest.getPrice().toString()));
            product.setQuantity(productRequest.getStock());
            product.setCategory(category);
            product.setImagePath(productRequest.getImageUrl());

            // Save product
            Product createdProduct = productService.createProduct(product);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error creating product: " + e.getMessage());
        }
    }

    // Update product (for admin)
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody ProductRequest productRequest) {
        try {
            // Check if product exists
            if (!productService.existsById(id)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found");
            }

            // Get the category
            Category category = getCategoryByNameOrId(productRequest.getCategory());

            // Create product from request
            Product product = new Product();
            product.setId(id);
            product.setName(productRequest.getName());
            product.setDescription(productRequest.getDescription());
            product.setPrice(new BigDecimal(productRequest.getPrice().toString()));
            product.setQuantity(productRequest.getStock());
            product.setCategory(category);
            product.setImagePath(productRequest.getImageUrl());

            // Update product
            Product updatedProduct = productService.updateProduct(id, product);
            return ResponseEntity.ok(updatedProduct);
        } catch (ResponseStatusException e) {
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Error updating product: " + e.getMessage());
        }
    }

    // Delete product (for admin)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found or could not be deleted");
        }
    }

    // Helper method to find category by name or id
    private Category getCategoryByNameOrId(String categoryInput) {
        // Try to parse as ID first
        try {
            Long categoryId = Long.parseLong(categoryInput);
            return categoryService.getCategoryById(categoryId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Category not found with id: " + categoryId));
        } catch (NumberFormatException e) {
            // If not a number, try to find by name
            return categoryService.getCategoryByName(categoryInput)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Category not found with name: " + categoryInput));
        }
    }

    // Inner class for product request body
    public static class ProductRequest {
        private String name;
        private String description;
        private Number price;
        private Integer stock;
        private String category;
        private String imageUrl;

        // Getters and setters
        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public Number getPrice() {
            return price;
        }

        public void setPrice(Number price) {
            this.price = price;
        }

        public Integer getStock() {
            return stock;
        }

        public void setStock(Integer stock) {
            this.stock = stock;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getImageUrl() {
            return imageUrl;
        }

        public void setImageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
        }
    }
}