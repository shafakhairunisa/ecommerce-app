[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/co02Vmtr)

## Requirements for Group Project

[Read the instruction](https://github.com/STIWK2124-A242/class-activity-stiwk2124/blob/main/Group_Project_Guideline.md)

## Refer to the link below for the `Group Name` and `Group Members`

https://github.com/STIWK2124-A242/class-activity-stiwk2124/blob/main/NewGroupMembers.md

## Group Info:

1. Matric Number & Name & Photo & Phone Number
1. Mention who the leader is.
1. Mention your group name for Assignment-1 and Assignment-2
1. Other related info (if any)

| Group Member    | #1    | #2    | #3    | #4    | #5    | #6    | #7    |
| :---:   | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Name    |  TEU JIAN WEE | TEH KAI YUAN | Ng Chee Yong | Salsabila Shafa Khairunisa  | Arief Danial Bin Ismail | Muhammad Fakhrurrazi bin Hasbullah | Mayana Amy |
| Matric Number | 291957 | 291624 | 293314 | 290267 | 294957 | 296072 | 292702 |
| Phone Number | 017-3104567 | 016-4575448 | 018-3780532 | 01123406446 | 0176250038 | 018-7655716 | 019-8798221 |
| Picture | <img src="https://github.com/user-attachments/assets/2539f8e5-b5cb-4798-a019-b0905342afae" width="100"/> | <img src="https://github.com/user-attachments/assets/6c14b613-796a-4bfd-bad0-10c68406bb4c" width="100"/> | <img src="https://github.com/user-attachments/assets/a902ef44-f8df-4017-80e1-b6c21f3ab230" width="100"/> | <img src="https://github.com/user-attachments/assets/231d209e-2934-428c-95e3-39e4b61c91d7" width="100" /> | <img src="https://github.com/user-attachments/assets/00ef5dfe-4292-4356-b3a5-26518c966944" width="100"/>|![Fakh](https://github.com/user-attachments/assets/e6272d60-6a09-4546-aee6-0eebee8df0d7)| |<img src= "https://github.com/user-attachments/assets/5dba2587-6154-4b15-a7df-592dc2326353" width="100"/> |![Mayana](https://github.com/user-attachments/assets/66aa87ca-721b-4ca5-af89-e5030c103c98)| 
Group Name for Ass1 & Ass2 |nezha1, nezha2|nezha1, nezha2| nezha1, nezha2 |repo rangers, repo ranger|Webxians, webexians|blitzers, blitzer|blitzers, blitzer|

<br>
<br>

## Title of your application (a unique title)

**Qurba E-Commerce Platform - AMEEN Product Management System**

## Abstract (in 300 words)
### 1.Background
In today's digital economy, having an efficient e-commerce platform is essential for businesses to reach customers and manage sales effectively. Qurba Food Industries, known for its AMEEN brand products, needed a complete system to support online product sales, user interaction, and administrative management.
      
### 2.Problem Statement (from article)
Qurba previously lacked any integrated e-commerce system. There was no backend for handling business logic, nor a frontend for customer or admin use. Without a proper platform, the company faced limited scalability, poor user engagement, and inefficient operations. A fully rebuilt system was necessary to deliver a secure, maintainable, and responsive platform. As Bhat et al. (2016) noted, consistent transaction flow and user-friendly design are critical for online business success.
      
### 3.Main objective
This project aimed to fully develop a modern, secure, and scalable e-commerce system from scratch, including both backend and frontend, to support product browsing, order processing, user management, and administrative functions.

### 4.Methodology
The backend was developed using Spring Boot and Java, with RESTful APIs and MySQL for data storage. The frontend was built using Angular and Angular Material, forming a responsive Single Page Application (SPA). Docker was used to containerize the entire system for easier deployment and scalability.

### 5.Result
The final system enables customer registration, product browsing, cart management, and order placement. Admins can manage products and users through a secured interface. The frontend and backend communicate seamlessly via REST APIs, and the application is fully containerized for portability.

### 6.Conclusion
This project successfully delivered a full-stack e-commerce solution that is secure, scalable, and user-friendly. It supports Qurba's business goals and provides a foundation for future enhancements in the digital marketplace.

## Link for Docker Image

**Backend Image:**
```bash
https://hub.docker.com/r/bcfeszjing/ameen-market-backend
```

**Frontend Image:**
```bash
https://hub.docker.com/r/bcfeszjing/ameen-market-frontend
```

## Instructions on how to run Docker.

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd groupproject-ecommerceapp
   ```

2. **Run the application:**
   ```bash
   docker-compose up -d
   ```

3. **Stop the application:**
   ```bash
   docker-compose down
   ```

## List of all the endpoints

### 👤 **Customer/User Role Endpoints** (`ROLE_CUSTOMER`)

#### **🔐 Authentication Features**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/api/auth/register` | Register a new customer account | Public |
| `POST` | `/api/auth/login` | Customer login | Public |

#### **🛍️ Product Browsing Features**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/api/products` | Get all products | Public |
| `GET` | `/api/products/{id}` | Get product by ID | Public |
| `GET` | `/api/products/filter?category={category}` | Filter products by category | Public |
| `GET` | `/api/products/sort?sortOrder={asc/desc}` | Sort products by price | Public |
| `GET` | `/api/products/search?query={searchTerm}` | Search products by name | Public |
| `GET` | `/api/products/search-filter-sort` | Combined search, filter, and sort | Public |

#### **🛒 Shopping Cart Features** 
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/api/cart/test` | Test authentication | Customer/Admin |
| `GET` | `/api/cart/{userId}` | Get user's shopping cart | Customer/Admin |
| `POST` | `/api/cart/{userId}/add` | Add item to cart | Customer/Admin |
| `PUT` | `/api/cart/{userId}/update` | Update cart item quantity | Customer/Admin |
| `DELETE` | `/api/cart/{userId}/remove` | Remove item from cart | Customer/Admin |
| `DELETE` | `/api/cart/{userId}/clear` | Clear entire cart | Customer/Admin |

#### **📦 Order Management Features**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/api/checkout/{userId}` | Process checkout and create order | Customer/Admin |
| `GET` | `/api/orders/{userId}` | Get user's order history | Customer/Admin |
| `GET` | `/api/orders/{orderId}/summary` | Get specific order details | Customer/Admin |

#### **❤️ Wishlist Features**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/api/wishlist/{userId}` | Get user's wishlist | Customer |
| `POST` | `/api/wishlist/{userId}/add/{productId}` | Add product to wishlist | Customer |
| `DELETE` | `/api/wishlist/{userId}/remove/{productId}` | Remove product from wishlist | Customer |
| `GET` | `/api/wishlist/{userId}/check/{productId}` | Check if product is in wishlist | Customer |

#### **👨‍💼 User Profile Features**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/api/users/profile` | Get current user profile | Authenticated |
| `PUT` | `/api/users/profile` | Update current user profile | Authenticated |

#### **🎟️ Voucher Features**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/api/vouchers/info` | Get available voucher information | Public |

#### **🖼️ Image Services**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/api/images/product/{category}/{filename}` | Get product image | Public |
| `GET` | `/api/images/product/default` | Get default product image | Public |

---

### 🔑 **Admin Role Endpoints** (`ROLE_ADMIN`)

#### **🔐 Admin Authentication Features**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/api/auth/admin/login` | Admin login | Public |

#### **📦 Product Management Features**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/api/admin/products` | Get all products (admin view) | Admin |
| `POST` | `/api/admin/products` | Create new product | Admin |
| `PUT` | `/api/admin/products/{id}` | Update existing product | Admin |
| `DELETE` | `/api/admin/products/{id}` | Delete product | Admin |
| `POST` | `/api/products` | Create product (legacy endpoint) | Admin |
| `PUT` | `/api/products/{id}` | Update product (legacy endpoint) | Admin |
| `DELETE` | `/api/products/{id}` | Delete product (legacy endpoint) | Admin |

#### **📋 Order Management Features**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `GET` | `/api/admin/orders` | Get all orders with customer details | Admin |
| `PATCH` | `/api/admin/orders/{orderId}/status` | Update order status | Admin |
| `GET` | `/api/orders/admin/all` | Get all orders (alternative endpoint) | Admin |
| `PATCH` | `/api/orders/{orderId}/status` | Update order status (alternative endpoint) | Admin |

#### **🖼️ Image Management Features**
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| `POST` | `/api/images/upload` | Upload product images | Admin |
| `DELETE` | `/api/images/delete` | Delete product images | Admin |

---

### 📊 **API Summary Statistics**
- **Total Endpoints**: 35+
- **Public Endpoints**: 10 (Authentication, Product browsing, Images, Vouchers)
- **Customer Endpoints**: 15 (Cart, Orders, Wishlist, Profile)
- **Admin Endpoints**: 10 (Product & Order management, Image uploads)
- **Authentication Methods**: JWT Token-based
- **Supported Roles**: CUSTOMER, ADMIN
- **Request/Response Format**: JSON

### 🔒 **Security Features**
- **JWT Authentication** for stateless API access
- **Role-based Access Control** (RBAC) with Spring Security
- **User Authorization** validation for user-specific resources
- **CORS Configuration** for cross-origin requests
- **Input Validation** and error handling

## Link for the YouTube Presentation

## Result/Output (Screenshot of the output)
### Admin Product & Order Management ###
#### Home Page of Admin Page ####

![image](https://github.com/user-attachments/assets/9bf2d0d7-dc8e-473f-8ab3-47d38273b87b)
<br>
<br>

### View All Products ###

![image](https://github.com/user-attachments/assets/7d49ffb9-f721-4379-94c3-2afced6209b1)
<br>
<br>
![image](https://github.com/user-attachments/assets/8edea713-27e0-4358-a5b1-9d48ddb72f0e)
<br>
<br>
Admin can click on this dropdown to select how many products to display per page.
<br>
![image](https://github.com/user-attachments/assets/6c22a9b9-66ab-4edc-9b11-d1155f774eac)
<br>
<br>

### Search function on product page ###
Admin can search for products by typing words into the search bar.
<br>
![image](https://github.com/user-attachments/assets/7e3acdac-9d9b-4817-bd48-eca22d7cd5f0)
<br>
<br>

#### Filter function on the product page (Category and Price) ####
Admin can choose the category and the order of price then click "Apply filters", or click reset to return to the default.
<br>
![image](https://github.com/user-attachments/assets/d1fad3fa-1407-4376-bd7d-438d960ba0ae)
<br>
<br>
![image](https://github.com/user-attachments/assets/e7dcc4d8-36a1-4b77-8c95-cbb0a7a25bb1)
<br>
<br>
![image](https://github.com/user-attachments/assets/875a0884-99c1-4c2b-94ec-2fe7b04b7c64)
<br>
<br>
![image](https://github.com/user-attachments/assets/8e265230-bba8-4cb0-ba59-72db15b380b6)
<br>
<br>

#### Add New Product ####
Admin can click the button "+ Add New Product" on the Admin Home Page, or click the "+ Add Products" button on the header of the website.
<br>
![image](https://github.com/user-attachments/assets/c46989d4-d84e-48dc-936b-83915ec29f68)
<br>
<br>
To add a new product, admin is required to fill in the information such as name of product, description, price, category and so on.
<br>
<br>
After this, click the "Save" button to add the new product. Admin can also choose to cancel the add product operation by clicking the "Cancel" button.
<br>
![image](https://github.com/user-attachments/assets/68dea5e0-6824-4754-95ad-52986801c0a4)
<br>
<br>
After adding the new product, the product will show on the product page.
<br>
![image](https://github.com/user-attachments/assets/711869e5-108b-44c4-b81b-b0b0cd37b632)
<br>
<br>

#### Edir Product Information ####
To edit the product information, click the "pen" icon, which will redirect to the edit section
<br>
![image](https://github.com/user-attachments/assets/c11e01b2-e8a9-4593-b401-5c6d0739109e)
<br>
<br>
After finishing editing, click the "SAVE" button to save the information that you have edited.
![image](https://github.com/user-attachments/assets/ac6ca998-c978-42e6-ad67-b16909c73aff)
<br>
<br>
The information has been edited successfully.
<br>
![image](https://github.com/user-attachments/assets/88ca1c76-99fd-42bb-8a18-a81457956232)
<br>
<br>

### Delete Product ###
Click the trash icon, and this page will pop up. Click the "confirm" button to delete the product or click the "cancel" button to cancel the delete operation.
<br>
![image](https://github.com/user-attachments/assets/c53eb80b-f253-4b10-b93a-d2657c8d399d)
<br>
<br>
The product is deleted successfully after clicking the "confirm" button.
<br>
![image](https://github.com/user-attachments/assets/a19fcd50-3634-4731-8072-30046083b860)
<br>
<br>

#### Category management ####
Admin can click the "Manage Categories" button and also the Categories button on the right upper side of the website in the home page.
<br>
![image](https://github.com/user-attachments/assets/e48be6dc-6731-487f-9ccb-2c6fbd11cbbe)
<br>
<br>
Admin can manage the categories of products.
<br>
![image](https://github.com/user-attachments/assets/99a19fd1-546e-4482-9c7e-b574a3468a8e)
<br>
<br>

#### Order Management ####
By clicking the "Orders" button and also the "View Orders" button on the home page.
<br>
![image](https://github.com/user-attachments/assets/0e82dc24-97ee-4955-842f-338b9948b614)
<br>
<br>
Admin can see all the order information.
<br>
![image](https://github.com/user-attachments/assets/ad64c93f-21c3-451c-864f-cefee7b0698f)
<br>
<br>
Admin can view details of the order.
<br>
![image](https://github.com/user-attachments/assets/3d5fc518-932b-4975-8bf7-c3b33f6a1137)
<br>
<br>
Admin can manage the status of orders and also filter the category of orders.
<br>
![image](https://github.com/user-attachments/assets/9c18b5e6-b308-487b-927e-7bf6a3a1265e)
<br>
![image](https://github.com/user-attachments/assets/abdadd08-2ca2-4957-9cfb-baac008c8482)
<br>
<br>

### Customer Part ###
### Customer Product Browsing & Cart Management ###
### Customer Product Browsing ###
Home Page of Customer Page
<br>
![image](https://github.com/user-attachments/assets/ddf80c64-43b7-487a-8536-1af141ba76e0)
<br>
<br>
Customers can click on this dropdown to select how many products to display per page.
<br>
![image](https://github.com/user-attachments/assets/25310033-39fc-4742-aa71-46506391099f)


## References (Not less than 20)
1. Produk AMEEN. (n.d.). Produk AMEEN. https://produkameen.wordpress.com/
2. Spring Boot. (n.d.). Spring Boot Reference Documentation. Retrieved April 23, 2025, from Spring Boot Documentation.
3. GeeksforGeeks. (2025, March 21). Introduction to Spring Security and its Features. GeeksforGeeks. https://www.geeksforgeeks.org/introduction-to-spring-security-and-its-features/
4. GeeksforGeeks. (2025a, March 7). Spring Boot application Properties. GeeksforGeeks. https://www.geeksforgeeks.org/spring-boot-application-properties/
5. Fawade, A. (2023, August 11). How to use Docker Compose and YAML for Multi-Container Applications | Day 18 of 90 days of DevOps. Medium. https://ajitfawade.medium.com/how-to-use-docker-compose-and-yaml-for-multi-container-applications-day-18-of-90-days-of-devops-78261fbd7b37
6. Jaygajera. (n.d.). GitHub - jaygajera17/E-commerce-project-springBoot: This project serves as an easy-to-understand setup for beginners , providing a base foundation in Spring Boot , MVC & hibernate. GitHub. https://github.com/jaygajera17/E-commerce-project-springBoot
7. Sirajuddin. (n.d.). GitHub - Sirajuddin135/E-Commerce-Application: The E-Commerce Application is built using Java and Spring Boot, with security, scalability, and ease of maintenance. The backend uses Spring Data JPA to interact with a MySQL database, making it easy to manage and store important entities such as categories, products, orders, etc. Authentication is handled by Auth0, to provide secure REST API. GitHub. https://github.com/Sirajuddin135/E-Commerce-Application
8. Aleksic, M. (2024, July 11). docker run Command: Syntax, Options, Examples. Knowledge Base by phoenixNAP. https://phoenixnap.com/kb/docker-run-command-with-examples
9. Shiramagond, B. (2024, November 15). JPA with Spring Boot: A Comprehensive Guide with Examples. Medium. https://medium.com/@bshiramagond/jpa-with-spring-boot-a-comprehensive-guide-with-examples-e07da6f3d385
10. Bhat, S. A., Kansana, K., & Majid, J. (2016). A review paper on e-commerce [Conference paper]. ResearchGate. https://www.researchgate.net/publication/304703920_A_Review_Paper_on_E-Commerce
11. Baeldung. (2024, January 8). A Simple E-Commerce Implementation with Spring. Baeldung. https://www.baeldung.com/spring-angular-ecommerce
12. Dastidar, S. G. (2021, April 17). A Full Stack E-Commerce Application using Spring Boot and making a Docker container. Medium. https://medium.com/geekculture/a-full-stack-e-commerce-application-using-spring-boot-and-making-a-docker-container-eff46f6f4e14
13. Reed, S. (2020, February 4). E-commerce Website — Online Book Store using Angular 8 + Spring Boot Introduction. Medium. https://medium.com/%40aiagentofchange/ecommerce-website-online-book-store-using-angular-8-spring-boot-introduction-1fe6b39804c8
14. Ahlawat, A. (n.d.). GitHub - AayushiAhlawat/E-Commerce-Web-Application: Angular & Spring Boot E-Commerce: Product listings, search, cart, checkout, auth. GitHub. https://github.com/AayushiAhlawat/E-Commerce-Web-Application
15. Aouinti, A. (n.d.). GitHub - ahmed-aouinti/ecommerce-luv2shop-angular springboot: Experience a seamless online shopping journey with our modern e-commerce platform. GitHub. https://github.com/ahmed-aouinti/ecommerce-luv2shop-angular springboot
16. Vinesh. (2020, September 30). MySQL + Spring Boot + Angular 7 Deployment using Docker Compose. Medium. https://medium.com/techno101/mysql-spring-boot-angular-7-deployment-using-docker-compose-c2d3d8c7a459
17. Bezkoder. (2023, March 1). Dockerize Spring Boot and MySQL with Docker Compose. BezKoder. https://www.bezkoder.com/docker-compose-spring-boot-mysql/
18. Ramesh, F. (2021, February 2). Java Free E-Commerce Open Source Projects using Spring Boot + React + Angular + Microservices. Java Guides. https://www.javaguides.net/2021/02/java-free-e-commerce-open-source-projects.html
19. Unogeeks. (2023, August 30). Full Stack Angular and Java Spring Boot E-Commerce Website. Unogeeks. https://unogeeks.com/full-stack-angular-and-java-spring-boot-e-commerce-website/
20. FrontBackend. (2021, January 26). Angular 11 + Spring Boot 2 + MySQL. FrontBackend. https://frontbackend.com/spring-boot/angular-11-spring-boot-2-mysql
  

  
