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

| Group Member | Name | Matric Number |
| :---: | :---: | :---: |
| #1 | TEH KAI YUAN | 291624 |
| #2 | TEU JIAN WEE | 291957 |
| #3 | Ng Chee Yong | 293314 |
| #4 | Salsabila Shafa Khairunisa | 290267 |
| #5 | Arief Danial Bin Ismail | 294957 |
| #6 | Muhammad Fakhrurrazi bin Hasbullah | 296072 |
| #7 | Mayana Amy | 292702 |
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

## Result/Output (Screenshot of the output)
### Web Application Page ###

![image](https://github.com/user-attachments/assets/b2287584-94c4-4e6d-a652-fe3480babc7c)
<br>
<br>
Login in page
![image](https://github.com/user-attachments/assets/f59cd447-4c0a-48ac-beab-cb81809470cc)
<br>
<br>

### Admin Product & Order Management ###
#### Home Page of Admin Page ####

![image](https://github.com/user-attachments/assets/9bf2d0d7-dc8e-473f-8ab3-47d38273b87b)
<br>
<br>

### Admin - View All Products ###

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

### Admin - Search function on product page ###
Admin can search for products by typing words into the search bar.
<br>
![image](https://github.com/user-attachments/assets/7e3acdac-9d9b-4817-bd48-eca22d7cd5f0)
<br>
<br>

#### Admin - Filter function on the product page (Category and Price) ####
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

#### Admin - Add New Product ####
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
![image](https://github.com/user-attachments/assets/5667fc34-e7a3-4146-95f2-6bc4ad16bf58)
<br>
<br>
After adding the new product, the product will show on the product page.
<br>
![image](https://github.com/user-attachments/assets/0882e024-f1e7-4083-91c9-be89b051130d)
<br>
<br>

#### Admin - Edit Product Information ####
To edit the product information, click the "pen" icon, which will redirect to the edit section
<br>
![image](https://github.com/user-attachments/assets/9474ab50-2686-4a42-a07f-f3b142e3224a)
<br>
<br>
After finishing editing, click the "SAVE" button to save the information that you have edited.
![image](https://github.com/user-attachments/assets/5816b7de-dd37-406a-b4fd-d01f8fc38e8d)
<br>
<br>
The information has been edited successfully.
<br>
![image](https://github.com/user-attachments/assets/d0eac690-0de9-45d7-a70b-50b0799f0e7e)
<br>
<br>

### Admin - Delete Product ###
Click the trash icon, and this page will pop up. Click the "confirm" button to delete the product or click the "cancel" button to cancel the delete operation.
<br>
![image](https://github.com/user-attachments/assets/544d609e-4897-429a-b6b6-1f13e8ae541e)
<br>
<br>
The product is deleted successfully after clicking the "confirm" button.
<br>
![image](https://github.com/user-attachments/assets/0841f857-886c-4031-8b81-0bec0b6e701e)
<br>
<br>

#### Admin - Category management ####
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

#### Admin - Order Management ####
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
### Customer Product Browsing ###
Home Page of Customer Page
<br>
![image](https://github.com/user-attachments/assets/4326982f-f662-4854-b1d7-7324b5f0f9fb)
<br>
<br>
Customers can click on this dropdown to select how many products to display per page.
<br>
![image](https://github.com/user-attachments/assets/36669613-1111-44fe-a9fb-9f13a1e4565e)
<br>
<br>
Customers also can click on this to select display the prodct in different form.
![image](https://github.com/user-attachments/assets/6d4159c1-0c76-468f-8f85-d4762e1963f6)
<br>
<br>

### Customer - Sort Products ###
Customers can click this dropdown to sort products by price, with options including "Price: Low to High" and "Price: High to Low".
<br>
![image](https://github.com/user-attachments/assets/2c6880a1-de94-4eed-91a8-35f554ef73c9)
<br>
<br>
After selecting the option, click the "Apply Filters" button to show the sort products.
<br>
![image](https://github.com/user-attachments/assets/ae451708-109e-4797-ac74-6767b7a09e41)
<br>
<br>

### Customer - Search Products ###
Customers can search for products by typing words into the search bar.
<br>
![image](https://github.com/user-attachments/assets/4b81d9b7-def5-4e9c-9d9a-6ecc437813c9)
<br>
<br>

### Customer - Filter Products ###
Choose the category and click "Apply filters", or you can also click reset to return to the default.
<br>
![image](https://github.com/user-attachments/assets/45876acc-0aa6-4603-ba00-3e5c0631ab5f)
<br>
<br>
![image](https://github.com/user-attachments/assets/b8038809-42af-4d48-b3e0-a3ae0284b9b3)
<br>
<br>
![image](https://github.com/user-attachments/assets/c6db1862-64e9-4d39-aa11-86cb7727bcee)
<br>
<br>

### Customer - Combine Sort, Search & Filter Products ###
Customers can combine sorting, searching and filtering to find the specific product.
<br>
![image](https://github.com/user-attachments/assets/6d58e217-cdb4-4ec9-8495-29b589d5c154)
<br>
<br>

### Customer - Add Product to Cart ###
Customers can click the "Add to Cart" button and the quantity selection to add the item to shopping cart for purchase.
<br>
![image](https://github.com/user-attachments/assets/2395ddd1-7931-4c3a-8c11-5fd55b049b51)
<br>
<br>
When users click the "Add to Cart" button or quantity selection for a product, the system will display the detailed information of the product. Users can then click the "Add to Cart" button to confirm and place the product in cart.
<br>
![image](https://github.com/user-attachments/assets/fa8fabe0-9186-49f0-a82e-b614e354cc03)
<br>
<br>
Customers also can click the "+" button to increase the product's quantity.
<br>
![image](https://github.com/user-attachments/assets/19863281-1bca-4709-bdae-9f0aeb34d2d9)
<br>
<br>

### Additional Features 1 ###
### Customer - Add Product to Wishlist ###
Customers can click the love icon to add the item to wishlist.
<br>
![image](https://github.com/user-attachments/assets/9b7017bf-0e67-404a-8918-cbe531c11686)
<br>
<br>
To view the wishlist, customer can click the love icon at the header of the website.
<br>
![image](https://github.com/user-attachments/assets/0bae2639-45a4-4821-89ca-9ffa0b5a5cf4)
<br>
<br>
In the wishlist page, customer can review their wishlist products.
<br>
![image](https://github.com/user-attachments/assets/a3dd8c07-dfae-40a9-bcd6-815c81b1a219)
<br>
<br>
Customer also can click "Delete" button to reomve the item from wishlist.
<br>
![image](https://github.com/user-attachments/assets/85ecc7ed-813d-4ffc-80f4-152d91705af7)
<br>
<br>
After click delete, it will successfully remove the item from wishlist.
<br>
![image](https://github.com/user-attachments/assets/329b0194-a029-4e87-94df-03507357fbdf)
<br>
<br>

### Additional Features 2 ###
### Customer - Voucher Feature ###
To view the voucher, customer can click the love icon at the header of the website.
<br>
![image](https://github.com/user-attachments/assets/2f24978e-d467-4c1f-a544-c8bb4aa71897)
<br>
<br>
In voucher page, customer can view the available voucher and the guideline of the voucher usage.
The voucher will automatically apply, when the purchase amount meets the requirement.
<br>
![image](https://github.com/user-attachments/assets/db0922c9-1ba5-4ac9-8355-6c0238287a3d)
<br>
<br>

### Additional Features 3 ###
### Customer - Edit User Profile ###
To edit the profile, customer can click the person icon at the header of the website.
<br>
![image](https://github.com/user-attachments/assets/f6daa95b-0ed8-4138-a6d9-bace44f4975e)
<br>
<br>
Customer can edit thier personal information, such as username, email, gender, address and so on.
<br>
![image](https://github.com/user-attachments/assets/402f63fc-4a84-49e8-b2a0-1eb9be7beb7e)
<br>
<br>
After filled in the information, customer can click "Save" button to record their latest information.
<br>
![image](https://github.com/user-attachments/assets/9de8b679-152c-4d55-aa88-851f5316de13)
<br>
<br>

### Customer Cart Management ###
### Customer - Get User Carts ###
Customer can click the shopping car icon to view their cart. 
<br>
![image](https://github.com/user-attachments/assets/f844e25a-b46b-4db3-b673-e0e436a24dd2)
<br>
<br>
After clicking the icon, users can review the products they've added.
<br>
![image](https://github.com/user-attachments/assets/4caa52ef-90c7-4b9a-bb83-4a084bfac0a5)
<br>
<br>

### Customer - Update Cart Item Quantity ###
Customer can click the "+" button to increase the product's quantity.
<br>
![image](https://github.com/user-attachments/assets/34dae49d-b4cf-4e4b-9d50-648c3ecafb9b)
<br>
<br>

### Customer - Remove Product From Cart ###
Customer can click the trash icon to remove the product from cart.
<br>
![image](https://github.com/user-attachments/assets/3f8b1df2-25a5-4784-a382-0a7103295053)
<br>
<br>
![image](https://github.com/user-attachments/assets/3f8fec86-b759-46f5-b5c6-740d5b5268f3)
<br>
<br>
![image](https://github.com/user-attachments/assets/863188dc-e9b6-471a-bc9a-4d6cdcb47aec)
<br>
<br>

### Customer - Clear Cart ###
In cart, customer can choose the "Clear Cart" button to clear all products in your cart.
<br>
![image](https://github.com/user-attachments/assets/01bb5aa9-ae7d-42b0-b242-e56b7c75f252)
<br>
<br>
![image](https://github.com/user-attachments/assets/336e8da3-ddfe-4816-b487-62ad7f10bbfc)
<br>
<br>
![image](https://github.com/user-attachments/assets/2774bb45-a053-4a92-90ed-30df0e9486c6)
<br>
<br>

### Customer - Checkout ###
Customer can choose the "Checkout" button to make payment.
<br>
![image](https://github.com/user-attachments/assets/b5314eca-a27b-4f1d-ab85-9a24cc1dab25)
<br>
<br>
Based on the checkout details, the system will apply the voucher automatially based on the amount.
<br>
![image](https://github.com/user-attachments/assets/abd52ba9-a3d8-4a8b-9d0a-521a31b6b35f)
<br>
<br>
Customer can click "Confirm Order", otherwise customer can click "Back to cart" back to the cart.
<br>
![image](https://github.com/user-attachments/assets/2a233f2c-6e02-4d3f-82f8-86cbb4384b56)
<br>
<br>
After click "Confirm Order", the system will pop up the successful message.
<br>
![image](https://github.com/user-attachments/assets/4949e081-7b43-4f76-ad83-d8ca8612e6d9)
<br>
<br>

### Customer - View Order ###
Customer can click "View Order" button or click the "Orders" at the header of the website to view order
<br>
![image](https://github.com/user-attachments/assets/d96f3fa2-0489-4225-a6a3-1c3b2220ac6d)
<br>
<br>
![Screenshot 2025-06-22 011627](https://github.com/user-attachments/assets/a05b4494-a1b0-4ac9-881f-f4e2e0042a4a)
<br>
<br>
Customer can click "View Detail" button to view the order summary.
<br>
![image](https://github.com/user-attachments/assets/48a89a34-417c-4046-97ec-aba1a0006b74)
<br>
<br>
![image](https://github.com/user-attachments/assets/2031e52a-5a7c-439e-ad9f-ade1fda733de)
<br>
<br>





  


