package com.stiwk2024.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.stiwk2024.backend.model.Product;

public interface ProductService {
    
    // Get all products
    List<Product> getAllProducts();
    
    // Get all products with pagination and sorting
    Page<Product> getAllProducts(Pageable pageable);
    
    // Get product by id
    Optional<Product> getProductById(Long id);
    
    // Get products by category
    List<Product> getProductsByCategory(Long categoryId);
    Page<Product> getProductsByCategory(Long categoryId, Pageable pageable);
    
    // Search products by name
    List<Product> searchProductsByName(String name);
    Page<Product> searchProductsByName(String name, Pageable pageable);
    
    // Create a new product
    Product createProduct(Product product);
    
    // Update an existing product
    Product updateProduct(Long id, Product product);
    
    // Delete a product
    void deleteProduct(Long id);
    
    // Check if product exists
    boolean existsById(Long id);
}