package my.stiwk2124.qurba;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories(basePackages = "my.stiwk2124.qurba.repository")
@EntityScan(basePackages = "my.stiwk2124.qurba.JPAentities")
public class QurbaApplication {
    public static void main(String[] args) {
        SpringApplication.run(QurbaApplication.class, args);
    }
}
