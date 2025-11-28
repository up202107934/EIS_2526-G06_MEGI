-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 28-Nov-2025 às 21:37
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `colecoesdb`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `collections`
--

CREATE TABLE `collections` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Extraindo dados da tabela `collections`
--

INSERT INTO `collections` (`id`, `user_id`, `nome`, `descricao`, `created_at`) VALUES
(1, 2, 'disney', 'bonecos', '2025-11-28 20:21:49');

-- --------------------------------------------------------

--
-- Estrutura da tabela `collection_categories`
--

CREATE TABLE `collection_categories` (
  `id_collection_category` int(11) NOT NULL,
  `name` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `collection_categories`
--

INSERT INTO `collection_categories` (`id_collection_category`, `name`) VALUES
(1, 'Action Figures'),
(3, 'Comics'),
(2, 'Trading Cards');

-- --------------------------------------------------------

--
-- Estrutura da tabela `collection_event_reviews`
--

CREATE TABLE `collection_event_reviews` (
  `id_review` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_event` int(11) NOT NULL,
  `id_collection` int(11) NOT NULL,
  `rate` int(11) NOT NULL CHECK (`rate` between 1 and 5),
  `comment` text DEFAULT NULL,
  `review_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `collection_event_reviews`
--

INSERT INTO `collection_event_reviews` (`id_review`, `id_user`, `id_event`, `id_collection`, `rate`, `comment`, `review_date`) VALUES
(1, 1, 3, 4, 5, 'Coleção incrível, peças muito bem conservadas!', '2025-11-27 11:49:31'),
(2, 2, 3, 6, 4, 'Boa seleção de comics, mas faltavam edições mais raras.', '2025-11-27 11:49:31');

-- --------------------------------------------------------

--
-- Estrutura da tabela `collection_items`
--

CREATE TABLE `collection_items` (
  `id_collection` int(11) NOT NULL,
  `id_item` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `collection_items`
--

INSERT INTO `collection_items` (`id_collection`, `id_item`, `quantity`) VALUES
(4, 4, 1),
(5, 5, 1),
(6, 6, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `events`
--

CREATE TABLE `events` (
  `id_event` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `location` varchar(120) DEFAULT NULL,
  `event_date` date NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `events`
--

INSERT INTO `events` (`id_event`, `name`, `location`, `event_date`, `description`) VALUES
(3, 'Comic Con Porto', 'Porto', '2025-03-15', NULL),
(4, 'Retro Collectors Fair', 'Lisboa', '2025-04-12', NULL),
(5, 'test', 'test', '2025-11-28', 'test');

-- --------------------------------------------------------

--
-- Estrutura da tabela `event_collections`
--

CREATE TABLE `event_collections` (
  `id_event` int(11) NOT NULL,
  `id_collection` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `event_collections`
--

INSERT INTO `event_collections` (`id_event`, `id_collection`) VALUES
(3, 4),
(3, 6),
(4, 5);

-- --------------------------------------------------------

--
-- Estrutura da tabela `event_items`
--

CREATE TABLE `event_items` (
  `id_event_item` int(11) NOT NULL,
  `id_event` int(11) NOT NULL,
  `id_item` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `items`
--

CREATE TABLE `items` (
  `id_item` int(11) NOT NULL,
  `id_item_category` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `importance` int(11) DEFAULT NULL,
  `weight` decimal(10,2) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `acquisition_date` date DEFAULT NULL,
  `rarity` varchar(60) DEFAULT NULL,
  `dimensions` varchar(60) DEFAULT NULL,
  `year_of_release` int(11) DEFAULT NULL,
  `edition_number` varchar(60) DEFAULT NULL,
  `condition` varchar(60) DEFAULT NULL,
  `franchise` varchar(80) DEFAULT NULL,
  `material` varchar(80) DEFAULT NULL,
  `scale` varchar(40) DEFAULT NULL,
  `serial_no` varchar(80) DEFAULT NULL,
  `status` varchar(40) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `items`
--

INSERT INTO `items` (`id_item`, `id_item_category`, `name`, `importance`, `weight`, `price`, `acquisition_date`, `rarity`, `dimensions`, `year_of_release`, `edition_number`, `condition`, `franchise`, `material`, `scale`, `serial_no`, `status`) VALUES
(4, 1, 'Darth Vader Black Series', 5, 0.30, 39.99, '2024-05-10', 'Rare', '15cm', 2020, '1st', 'New', 'Star Wars', 'Plastic', '1:12', 'SW-0001', 'Owned'),
(5, 2, 'Charizard Holo 1st Ed.', 5, NULL, 250.00, '2023-11-01', 'Ultra Rare', NULL, 1999, '1st Edition', 'Good', 'Pokémon', 'Cardboard', NULL, 'PK-0001', 'Owned'),
(6, 3, 'Spider-Man #1', 4, NULL, 15.00, '2022-08-01', 'Common', NULL, 1990, 'Issue 1', 'Fair', 'Marvel', 'Paper', NULL, 'CM-0001', 'Owned');

-- --------------------------------------------------------

--
-- Estrutura da tabela `item_categories`
--

CREATE TABLE `item_categories` (
  `id_item_category` int(11) NOT NULL,
  `name` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `item_categories`
--

INSERT INTO `item_categories` (`id_item_category`, `name`) VALUES
(2, 'Card'),
(3, 'Comic'),
(1, 'Figure');

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`) VALUES
(1, 'João', '$2y$10$2neO22Lh2CBDfNLXdtEgfuZPuRCb79OHNt6SsAtJYxQkljLWns7AO', ''),
(2, 'teste', '$2y$10$8i35IqZfpOyIM9ftcCz7zO1Knh0Vq2duxePBe0U7a/DW55aubUIWe', 'teste@gmail.com');

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_events_interest`
--

CREATE TABLE `user_events_interest` (
  `id_user` int(11) NOT NULL,
  `id_event` int(11) NOT NULL,
  `liked` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `user_events_interest`
--

INSERT INTO `user_events_interest` (`id_user`, `id_event`, `liked`) VALUES
(1, 3, 1),
(2, 4, 0);

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_events_went`
--

CREATE TABLE `user_events_went` (
  `id_user` int(11) NOT NULL,
  `id_event` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `user_events_went`
--

INSERT INTO `user_events_went` (`id_user`, `id_event`) VALUES
(1, 3),
(1, 4),
(2, 3);

-- --------------------------------------------------------

--
-- Estrutura da tabela `wishlists`
--

CREATE TABLE `wishlists` (
  `id_wishlist` int(11) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `wishlists`
--

INSERT INTO `wishlists` (`id_wishlist`, `id_user`) VALUES
(1, 1),
(2, 2);

-- --------------------------------------------------------

--
-- Estrutura da tabela `wishlist_items`
--

CREATE TABLE `wishlist_items` (
  `id_wishlist` int(11) NOT NULL,
  `id_item` int(11) NOT NULL,
  `added_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `wishlist_items`
--

INSERT INTO `wishlist_items` (`id_wishlist`, `id_item`, `added_at`) VALUES
(1, 6, '2025-11-27 11:49:31'),
(2, 5, '2025-11-27 11:49:31');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Índices para tabela `collection_categories`
--
ALTER TABLE `collection_categories`
  ADD PRIMARY KEY (`id_collection_category`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Índices para tabela `collection_event_reviews`
--
ALTER TABLE `collection_event_reviews`
  ADD PRIMARY KEY (`id_review`),
  ADD UNIQUE KEY `id_user` (`id_user`,`id_event`,`id_collection`),
  ADD KEY `id_event` (`id_event`),
  ADD KEY `id_collection` (`id_collection`);

--
-- Índices para tabela `collection_items`
--
ALTER TABLE `collection_items`
  ADD PRIMARY KEY (`id_collection`,`id_item`),
  ADD KEY `id_item` (`id_item`);

--
-- Índices para tabela `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id_event`);

--
-- Índices para tabela `event_collections`
--
ALTER TABLE `event_collections`
  ADD PRIMARY KEY (`id_event`,`id_collection`),
  ADD KEY `id_collection` (`id_collection`);

--
-- Índices para tabela `event_items`
--
ALTER TABLE `event_items`
  ADD PRIMARY KEY (`id_event_item`),
  ADD UNIQUE KEY `id_event` (`id_event`,`id_item`),
  ADD KEY `fk_event_items_item` (`id_item`);

--
-- Índices para tabela `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id_item`),
  ADD KEY `id_item_category` (`id_item_category`);

--
-- Índices para tabela `item_categories`
--
ALTER TABLE `item_categories`
  ADD PRIMARY KEY (`id_item_category`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Índices para tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Índices para tabela `user_events_interest`
--
ALTER TABLE `user_events_interest`
  ADD PRIMARY KEY (`id_user`,`id_event`),
  ADD KEY `id_event` (`id_event`);

--
-- Índices para tabela `user_events_went`
--
ALTER TABLE `user_events_went`
  ADD PRIMARY KEY (`id_user`,`id_event`),
  ADD KEY `id_event` (`id_event`);

--
-- Índices para tabela `wishlists`
--
ALTER TABLE `wishlists`
  ADD PRIMARY KEY (`id_wishlist`),
  ADD UNIQUE KEY `id_user` (`id_user`);

--
-- Índices para tabela `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD PRIMARY KEY (`id_wishlist`,`id_item`),
  ADD KEY `id_item` (`id_item`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `collections`
--
ALTER TABLE `collections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `collection_categories`
--
ALTER TABLE `collection_categories`
  MODIFY `id_collection_category` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de tabela `collection_event_reviews`
--
ALTER TABLE `collection_event_reviews`
  MODIFY `id_review` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `collections`
--
ALTER TABLE `collections`
  ADD CONSTRAINT `collections_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
