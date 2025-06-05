package com.stiwk2024.backend.model;

import java.math.BigDecimal; // Add this import
import java.util.HashSet;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore; // Add this import

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "product")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @JsonBackReference 
    private Category category;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false)
    private BigDecimal price;
    
    @Column(name = "image_path")
    private String imagePath;
    
    @OneToMany(mappedBy = "product")
    @JsonIgnore // Add this to hide orderItems from product JSON
    private Set<OrderItem> orderItems = new HashSet<>();
    
    // Constructors
    public Product() {
    }
    
    public Product(String name, String description, Category category, Integer quantity, 
                  BigDecimal price, String imagePath) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.quantity = quantity;
        this.price = price;
        this.imagePath = imagePath;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public Category getCategory() {
        return category;
    }
    
    public void setCategory(Category category) {
        this.category = category;
    }
    
    public Integer getQuantity() {
        return quantity;
    }
    
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public String getImagePath() {
        return imagePath;
    }
    
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
    
    public Set<OrderItem> getOrderItems() {
        return orderItems;
    }
    
    public void setOrderItems(Set<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
    
    public Long getCategoryId() {
        return (category != null) ? category.getId() : null;
    }

    public String getCategoryName() {
        return (category != null) ? category.getName() : null;
    }
    
    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", category=" + (category != null ? category.getName() : "null") +
                ", quantity=" + quantity +
                ", price=" + price +
                ", imagePath='" + imagePath + '\'' +
                '}';
    }
}