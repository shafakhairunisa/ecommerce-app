package com.stiwk2024.backend.service;

import com.stiwk2024.backend.model.User;
import com.stiwk2024.backend.model.Wishlist;

import java.util.List;

public interface WishlistService {
    List<Wishlist> getUserWishlist(User user);
    Wishlist addItemToWishlist(User user, Long productId);
    void removeItemFromWishlist(User user, Long productId);
    void removeItemFromWishlistById(User user, Long wishlistItemId);
}