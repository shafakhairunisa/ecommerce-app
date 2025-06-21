package my.stiwk2124.qurba.repository;

import my.stiwk2124.qurba.JPAentities.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByUserUserId(Long userId);
    Optional<Wishlist> findByUserUserIdAndProductProductId(Long userId, Long productId);
    boolean existsByUserUserIdAndProductProductId(Long userId, Long productId);
    void deleteByUserUserIdAndProductProductId(Long userId, Long productId);
}