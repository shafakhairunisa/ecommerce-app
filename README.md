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
| Name    |  (LEADER) | TEU JIAN WEE | Ng Chee Yong |  |  | Muhammad Fakhrurrazi bin Hasbullah | Mayana Amy |
| Matric Number |  | 291957 | 293314 |  |  | 296072 | 292702 |
| Phone Number |  | 017-3104567 | 018-3780532 |  |  | 018-7655716 | 019-8798221 |
| Picture |  | <img src="https://github.com/user-attachments/assets/2539f8e5-b5cb-4798-a019-b0905342afae" width="100"/> | <img src="https://github.com/user-attachments/assets/a902ef44-f8df-4017-80e1-b6c21f3ab230" width="100"/> |  |  |  |  |
| Group Name for Ass1 & Ass2 ||nezha1, nezha2| nezha1, nezha2 |||blitzers, blitzer|blitzers, blitzer|


## Title of your application (a unique title)
## Abstract (in 300 words)
### 1.Background
In today’s digital economy, having an efficient e-commerce platform is essential for businesses to reach customers and manage sales effectively. Qurba Food Industries, known for its AMEEN brand products, needed a complete system to support online product sales, user interaction, and administrative management.
      
### 2.Problem Statement (from article)
Qurba previously lacked any integrated e-commerce system. There was no backend for handling business logic, nor a frontend for customer or admin use. Without a proper platform, the company faced limited scalability, poor user engagement, and inefficient operations. A fully rebuilt system was necessary to deliver a secure, maintainable, and responsive platform. As Bhat et al. (2016) noted, consistent transaction flow and user-friendly design are critical for online business success.
      
### 3.Main objective
This project aimed to fully develop a modern, secure, and scalable e-commerce system from scratch, including both backend and frontend, to support product browsing, order processing, user management, and administrative functions.

### 4.Methodology
The backend was developed using Spring Boot and Java, with RESTful APIs and MySQL for data storage. The frontend was built using Angular and Angular Material, forming a responsive Single Page Application (SPA). Docker was used to containerize the entire system for easier deployment and scalability.

### 5.Result
The final system enables customer registration, product browsing, cart management, and order placement. Admins can manage products and users through a secured interface. The frontend and backend communicate seamlessly via REST APIs, and the application is fully containerized for portability.

### 6.Conclusion
This project successfully delivered a full-stack e-commerce solution that is secure, scalable, and user-friendly. It supports Qurba’s business goals and provides a foundation for future enhancements in the digital marketplace.


## Link for Docker Image

## Instructions on how to run Docker.

## List of all the endpoints

### Product Management Endpoints

Admin(CRUD)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | http://localhost:8080/api/admin/products | List all product | Admin |
| POST | http://localhost:8080/api/admin/products | Add product in system | Admin |
| PUT | http://localhost:8080/api/admin/products/{productId} | Update product data | Admin |
| DELETE | http://localhost:8080/api/admin/products/{productId} | Delete that product | Admin |

Public
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | http://localhost:8080/api/products | List product | public |
| GET | http://localhost:8080/api/products?sortBy=price&direction=desc | Sort by price (desc) | public |
| GET | http://localhost:8080/api/products?sortBy=price&direction=asc | Sort by price (asc) | public |
| GET | http://localhost:8080/api/products/{productId} | search by productId | public |
| GET | http://localhost:8080/api/products/search?name={keyword} | search by name | public |
| GET | http://localhost:8080/api/products/search?name={keyword}&sortBy=price&direction=desc" | search and sort (combine) | public |
| GET | http://localhost:8080/api/products/category/{categoryId} | filter by category (category 1:"Sos" 2:"Rempah" 3:"Minuman" 4:"Mee" 5:"Madu" 6:"Lain-lain") | public |
| GET | http://localhost:8080/api/products/category/{categoryId}?sortBy=price&direction=desc | filter and sort (combine) | public |


### Cart Management Endpoints

Customer
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | http://localhost:8080/api/customer/cart | list cart product | customer |
| POST | http://localhost:8080/api/customer/cart/items | Add product to cart | customer |
| PUT | http://localhost:8080/api/customer/cart/items/{productId} | Update product quantity in cart | customer |
| DELETE | http://localhost:8080/api/customer/cart/items/{productId} | Remove product in cart | customer |
| DELETE | http://localhost:8080/api/customer/cart | Clear cart | customer |


### Voucher Management Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/vouchers` | Get all available vouchers for the current user | User |
| GET | `/api/vouchers/all` | Get all voucher types in the system | User |
| GET | `/api/vouchers/{id}` | Get details of a specific voucher | User |
| GET | `/api/vouchers/trigger` | Trigger voucher generation based on purchase amount (for testing) | User |


### Order Management Endpoints

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/orders` | Get all orders (paginated) | Admin |
| GET | `/api/orders/my-orders` | Get all orders for the current user | User |
| GET | `/api/orders/{id}` | Get details of a specific order | User (own orders) / Admin (all) |
| POST | `/api/orders` | Create a new order | User |
| PUT | `/api/orders/{id}/status` | Update the status of an order (pending/confirmed) and automatically assign vouchers to users based on purchase amount when status changes to "confirmed" | Admin |
| GET | `/api/orders/search` | Search orders by username | Admin |
| GET | `/api/orders/status/{status}` | Get all orders with a specific status | Admin |

## Link for the YouTube Presentation

## Result/Output (Screenshot of the output)

## References (Not less than 20)
References (Not less than 10)
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
