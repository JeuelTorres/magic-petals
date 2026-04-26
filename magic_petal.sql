-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 25, 2026 at 02:07 AM
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
-- Database: `magic_petal`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`) VALUES
(4, 'basket'),
(3, 'bear'),
(1, 'eternal'),
(2, 'natural');

-- --------------------------------------------------------

--
-- Table structure for table `customization_options`
--

CREATE TABLE `customization_options` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customization_options`
--

INSERT INTO `customization_options` (`id`, `name`) VALUES
(12, 'Basket Items'),
(5, 'Chocolates'),
(2, 'Flower Type'),
(4, 'Foil Balloon'),
(8, 'Gift Box'),
(10, 'Inspiration Photo'),
(3, 'Message Card'),
(7, 'Premium Ribbon'),
(1, 'Rose Color'),
(6, 'Small Teddy Bear'),
(9, 'Song Request'),
(11, 'Special Requests');

-- --------------------------------------------------------

--
-- Table structure for table `customization_values`
--

CREATE TABLE `customization_values` (
  `id` int(11) NOT NULL,
  `option_id` int(11) NOT NULL,
  `value` varchar(150) NOT NULL,
  `extra_price` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customization_values`
--

INSERT INTO `customization_values` (`id`, `option_id`, `value`, `extra_price`) VALUES
(1, 1, 'Red', 0.00),
(2, 1, 'Pink', 0.00),
(3, 1, 'White', 0.00),
(4, 1, 'Yellow', 0.00),
(5, 1, 'Purple', 0.00),
(6, 1, 'Mixed', 0.00),
(7, 2, 'Roses', 0.00),
(8, 2, 'Tulips', 0.00),
(9, 2, 'Sunflowers', 0.00),
(10, 2, 'Daisies', 0.00),
(11, 2, 'Lilies', 0.00),
(12, 2, 'Mixed', 0.00),
(13, 12, '🧸 Stuffed Animal', 0.00),
(14, 12, '🍫 Chocolates', 0.00),
(15, 12, '🍭 Candy', 0.00),
(16, 12, '🎈 Extra Balloons', 0.00),
(17, 12, '📚 Storybook', 0.00),
(18, 12, '🎨 Coloring Kit', 0.00),
(19, 12, '🧩 Toys', 0.00),
(20, 12, '👕 Clothing', 0.00),
(21, 12, '🍼 Baby Items', 0.00),
(22, 12, '🎁 Small Gifts', 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `delivery_details`
--

CREATE TABLE `delivery_details` (
  `id` int(11) NOT NULL,
  `order_item_id` int(11) NOT NULL,
  `delivery_type` enum('delivery','pickup') DEFAULT 'delivery',
  `delivery_date` date DEFAULT NULL,
  `delivery_time` time DEFAULT NULL,
  `address` text DEFAULT NULL,
  `recipient_name` varchar(100) DEFAULT NULL,
  `song_request` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `custom_flower` varchar(255) DEFAULT NULL,
  `basket_description` text DEFAULT NULL,
  `has_inspo_photo` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `delivery_details`
--

INSERT INTO `delivery_details` (`id`, `order_item_id`, `delivery_type`, `delivery_date`, `delivery_time`, `address`, `recipient_name`, `song_request`, `notes`, `custom_flower`, `basket_description`, `has_inspo_photo`) VALUES
(1, 1, 'pickup', '2026-04-25', '22:17:00', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(2, 2, 'pickup', '2026-05-01', '12:30:00', NULL, NULL, NULL, NULL, NULL, NULL, 0),
(3, 3, 'delivery', '2026-04-25', '12:00:00', 'libertad', 'shel', NULL, NULL, NULL, NULL, 0),
(4, 4, 'pickup', '2026-04-25', '12:00:00', NULL, NULL, NULL, NULL, NULL, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `threshold` int(11) DEFAULT 5,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory`
--

INSERT INTO `inventory` (`id`, `name`, `stock`, `threshold`, `updated_at`) VALUES
(1, 'Red Eternal Roses', 25, 5, '2026-04-22 12:28:44'),
(2, 'Pink Eternal Roses', 18, 5, '2026-04-22 12:28:44'),
(3, 'White Eternal Roses', 12, 5, '2026-04-22 12:28:44'),
(4, 'Foil Balloons', 20, 5, '2026-04-22 12:28:44'),
(5, 'Bobo Balloons', 10, 3, '2026-04-22 12:28:44'),
(6, 'Magic Bears', 8, 2, '2026-04-22 12:28:44'),
(7, 'Ribbons', 50, 10, '2026-04-22 12:28:44'),
(8, 'Gift Boxes', 15, 5, '2026-04-22 12:28:44'),
(9, 'Chocolates', 30, 8, '2026-04-22 12:28:44'),
(10, 'Teddy Bears', 12, 3, '2026-04-22 12:28:44'),
(11, 'Coloring Kits', 8, 3, '2026-04-22 12:28:44'),
(12, 'Natural Flowers', 40, 10, '2026-04-22 12:28:44');

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `name` varchar(100) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `question` text DEFAULT NULL,
  `answered` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ref` varchar(20) NOT NULL,
  `status` enum('pending','active','completed','cancelled') DEFAULT 'pending',
  `total_price` decimal(10,2) DEFAULT 0.00,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `ref`, `status`, `total_price`, `created_at`) VALUES
(1, 2, '#41538', 'pending', 28.00, '2026-04-24 03:23:05'),
(2, 5, '#20311', 'pending', 28.00, '2026-04-24 23:43:15'),
(3, 5, '#40264', 'pending', 113.00, '2026-04-24 23:49:29'),
(4, 5, '#61212', 'pending', 35.00, '2026-04-24 23:57:46');

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `product_name` varchar(150) DEFAULT NULL,
  `quantity` int(11) DEFAULT 1,
  `price_at_time` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `quantity`, `price_at_time`) VALUES
(1, 1, 1, '5 Roses (Eternal)', 1, 28.00),
(2, 2, 1, '5 Roses (Eternal)', 1, 28.00),
(3, 3, 18, 'Package #1', 1, 113.00),
(4, 4, 2, '7 Roses (Eternal)', 1, 35.00);

-- --------------------------------------------------------

--
-- Table structure for table `order_item_customizations`
--

CREATE TABLE `order_item_customizations` (
  `id` int(11) NOT NULL,
  `order_item_id` int(11) NOT NULL,
  `customization_value_id` int(11) DEFAULT NULL,
  `custom_text` text DEFAULT NULL,
  `image_path` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_item_customizations`
--

INSERT INTO `order_item_customizations` (`id`, `order_item_id`, `customization_value_id`, `custom_text`, `image_path`) VALUES
(1, 1, NULL, 'Rose Color: 🔴 Red', NULL),
(2, 2, NULL, 'Rose Color: 💛 Yellow', NULL),
(3, 2, NULL, 'teddy: stitch', NULL),
(4, 4, NULL, 'Rose Color: 💖 Pink', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `enabled` tinyint(1) DEFAULT 1,
  `category_id` int(11) NOT NULL,
  `roses_count` int(11) DEFAULT NULL,
  `includes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `image`, `enabled`, `category_id`, `roses_count`, `includes`, `created_at`) VALUES
(1, '5 Roses', 'A sweet and intimate bouquet — perfect for a simple \"thinking of you\" moment.', 28.00, '/5.jpeg', 1, 1, 5, NULL, '2026-04-22 12:28:43'),
(2, '7 Roses', 'A classic arrangement that says just enough without being too much.', 35.00, '/7.jpeg', 1, 1, 7, NULL, '2026-04-22 12:28:43'),
(3, '10 Roses', 'Full and beautiful — great for birthdays, anniversaries, or just because.', 60.00, '/10.jpeg', 1, 1, 10, NULL, '2026-04-22 12:28:43'),
(4, '12 Roses', 'A dozen roses — timeless and romantic. The classic love gesture.', 75.00, '/12.jpeg', 1, 1, 12, NULL, '2026-04-22 12:28:43'),
(5, '15 Roses', 'A generous bouquet that makes a real statement when they open the door.', 84.00, '/15.jpeg', 1, 1, 15, NULL, '2026-04-22 12:28:43'),
(6, '20 Roses', 'Bold and lush — this one turns heads and melts hearts.', 113.00, '/20.jpeg', 1, 1, 20, NULL, '2026-04-22 12:28:43'),
(7, '25 Roses', 'Twenty-five reasons to smile. Stunning for any special occasion.', 141.00, '/25.jpeg', 1, 1, 25, NULL, '2026-04-22 12:28:43'),
(8, '30 Roses', 'A showstopper. Thirty eternal roses that will never wilt or fade.', 169.00, '/30.jpeg', 1, 1, 30, NULL, '2026-04-22 12:28:43'),
(9, '35 Roses', 'For when you really want to go all out. Absolutely breathtaking.', 197.00, '/35.jpeg', 1, 1, 35, NULL, '2026-04-22 12:28:43'),
(10, '40 Roses', 'Forty roses — a grand romantic gesture they will never forget.', 225.00, '/40.jpeg', 1, 1, 40, NULL, '2026-04-22 12:28:43'),
(11, '45 Roses', 'An extraordinary display of love and appreciation.', 253.00, '/45.jpeg', 1, 1, 45, NULL, '2026-04-22 12:28:43'),
(12, '50 Roses', 'Fifty eternal roses. The ultimate bouquet for the most special person.', 309.00, '/50.jpeg', 1, 1, 50, NULL, '2026-04-22 12:28:43'),
(13, '100 Roses', 'One hundred roses. When words are simply not enough.', 563.00, '/100.jpeg', 1, 1, 100, NULL, '2026-04-22 12:28:43'),
(14, 'Single Flower', 'A single beautiful natural flower — simple, elegant, and heartfelt.', 10.00, '/1nf.jpeg', 1, 2, NULL, NULL, '2026-04-22 12:28:44'),
(15, '6 Flowers', 'A lovely half-dozen natural flower bouquet, fresh and fragrant.', 60.00, '/6NF.jpeg', 1, 2, NULL, NULL, '2026-04-22 12:28:44'),
(16, '12 Flowers', 'A full dozen natural flowers — classic, stunning, and unforgettable.', 120.00, '/12NF.jpeg', 1, 2, NULL, NULL, '2026-04-22 12:28:44'),
(17, 'Mix Bouquet', 'A beautiful mix of natural flowers, colorful and full of life.', 75.00, '/MIX.jpeg', 1, 2, NULL, NULL, '2026-04-22 12:28:44'),
(18, 'Package #1', 'Magic Bear delivery — perfect for a sweet gesture.', 113.00, '/pck1.jpeg', 1, 3, NULL, 'Magic Bear + umbrella/bubbles + foil balloon + small bouquet', '2026-04-22 12:28:44'),
(19, 'Package #2', 'Our most popular bear delivery — all the magic.', 169.00, '/pkg2.jpeg', 1, 3, NULL, 'Magic Bear + umbrella/bubbles + personalized bobo balloon + large bouquet', '2026-04-22 12:28:44'),
(20, 'Package #3', 'The ultimate bear experience with a live singer!', 225.00, '/pkg3.jpeg', 1, 3, NULL, 'Magic Bear + umbrella/bubbles + personalized balloon + big bouquet + solo singer', '2026-04-22 12:28:44');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `created_at`) VALUES
(2, 'Jeuel', 'jeuel@gmail.com', '6387154', '$2b$10$zko.s6.sZlCKMZiGFsiLNOopajbc/0e9E3ELribQSeFZnjkesVwoa', 'customer', '2026-04-22 21:40:44'),
(3, 'Admin', 'admin@magicpetals.com', '6387154', '$2b$10$Z/MagWAkAqAGbkdZfT36t.xzon6wAwxW4lq07VBtlTH76cKQZjhpi', 'admin', '2026-04-22 22:05:50'),
(4, 'stef', 'stef@gmail.com', '6607211', '$2b$10$WG.ge160/q0HJoJWgIrn2.RKJWE1EIICE41jX1Mm4SmYpObuzddxm', 'customer', '2026-04-23 19:12:36'),
(5, 'Jeuell', 'juju.06torres@gmail.com', '6074586', '$2b$10$Ml5aJeA72/bctdcfOVM7Gujj2DlZbrIgeM4uNyNusQAv2XRphJEge', 'customer', '2026-04-24 23:42:23');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `customization_options`
--
ALTER TABLE `customization_options`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `customization_values`
--
ALTER TABLE `customization_values`
  ADD PRIMARY KEY (`id`),
  ADD KEY `option_id` (`option_id`);

--
-- Indexes for table `delivery_details`
--
ALTER TABLE `delivery_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_item_id` (`order_item_id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `order_item_customizations`
--
ALTER TABLE `order_item_customizations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_item_id` (`order_item_id`),
  ADD KEY `customization_value_id` (`customization_value_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `customization_options`
--
ALTER TABLE `customization_options`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `customization_values`
--
ALTER TABLE `customization_values`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `delivery_details`
--
ALTER TABLE `delivery_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order_item_customizations`
--
ALTER TABLE `order_item_customizations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `customization_values`
--
ALTER TABLE `customization_values`
  ADD CONSTRAINT `customization_values_ibfk_1` FOREIGN KEY (`option_id`) REFERENCES `customization_options` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `delivery_details`
--
ALTER TABLE `delivery_details`
  ADD CONSTRAINT `delivery_details_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `order_item_customizations`
--
ALTER TABLE `order_item_customizations`
  ADD CONSTRAINT `order_item_customizations_ibfk_1` FOREIGN KEY (`order_item_id`) REFERENCES `order_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_item_customizations_ibfk_2` FOREIGN KEY (`customization_value_id`) REFERENCES `customization_values` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
