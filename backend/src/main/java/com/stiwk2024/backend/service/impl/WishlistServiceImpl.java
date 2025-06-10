package com.stiwk2024.backend.service.impl;

import com.stiwk2024.backend.model.Product;
import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.model.Wishlist;
import com.stiwk2024.backend.repository.ProductRepository;
import com.stiwk2024.backend.repository.WishlistRepository;
import com.stiwk2024.backend.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;

    @Autowired
    public WishlistServiceImpl(WishlistRepository wishlistRepository, ProductRepository productRepository) {
        this.wishlistRepository = wishlistRepository;
        this.productRepository = productRepository;
    }

    @Override
    public List<Wishlist> getUserWishlist(User user) {
        return wishlistRepository.findByUserOrderByAddedAtDesc(user);
    }

    @Override
    @Transactional
    public Wishlist addItemToWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));

        if (wishlistRepository.existsByUserAndProduct(user, product)) {
            throw new IllegalArgumentException("Product already in wishlist.");
        }

        Wishlist wishlistItem = new Wishlist(user, product);
        return wishlistRepository.save(wishlistItem);
    }

    @Override
    @Transactional
    public void removeItemFromWishlist(User user, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));

        Wishlist wishlistItem = wishlistRepository.findByUserAndProduct(user, product)
                .orElseThrow(() -> new IllegalArgumentException("Item not found in wishlist for product id: " + productId));

        wishlistRepository.delete(wishlistItem);
    }

    @Override
    @Transactional
    public void removeItemFromWishlistById(User user, Long wishlistItemId) {
        Wishlist wishlistItem = wishlistRepository.findById(wishlistItemId)
                .orElseThrow(() -> new IllegalArgumentException("Wishlist item not found with id: " + wishlistItemId));

        if (!wishlistItem.getUser().getId().equals(user.getId())) {
            throw new SecurityException("User not authorized to remove this wishlist item.");
        }
        wishlistRepository.deleteById(wishlistItemId);
    }
}