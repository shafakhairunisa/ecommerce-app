package com.stiwk2024.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.stiwk2024.backend.model.Category;
import com.stiwk2024.backend.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    
    // Find products by category
    List<Product> findByCategory(Category category);
    Page<Product> findByCategory(Category category, Pageable pageable);
    
    // Find products by name containing the search term (case-insensitive)
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Product> findByNameContainingIgnoreCase(@Param("searchTerm") String searchTerm);
    
    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    Page<Product> findByNameContainingIgnoreCase(@Param("searchTerm") String searchTerm, Pageable pageable);
}