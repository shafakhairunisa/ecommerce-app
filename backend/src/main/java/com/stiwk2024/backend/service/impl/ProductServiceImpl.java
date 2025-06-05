package com.stiwk2024.backend.service.impl;

import com.stiwk2024.backend.model.Category;
import com.stiwk2024.backend.model.Product;
import com.stiwk2024.backend.repository.CategoryRepository;
import com.stiwk2024.backend.repository.ProductRepository;
import com.stiwk2024.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductServiceImpl implements ProductService {
    
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    
    @Autowired
    public ProductServiceImpl(
            ProductRepository productRepository,
            CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }
    
    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    @Override
    public Page<Product> getAllProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
    
    @Override
    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }
    
    @Override
    public List<Product> getProductsByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        return productRepository.findByCategory(category);
    }
    
    @Override
    public Page<Product> getProductsByCategory(Long categoryId, Pageable pageable) {
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        return productRepository.findByCategory(category, pageable);
    }
    
    @Override
    public List<Product> searchProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }
    
    @Override
    public Page<Product> searchProductsByName(String name, Pageable pageable) {
        return productRepository.findByNameContainingIgnoreCase(name, pageable);
    }
    
    @Override
    @Transactional
    public Product createProduct(Product product) {
        // Ensure the category exists
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository.findById(product.getCategory().getId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            product.setCategory(category);
        }
        return productRepository.save(product);
    }
    
    @Override
    @Transactional
    public Product updateProduct(Long id, Product product) {
        // Ensure product exists
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product with ID " + id + " not found");
        }
        
        // Ensure the category exists
        if (product.getCategory() != null && product.getCategory().getId() != null) {
            Category category = categoryRepository.findById(product.getCategory().getId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            product.setCategory(category);
        }
        
        product.setId(id);
        return productRepository.save(product);
    }
    
    @Override
    @Transactional
    public void deleteProduct(Long id) {
        // Ensure product exists
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product with ID " + id + " not found");
        }
        productRepository.deleteById(id);
    }
    
    @Override
    public boolean existsById(Long id) {
        return productRepository.existsById(id);
    }
}