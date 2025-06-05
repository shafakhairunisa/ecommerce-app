package com.stiwk2024.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_voucher")
public class UserVoucher {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne
    @JoinColumn(name = "voucher_id", nullable = false)
    private Voucher voucher;
    
    @Column(name = "is_used")
    private boolean isUsed;
    
    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;
    
    @Column(name = "used_at")
    private LocalDateTime usedAt;
    
    // Constructors
    public UserVoucher() {
        this.assignedAt = LocalDateTime.now();
        this.isUsed = false;
    }
    
    public UserVoucher(User user, Voucher voucher) {
        this.user = user;
        this.voucher = voucher;
        this.assignedAt = LocalDateTime.now();
        this.isUsed = false;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Voucher getVoucher() {
        return voucher;
    }
    
    public void setVoucher(Voucher voucher) {
        this.voucher = voucher;
    }
    
    public boolean isUsed() {
        return isUsed;
    }
    
    public void setUsed(boolean used) {
        isUsed = used;
        if (used) {
            this.usedAt = LocalDateTime.now();
        }
    }
    
    public LocalDateTime getAssignedAt() {
        return assignedAt;
    }
    
    public void setAssignedAt(LocalDateTime assignedAt) {
        this.assignedAt = assignedAt;
    }
    
    public LocalDateTime getUsedAt() {
        return usedAt;
    }
    
    public void setUsedAt(LocalDateTime usedAt) {
        this.usedAt = usedAt;
    }
    
    @Override
    public String toString() {
        return "UserVoucher{" +
                "id=" + id +
                ", user=" + user.getUsername() +
                ", voucher=" + voucher.getCode() +
                ", isUsed=" + isUsed +
                ", assignedAt=" + assignedAt +
                ", usedAt=" + usedAt +
                '}';
    }
} 