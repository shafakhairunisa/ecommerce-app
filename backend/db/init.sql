-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2025 at 03:49 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `qurbadb`
--

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `cart_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`cart_id`, `user_id`, `created_at`, `updated_at`) VALUES
(2, 7, '2025-06-10 01:31:27', '2025-06-10 01:31:27'),
(3, 9, '2025-06-10 04:55:07', '2025-06-10 04:55:07');

-- --------------------------------------------------------

--
-- Table structure for table `cart_items`
--

CREATE TABLE `cart_items` (
  `cart_item_id` bigint(20) NOT NULL,
  `cart_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `order_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `total_amount` decimal(38,2) NOT NULL,
  `discount_percentage` decimal(5,2) DEFAULT 0.00,
  `discount_amount` decimal(10,2) DEFAULT 0.00,
  `original_amount` decimal(10,2) DEFAULT 0.00,
  `status` enum('PENDING','CONFIRMED','SHIPPED','DELIVERED','CANCELLED') NOT NULL DEFAULT 'PENDING',
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`order_id`, `user_id`, `total_amount`, `status`, `order_date`, `updated_at`) VALUES
(1, 9, 35.00, 'PENDING', '2025-06-10 05:11:24', '2025-06-10 05:11:24'),
(2, 9, 35.00, 'PENDING', '2025-06-10 05:32:09', '2025-06-10 05:32:09'),
(3, 7, 55.00, 'PENDING', '2025-06-15 15:29:51', '2025-06-15 15:29:51');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `order_item_id` bigint(20) NOT NULL,
  `order_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(38,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`order_item_id`, `order_id`, `product_id`, `quantity`, `unit_price`) VALUES
(1, 1, 3, 1, 35.00),
(2, 2, 3, 1, 35.00),
(3, 3, 2, 1, 55.00);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `product_id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `price` decimal(38,2) NOT NULL,
  `category` varchar(255) NOT NULL,
  `stock_quantity` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `description`, `price`, `category`, `stock_quantity`, `created_at`, `updated_at`, `image_path`) VALUES
(1, 'Saffron ZAFA\'RAN', 'Premium saffron threads', 27.00, 'Lain-lain', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Lain-lain/Saffron ZAFA\'RAN.png'),
(2, 'Minyak Bidara - 120ML', 'Pure bidara oil, 120ml', 55.00, 'Lain-lain', 19, '2025-05-03 10:24:54', '2025-06-15 15:29:51', 'assets/QurbaProductPhoto/Lain-lain/Minyak Bidara - 120ML.png'),
(3, 'Minyak Bidara - 45ML', 'Pure bidara oil, 45ml', 35.00, 'Lain-lain', 18, '2025-05-03 10:24:54', '2025-06-10 05:32:09', 'assets/QurbaProductPhoto/Lain-lain/Minyak Bidara - 45ML.png'),
(4, 'MADU MINDA', 'Natural honey for brain health', 45.00, 'Madu', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Madu/MADU MINDA.png'),
(5, 'LI KHAMSATUN', 'Premium blended honey', 58.00, 'Madu', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Madu/LI KHAMSATUN.png'),
(6, 'Perisa Sup', 'Saffron-infused soup noodles', 14.00, 'Mee', 20, '2025-05-03 10:24:54', '2025-05-26 07:51:12', 'assets/QurbaProductPhoto/Mee/Perisa Sup.png'),
(7, 'Perisa Tomyam ODEEN', 'Spicy tomyam saffron noodles', 14.00, 'Mee', 20, '2025-05-03 10:24:54', '2025-05-26 07:51:12', 'assets/QurbaProductPhoto/Mee/Perisa Tomyam ODEEN.png'),
(8, 'Perisa Kari', 'Rich curry saffron noodles', 14.00, 'Mee', 20, '2025-05-03 10:24:54', '2025-05-26 07:51:12', 'assets/QurbaProductPhoto/Mee/Perisa Kari.png'),
(9, 'KOPI IBNU SINA', 'Traditional Arabic coffee blend', 23.00, 'Minuman', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Minuman/Kopi Ibnu Sina.png'),
(10, 'TEH IBNU SINA', 'Herbal tea with saffron', 24.00, 'Minuman', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Minuman/Teh Ibnu Sina.png'),
(11, 'Khal Tanpa Herba - 500 ML', 'Pure vinegar, 500ml', 40.00, 'Rempah', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Rempah/Khal Tanpa Herba - 500 ML.png'),
(12, 'Khal Dengan Herba - 500 ML', 'Herbal vinegar, 500ml', 60.00, 'Rempah', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Rempah/Khal Dengan Herba - 500 ML.png'),
(13, 'Khal Dengan Herba - 1LITER', 'Herbal vinegar, 1 liter', 95.00, 'Rempah', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Rempah/Khal Dengan Herba - 1LITER.png'),
(14, 'Serbuk Perencah Penyedap Burger', 'Burger seasoning powder', 5.00, 'Rempah', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Rempah/Serbuk Perencah Penyedap Burger.png'),
(15, 'Chili Giling', 'Ground chili paste', 3.00, 'Sos', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Sos/Chili Giling.png'),
(16, 'Asam Jawa Plus', 'Tamarind sauce with spices', 4.30, 'Sos', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Sos/Asam Jawa Plus.png'),
(17, 'Sos Lada Hitam - 1KG', 'Black pepper sauce, 1kg', 5.50, 'Sos', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Sos/Sos Lada Hitam - 1KG.png'),
(18, 'Sos Lada Hitem - 340g', 'Black pepper sauce, 340g', 3.80, 'Sos', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Sos/Sos Lada Hitem - 340g.png'),
(19, 'Sos Tiram - 340g', 'Oyster sauce, 340g', 3.80, 'Sos', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Sos/Sos Tiram - 340g.png'),
(20, 'Sos Cili Burger - 340g', 'Chili sauce for burgers, 340g', 3.00, 'Sos', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Sos/Sos Cili Burger - 340g.png'),
(21, 'Kuah Rojak Madu - 400g', 'Honey rojak sauce, 400g', 5.50, 'Sos', 20, '2025-05-03 10:24:54', '2025-05-26 07:46:27', 'assets/QurbaProductPhoto/Sos/Kuah Rojak Madu - 400g.png');

-- --------------------------------------------------------



-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `role_id` bigint(20) NOT NULL,
  `role_name` enum('ADMIN','CUSTOMER') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'ADMIN'),
(2, 'CUSTOMER');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `enabled` tinyint(1) NOT NULL DEFAULT 1,
  `role_id` bigint(20) NOT NULL DEFAULT 2,
  `gender` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `created_at`, `updated_at`, `enabled`, `role_id`, `gender`, `bio`, `address`, `phone_number`, `date_of_birth`) VALUES
(1, 'admin', 'admin@example.com', '$2a$10$f7Q7k6weJ09nvQdzvExD9O55LzkKvNPCRWDVDWV/oMMU2s3aGMpd.', '2025-04-19 23:39:37', '2025-05-03 10:21:53', 1, 1, NULL, NULL, NULL, NULL, NULL),
(5, 'Admin101', 'admin123@gmail.com', '$2a$10$6k3qA4p1NYnfKHBaYcMJD.1jMufmOdeoNHgNak0LL9Jw8W4GZBAxK', '2025-05-07 23:58:21', '2025-05-07 23:58:21', 1, 1, NULL, NULL, NULL, NULL, NULL),
(6, 'AdamYau', 'adamyau@gmail.com', '$2a$10$wCBT0ClVdoHmMGHT7U/RiOwi5lAM45BYsmCgLw9N4hyjS9pwBtT6O', '2025-05-08 03:19:44', '2025-05-08 03:19:44', 1, 2, NULL, NULL, NULL, NULL, NULL),
(7, 'cc', 'cc@gmail.com', '$2a$10$7grkdB4DU7THWTh.bCYdXuH0Px7jybsFx36GKhP3AR9TKY3gRSRyS', '2025-06-05 21:10:26', '2025-06-12 20:28:21', 1, 2, 'MALE', 'This is my bio', '123 Main St', '+1234567890', '1990-01-01'),
(8, 'aa', 'aa@gmail.com', '$2a$10$6.RsfoMWt45jxGI1eYtNLu1S2cauzZu/j.hTxFj5Tap4rf2sJGTtu', '2025-06-05 22:20:14', '2025-06-05 22:20:14', 1, 2, NULL, NULL, NULL, NULL, NULL),
(9, 'yyy', 'yy@gmail.com', '$2a$10$Ud4vuoeqKZy76Etw7aTjBue6BOvmUqKtBo/PqsF/BWWaMZRwgWPCy', '2025-06-10 04:12:42', '2025-06-10 04:12:42', 1, 2, NULL, NULL, NULL, NULL, NULL),
(10, 'Edison', 'edison@gmail.com', '$2a$10$gKGsWu283E9cvyd6btmHHOnkXl0kFq3VAE98yVpTneHacAROSE8bi', '2025-06-10 05:15:43', '2025-06-10 05:15:43', 1, 1, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `wishlists`
--

CREATE TABLE `wishlists` (
  `wishlist_id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `product_id` bigint(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wishlists`
--

INSERT INTO `wishlists` (`wishlist_id`, `user_id`, `product_id`, `created_at`) VALUES
(1, 7, 1, '2025-06-05 22:59:23'),
(2, 7, 2, '2025-06-05 23:06:28');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD PRIMARY KEY (`cart_item_id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`order_item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`);



--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `users_ibfk_1` (`role_id`);

--
-- Indexes for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`wishlist_id`),
  ADD UNIQUE KEY `user_product_unique` (`user_id`,`product_id`),
  ADD KEY `product_id` (`product_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `cart_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cart_items`
--
ALTER TABLE `cart_items`
  MODIFY `cart_item_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `order_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `order_item_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;



--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `wishlist_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `cart_items`
--
ALTER TABLE `cart_items`
  ADD CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`cart_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;



--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);

--
-- Constraints for table `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
