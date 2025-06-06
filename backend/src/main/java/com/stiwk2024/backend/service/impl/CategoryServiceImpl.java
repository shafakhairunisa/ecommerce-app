package com.stiwk2024.backend.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.stiwk2024.backend.model.Category;
import com.stiwk2024.backend.repository.CategoryRepository;
import com.stiwk2024.backend.repository.ProductRepository;
import com.stiwk2024.backend.service.CategoryService;

@Service
public class CategoryServiceImpl implements CategoryService {
    
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    
    @Autowired
    public CategoryServiceImpl(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }
    
    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    @Override
    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }
    
    @Override
    public Optional<Category> getCategoryByName(String name) {
        return categoryRepository.findByName(name);
    }
    
    @Override
    @Transactional
    public Category createCategory(Category category) {
        // Check if category name already exists
        if (categoryRepository.existsByName(category.getName())) {
            throw new IllegalArgumentException("Category with name '" + category.getName() + "' already exists");
        }
        
        return categoryRepository.save(category);
    }
    
    @Override
    @Transactional
    public Category updateCategory(Long id, Category category) {
        // Check if category exists
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Category with ID " + id + " not found");
        }
        
        // Check if the new name conflicts with existing categories (excluding current one)
        Optional<Category> existingCategory = categoryRepository.findByName(category.getName());
        if (existingCategory.isPresent() && !existingCategory.get().getId().equals(id)) {
            throw new IllegalArgumentException("Category with name '" + category.getName() + "' already exists");
        }
        
        category.setId(id);
        return categoryRepository.save(category);
    }
    
    @Override
    @Transactional
    public void deleteCategory(Long id) {
        // Check if category exists
        if (!categoryRepository.existsById(id)) {
            throw new IllegalArgumentException("Category with ID " + id + " not found");
        }
        
        // Check if category has products
        Category category = categoryRepository.findById(id).get();
        if (!category.getProducts().isEmpty()) {
            throw new IllegalArgumentException("Cannot delete category that contains products. Please reassign or delete all products in this category first.");
        }
        
        categoryRepository.deleteById(id);
    }
    
    @Override
    public boolean existsById(Long id) {
        return categoryRepository.existsById(id);
    }
    
    @Override
    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }
}