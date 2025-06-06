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
## Background ##
     In today’s digital economy, having an efficient e-commerce platform is essential for businesses to reach customers and manage sales effectively. Qurba Food Industries, known for its AMEEN brand products, needed a complete system to support online product sales, user interaction, and administrative management.
      
## Problem Statement (from article) ##
     Qurba previously lacked any integrated e-commerce system. There was no backend for handling business logic, nor a frontend for customer or admin use. Without a proper platform, the company faced limited scalability, poor user engagement, and inefficient operations. A fully rebuilt system was necessary to deliver a secure, maintainable, and responsive platform. As Bhat et al. (2016) noted, consistent transaction flow and user-friendly design are critical for online business success.
      
## Main objective ##
     This project aimed to fully develop a modern, secure, and scalable e-commerce system from scratch, including both backend and frontend, to support product browsing, order processing, user management, and administrative functions.

## Methodology ##
     The backend was developed using Spring Boot and Java, with RESTful APIs and MySQL for data storage. The frontend was built using Angular and Angular Material, forming a responsive Single Page Application (SPA). Docker was used to containerize the entire system for easier deployment and scalability.

## Result ##
     The final system enables customer registration, product browsing, cart management, and order placement. Admins can manage products and users through a secured interface. The frontend and backend communicate seamlessly via REST APIs, and the application is fully containerized for portability.

## Conclusion ##
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

