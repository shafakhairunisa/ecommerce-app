package com.stiwk2024.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "voucher")
public class Voucher {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String code;
    
    @Column(name = "discount_percent", nullable = false)
    private BigDecimal discountPercent;
    
    @Column(name = "min_purchase", nullable = false)
    private BigDecimal minPurchase;
    
    private String description;
    
    @Column(name = "image_path")
    private String imagePath;
    
    @OneToMany(mappedBy = "voucher")
    private Set<UserVoucher> userVouchers = new HashSet<>();
    
    // Constructors
    public Voucher() {
    }
    
    public Voucher(String code, BigDecimal discountPercent, BigDecimal minPurchase, String description, String imagePath) {
        this.code = code;
        this.discountPercent = discountPercent;
        this.minPurchase = minPurchase;
        this.description = description;
        this.imagePath = imagePath;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getCode() {
        return code;
    }
    
    public void setCode(String code) {
        this.code = code;
    }
    
    public BigDecimal getDiscountPercent() {
        return discountPercent;
    }
    
    public void setDiscountPercent(BigDecimal discountPercent) {
        this.discountPercent = discountPercent;
    }
    
    public BigDecimal getMinPurchase() {
        return minPurchase;
    }
    
    public void setMinPurchase(BigDecimal minPurchase) {
        this.minPurchase = minPurchase;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getImagePath() {
        return imagePath;
    }
    
    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }
    
    public Set<UserVoucher> getUserVouchers() {
        return userVouchers;
    }
    
    public void setUserVouchers(Set<UserVoucher> userVouchers) {
        this.userVouchers = userVouchers;
    }
    
    @Override
    public String toString() {
        return "Voucher{" +
                "id=" + id +
                ", code='" + code + '\'' +
                ", discountPercent=" + discountPercent +
                ", minPurchase=" + minPurchase +
                ", description='" + description + '\'' +
                ", imagePath='" + imagePath + '\'' +
                '}';
    }
} 