# E-Commerce Web Application Backend

This is the backend component of the e-commerce web application, built with Spring Boot, MySQL, and Docker.

## Features
- Product management
- User authentication
- Order processing
- Voucher system
- REST API for frontend integration

## Prerequisites
- Docker and Docker Compose installed on your system
- JDK 17 (for local development without Docker)
- Maven (for local development without Docker)

## Running with Docker Compose (Recommended)

The easiest way to run the application is using Docker Compose, which will set up both the Spring Boot backend and MySQL database automatically:

```bash
# From the project root directory (where docker-compose.yml is located)
docker-compose up -d
```

This will:
1. Start a MySQL container with the database schema already set up
2. Build and start the Spring Boot backend container
3. Connect the backend to the database
4. Expose the API on port 8080

The application will be available at: http://localhost:8080

To stop the application:
```bash
docker-compose down
```

To remove all data (including database volume):
```bash
docker-compose down -v
```

## Local Development Setup

If you prefer to develop locally without Docker:

1. Install MySQL and create a database named `ecommerce`
2. Run the `init.sql` script to set up the database schema and initial data
3. Configure `application.properties` with your local database credentials
4. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```

## API Endpoints

Main API endpoints include:

- Products: `/api/products`
- Categories: `/api/categories`
- Authentication: `/api/auth`
- Orders: `/api/orders`
- Vouchers: `/api/vouchers`
- Cart: `/api/cart`
- Wishlist: `/api/wishlist`

See the API documentation or source code for detailed endpoint information.

## Voucher System

The application includes an automatic voucher system that rewards users based on their purchase amounts:

- Purchase ≥ $50: User receives a 3% discount voucher
- Purchase ≥ $100: User receives a 5% discount voucher
- Purchase ≥ $200: User receives an 8% discount voucher

Vouchers are automatically assigned to the user's account when an admin confirms their order (status changes from "pending" to "confirmed"). Users can then apply these vouchers to future purchases.

## Project Structure

- `src/main/java` - Java source code
- `src/main/resources` - Configuration files
- `QurbaProductPhoto` - Product images
- `init.sql` - Database initialization script
- `Dockerfile` - Docker configuration for the backend

## Environment Variables

When running with Docker, you can customize these environment variables:

- `SPRING_DATASOURCE_URL` - JDBC URL for database connection
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `SPRING_JPA_HIBERNATE_DDL_AUTO` - Hibernate DDL auto mode
- `SERVER_PORT` - Port on which the server runs 