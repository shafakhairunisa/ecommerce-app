package com.stiwk2024.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "wishlist")
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "added_at", nullable = false)
    private LocalDateTime addedAt;

    public Wishlist() {
        this.addedAt = LocalDateTime.now();
    }

    public Wishlist(User user, Product product) {
        this();
        this.user = user;
        this.product = product;
    }

    // Getters and Setters
    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }

    public void setUser(User user) { this.user = user; }

    public Product getProduct() { return product; }

    public void setProduct(Product product) { this.product = product; }

    public LocalDateTime getAddedAt() { return addedAt; }

    public void setAddedAt(LocalDateTime addedAt) { this.addedAt = addedAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Wishlist that = (Wishlist) o; // Changed from WishlistItem
        return id != null && id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}