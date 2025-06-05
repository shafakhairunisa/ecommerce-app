# Group Project: E-Commerce Web Application

> Due Date: 22 Jun 2025 (before 10.30 AM)

## 1. Case Study

Based on: https://produkameen.wordpress.com/

## 2. Project Title

Building an E-Commerce Web Application Using Angular and Spring Boot with Agile Methodology

## 3. Objective

Work in groups to build a full-stack e-commerce web application using Angular (frontend) and Spring Boot (backend), following Agile methodology.

---

## 4. Project Requirements

### Technologies Used
- **Frontend:** Angular (with Angular Material or Bootstrap recommended)
- **Backend:** Spring Boot
- **Database:** MySQL (or H2 for development)
- **Version Control:** Git + GitHub
- **Build Tools:** Maven (backend), Angular CLI (frontend)
- **Containerization:** Docker

---

### Functional Requirements (Unified)

#### 1. User Management & Authentication
- User registration and login (JWT or session-based authentication)
- Roles: at least `admin` and `user`
- Authorization: restrict admin routes (e.g., product/order management) to admins only

#### 2. Product & Category Management
- Database tables: `user`, `role`, `product`, `category`
- CRUD operations for products and categories (API + UI)
- Insert at least 3 sample records for each table
- Product listing: name, price, availability, category, image
- Category listing: show all categories; use in product forms as dropdown

#### 3. Shopping Experience
- Product search/filter by name or category
- Shopping cart: add, update, remove products
- Checkout: shipping, billing, payment info; place order
- Order success: confirmation page with order number/details
- Order history: users can view their past orders

#### 4. Admin Features
- Admin product management: create, edit, delete products
- Admin order management: view and manage all customer orders

#### 5. Navigation & UI
- Navigation bar: links to Home, Products, Add Product, Categories, Cart, Orders, Login, etc.
- Responsive design: mobile-friendly layout
- UI framework: Angular Material or Bootstrap

#### 6. API & Integration
- RESTful endpoints for all CRUD and business operations
- Angular app consumes all backend APIs

#### 7. Containerization & Deployment
- Dockerize backend and frontend (separate containers)
- (Suggestion) Use Docker Compose for local development
- Push both images to Docker Hub

#### 8. Documentation & Submission
- Screenshots of working UI and API responses
- Video demo (English, max 15 minutes, on YouTube)
- At least 20 APA-style references in README

---

### API Endpoints (By Functionality)

#### Auth
- `POST   /api/auth/register`         — Register new user
- `POST   /api/auth/login`            — Login (user or admin, role determined by credentials)

#### Products
- `GET    /api/products`              — List all products
    - Query params:
        - `category` — filter by category
        - `sort` — sort by price or name (e.g., `price,asc`, `name,desc`)
        - `search` — search by name or description
- `GET    /api/products/{id}`         — View product details
- `POST   /api/products`              — Add new product (admin only)
- `PUT    /api/products/{id}`         — Update product info/quantity (admin only)
- `DELETE /api/products/{id}`         — Delete product (admin only)

#### Categories
- `GET    /api/categories`            — List all categories

#### Cart
- `POST   /api/cart/add`              — Add product to cart
- `PUT    /api/cart/update`           — Update cart item quantity
- `DELETE /api/cart/remove`           — Remove product from cart
- `GET    /api/cart`                  — View current user's cart

#### Vouchers
- `GET    /api/vouchers`              — View available vouchers for user
- `GET    /api/vouchers/trigger`      — (Optional) Trigger voucher generation if order meets criteria

#### Orders
- `POST   /api/orders`                — Checkout (place order, apply voucher if any)
- `GET    /api/orders`                — View order history (user: own orders, admin: all orders)
- `PUT    /api/orders/{id}/status`    — Change status of order (admin only)
- `GET    /api/orders/search`         — Search orders by username (admin only)

#### Chat/Support
- `GET    /api/chat/history`          — View chat history (user with admin, admin with user)
- `POST   /api/chat/send`             — Send message to admin (user)
- `GET    /api/chat/conversations`    — View chat history with all users (admin)
- `POST   /api/chat/reply`            — Reply to user message (admin)

#### Profile
- `PUT    /api/profile`               — Edit user profile
- `PUT    /api/profile/password`      — Change password

---

> Endpoints are grouped by functionality. Sorting, filtering, and search for products are handled via query parameters on the `/api/products` endpoint. Admin-only endpoints are indicated. All other endpoints are accessible to users as appropriate for their role.

---

### Creative Features (Detailed)

#### 1. Voucher Page (`/vouchers` or `/coupons`)
**How it works:**
- Users can view all their available vouchers/coupons on a dedicated page.
- Shows details such as: code, discount amount, expiry date, and usage status.
- Optionally, users can click to apply a voucher during checkout.

**Technical Considerations:**
- **Backend:**
  - Endpoint to fetch all vouchers for the logged-in user.
  - Coupon logic as described previously (generation, validation, usage).
- **Frontend:**
  - Angular route/component for `/vouchers` or `/coupons`.
  - List all vouchers with relevant details and status.
  - Option to apply a voucher at checkout.

---

#### 2. Wishlist Page (`/wishlist`)
**How it works:**
- Users can add products to their wishlist for future reference or purchase.
- Users can view and manage their wishlist on a dedicated page.
- Optionally, users can move items from wishlist to cart.

**Technical Considerations:**
- **Backend:**
  - `wishlist` table to store user-product relationships.
  - Endpoints to add, remove, and list wishlist items for a user.
- **Frontend:**
  - Angular route/component for `/wishlist`.
  - UI to add/remove products to/from wishlist and view wishlist items.
  - Option to move wishlist items to cart.

---

#### 3. Profile Page (`/profile`)
**How it works:**
- Users can view and edit their personal information (name, email, address, etc.) on a dedicated profile page.
- Optionally, users can change their password and view a summary of their order history.

**Technical Considerations:**
- **Backend:**
  - Endpoints to fetch and update user profile information.
  - Endpoint to change password (with validation).
  - Endpoint to fetch order history summary (optional).
- **Frontend:**
  - Angular route/component for `/profile`.
  - Form for editing user info and changing password.
  - Display of order history summary (optional).

---

> These three features are implemented as distinct Angular routes/components, fulfilling the group project guideline for "3 more features."

---

#### (Other features like product sorting, coupon logic, and order status tracking are implemented as enhancements within the main pages, not as standalone routes.)

---

## 5. Suggested Folder Structure

```
ecommerce-project/
├── backend/
│   ├── src/
│   ├── Dockerfile
│   ├── pom.xml
│   └── sql/
│       └── create_and_insert.sql
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── angular.json
├── docker-compose.yml
├── README.md
```

---

## 6. Evaluation Criteria

| No. | Criteria                                                                                      | Marks |
|-----|----------------------------------------------------------------------------------------------|-------|
| 1   | Implementation of all required components/routes                                              | 20%   |
| 2   | Functionality and correctness of CRUD operations (frontend + backend)                         | 20%   |
| 3   | Proper error handling                                                                         | 10%   |
| 4   | Authentication and authorization                                                              | 20%   |
| 5   | Frontend UI design (clean layout, navigation, responsiveness)                                 | 10%   |
| 6   | Use of Docker for both frontend and backend deployment                                        | 10%   |
| 7   | Report with APA-style references (minimum 20 scholarly or technical sources)                  | 10%   |
|     | **Total**                                                                                    | **100%** |

---

## 7. Important Notes

- **Plagiarism:** No marks for plagiarism.
- **Late Submission:** Penalties apply.
- **APA Reference Guide:** https://libguides.umgc.edu/apa-examples
- **Markdown Guide:** https://www.markdownguide.org/basic-syntax/
- **GitHub Push Guide:** [YouTube Video](https://youtu.be/RXV3Yusr0SI)

---

## 8. Team Responsibilities Breakdown

This project is divided among 3 backend and 4 frontend/integration members. Each member is responsible for specific modules and features as outlined below.

### Backend Team (3 Members)

**Backend Member 1: User, Auth, Profile, and Wishlist**
- User registration/login (JWT)
- Role management (user/admin)
- Secure endpoints (Spring Security)
- Profile management (view/edit, change password)
- Wishlist system (store/retrieve wishlist items, endpoints for user wishlist)
- CORS configuration (for frontend-backend integration)

**Backend Member 2: Product, Category, and Cart**
- CRUD for products and categories
- Product listing, search, filter, sort (query params)
- Product availability logic (quantity, soft delete)
- Category management
- Cart management (add/update/remove/view cart)
- CORS configuration (if needed for these endpoints)

**Backend Member 3: Voucher, Order, Database, and Docker**
- Voucher/coupon logic (generation, assignment, validation, usage)
- User-voucher management
- Order management (checkout, order items, status, history)
- Admin: change order status, search orders
- Database schema design (tables, relationships, constraints)
- SQL scripts for schema and sample data
- Dockerfile for backend (Spring Boot)
- docker-compose.yml (backend + database + optionally frontend)
- Database container setup (MySQL/H2)
- Environment variable management (DB credentials, JWT secret, etc.)
- Health check endpoint (optional, for Docker readiness)
- Error handling/logging (Spring Boot exception handlers, logs)

---

### Frontend/Integration Team (4 Members)

**Frontend Member 1: Auth, Profile, Navigation (User & Admin)**
- Login/register pages (user & admin)
- Profile page (view/edit, change password) (user)
- Navigation bar, route guards (user & admin)
- JWT/token handling in Angular
- Docker file for frontend

**Frontend Member 2: User Interface (Part 1)**
- Product listing, details, search/filter/sort UI (user)
- Category dropdowns, category page (user)
- Add to cart, cart page (update/remove/view) (user)

**Frontend Member 3: User Interface (Part 2)**
- Voucher/coupon page (view/apply) (user)
- Checkout page (apply voucher, place order) (user)
- Order history page (user)
- Wishlist page (user view, add/remove/move to cart) (user)

**Frontend Member 4: Admin Interface**
- Product listing, details, search/filter/sort UI (user)
- Product and category admin pages (CRUD UI) (admin)
- Order management page (admin: list/search/change status)

---