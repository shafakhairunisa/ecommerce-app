package my.stiwk2124.qurba.Controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/vouchers")
@CrossOrigin(origins = "http://localhost:4200")
public class VoucherController {

    @GetMapping("/info")
    public ResponseEntity<List<VoucherInfo>> getVoucherInfo() {
        List<VoucherInfo> vouchers = new ArrayList<>();
        
        vouchers.add(new VoucherInfo(
            "3% Discount",
            "Get 3% off your order",
            new BigDecimal("50.00"),
            new BigDecimal("3.00"),
            "Minimum spend RM50"
        ));
        
        vouchers.add(new VoucherInfo(
            "5% Discount", 
            "Get 5% off your order",
            new BigDecimal("100.00"),
            new BigDecimal("5.00"),
            "Minimum spend RM100"
        ));
        
        vouchers.add(new VoucherInfo(
            "10% Discount",
            "Get 10% off your order", 
            new BigDecimal("200.00"),
            new BigDecimal("10.00"),
            "Minimum spend RM200"
        ));
        
        return ResponseEntity.ok(vouchers);
    }

    public static class VoucherInfo {
        private String title;
        private String description;
        private BigDecimal minAmount;
        private BigDecimal discountPercentage;
        private String terms;

        public VoucherInfo(String title, String description, BigDecimal minAmount, 
                          BigDecimal discountPercentage, String terms) {
            this.title = title;
            this.description = description;
            this.minAmount = minAmount;
            this.discountPercentage = discountPercentage;
            this.terms = terms;
        }

        // Getters and setters
        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public BigDecimal getMinAmount() {
            return minAmount;
        }

        public void setMinAmount(BigDecimal minAmount) {
            this.minAmount = minAmount;
        }

        public BigDecimal getDiscountPercentage() {
            return discountPercentage;
        }

        public void setDiscountPercentage(BigDecimal discountPercentage) {
            this.discountPercentage = discountPercentage;
        }

        public String getTerms() {
            return terms;
        }

        public void setTerms(String terms) {
            this.terms = terms;
        }
    }
}
