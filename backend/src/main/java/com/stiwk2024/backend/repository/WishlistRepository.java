package com.stiwk2024.backend.repository;

import com.stiwk2024.backend.model.Product;
import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.model.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserOrderByAddedAtDesc(User user);
    Optional<Wishlist> findByUserAndProduct(User user, Product product);
    boolean existsByUserAndProduct(User user, Product product);
    void deleteByUserAndProduct(User user, Product product);
    Optional<Wishlist> findByIdAndUser(Long id, User user); // To ensure user owns the wishlist item when deleting by ID
}