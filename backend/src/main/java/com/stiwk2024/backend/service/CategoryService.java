package com.stiwk2024.backend.service;

import java.util.List;
import java.util.Optional;

import com.stiwk2024.backend.model.Category;

public interface CategoryService {
    
    // Get all categories
    List<Category> getAllCategories();
    
    // Get category by id
    Optional<Category> getCategoryById(Long id);
    
    // Get category by name
    Optional<Category> getCategoryByName(String name);
    
    // Create a new category
    Category createCategory(Category category);
    
    // Update an existing category
    Category updateCategory(Long id, Category category);
    
    // Delete a category
    void deleteCategory(Long id);
    
    // Check if category exists
    boolean existsById(Long id);
    
    // Check if category name exists
    boolean existsByName(String name);
}