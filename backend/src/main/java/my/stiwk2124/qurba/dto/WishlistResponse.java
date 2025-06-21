package my.stiwk2124.qurba.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WishlistResponse {
    private Long wishlistId;
    private Long userId;
    private Long productId;
    private String productName;
    private LocalDateTime createdAt;
}