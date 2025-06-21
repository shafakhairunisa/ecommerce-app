package my.stiwk2124.qurba.service;

import my.stiwk2124.qurba.JPAentities.Wishlist;
import my.stiwk2124.qurba.dto.WishlistResponse;
import my.stiwk2124.qurba.repository.WishlistRepository;
import my.stiwk2124.qurba.repository.UserRepository;
import my.stiwk2124.qurba.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class WishlistService {
    @Autowired
    private WishlistRepository wishlistRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;

    public List<Wishlist> getUserWishlist(Long userId) {
        return wishlistRepository.findByUserUserId(userId);
    }
    private WishlistResponse convertToDto(Wishlist wishlist) {
        return new WishlistResponse(
            wishlist.getWishlistId(),
            wishlist.getUser().getUserId(),
            wishlist.getProduct().getProductId(),
            wishlist.getProduct().getName(),
            wishlist.getCreatedAt()
        );
    }
    @Transactional
  public WishlistResponse addToWishlist(Long userId, Long productId) {
        if (wishlistRepository.existsByUserUserIdAndProductProductId(userId, productId)) {
            throw new IllegalStateException("Product already in wishlist");
        }

        var user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        var product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));

        var wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setProduct(product);

        return convertToDto(wishlistRepository.save(wishlist));
    }

    @Transactional
    public void removeFromWishlist(Long userId, Long productId) {
        wishlistRepository.deleteByUserUserIdAndProductProductId(userId, productId);
    }

    public boolean isInWishlist(Long userId, Long productId) {
        return wishlistRepository.existsByUserUserIdAndProductProductId(userId, productId);
    }
}