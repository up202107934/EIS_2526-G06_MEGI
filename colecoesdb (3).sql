-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 30-Nov-2025 às 11:33
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
  `id_collection` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_collection_category` int(11) NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `cover_img` varchar(255) DEFAULT NULL,
  `creation_date` date DEFAULT NULL,
  `rate` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `collections`
--

INSERT INTO `collections` (`id_collection`, `id_user`, `id_collection_category`, `name`, `description`, `cover_img`, `creation_date`, `rate`) VALUES
(27, 1, 24, 'Pokémon Cards - Binder Principal', 'Coleção principal de cartas Pokémon, organizada por sets e raridade.', 'img/collections/rita_pokemon_binder.jpg', '2023-01-15', 5),
(28, 1, 19, 'Figures Anime (1/8 e 1/10)', 'Figuras anime em PVC, maioritariamente escalas 1/8 e 1/10.', 'img/collections/rita_figures_anime.jpg', '2022-10-02', 4),
(29, 1, 21, 'Funko Pop - Marvel & Anime', 'Funko Pops mistos entre Marvel e algumas séries anime.', 'img/collections/rita_funko.jpg', '2023-06-08', 4),
(30, 2, 22, 'Marvel Collection', 'Coleção dedicada a Marvel, com foco em Spider-Man e X-Men.', 'img/collections/raquel_marvel.jpg', '2021-06-20', 5),
(31, 2, 20, 'Manga Shelf', 'Mangas completos e em progresso, sobretudo shonen.', 'img/collections/raquel_manga.jpg', '2020-09-11', 4),
(32, 2, 3, 'Comics Indies e Clássicos', 'Comics variados fora do mainstream, edições antigas e raras.', 'img/collections/raquel_comics.jpg', '2022-02-05', 4),
(33, 3, 25, 'MTG Cards - Commander', 'Cartas favoritas e staples para Commander.', 'img/collections/pedro_mtg_commander.jpg', '2024-02-03', 4),
(34, 3, 2, 'Trading Cards Diversas', 'Cartas não-TCG (desporto, autógrafos, edições especiais).', 'img/collections/pedro_trading.jpg', '2023-03-19', 3),
(35, 3, 1, 'Miniatures Star Wars', 'Miniaturas e bustos Star Wars, algumas edições limitadas.', 'img/collections/pedro_miniatures_sw.jpg', '2022-05-27', 5),
(36, 4, 23, 'DC - Batman Era', 'Coleção focada em Batman, clássicos e deluxe.', 'img/collections/joana_dc_batman.jpg', '2021-11-01', 5),
(37, 4, 17, 'Books de Colecionismo', 'Livros sobre colecionismo, arte e guias oficiais.', 'img/collections/joana_books.jpg', '2022-07-14', 4),
(38, 4, 3, 'Comics Favoritos', 'Seleção das minhas melhores edições e runs completas.', 'img/collections/joana_comics_favs.jpg', '2023-09-09', 5);

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
(17, 'Books'),
(3, 'Comics'),
(23, 'DC'),
(19, 'Figures'),
(21, 'Funko Pop'),
(20, 'Manga'),
(22, 'Marvel'),
(1, 'Miniatures'),
(25, 'MTG Cards'),
(24, 'Pokémon Cards'),
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
(27, 10, 1),
(28, 6, 1),
(28, 7, 1),
(29, 8, 1),
(29, 9, 1),
(30, 13, 1),
(31, 14, 1),
(34, 11, 1),
(36, 12, 1),
(36, 15, 1),
(38, 12, 1),
(38, 13, 1),
(38, 15, 1);

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
(5, 'test', 'test', '2025-11-28', 'test'),
(6, 'event test', 'porto', '2025-11-04', 'aaa'),
(7, 'evento de harry potter', 'porto', '2025-11-08', 'evento de bonecos de harry potter'),
(8, 'a', 'porto', '2025-11-15', 'a'),
(9, 'event test', 'porto', '2025-11-29', 'aaaa'),
(10, 'event test', 'porto', '2025-11-29', 'aaaa'),
(11, 'event test', 'porto', '2025-11-29', 'aaaa'),
(12, 'a', 'a', '2025-10-29', 'a'),
(13, 'A', 'A', '2025-11-08', 'A'),
(14, 'LAURINDINHA', 'PORTO', '2025-11-08', 'B'),
(15, 'testing', 'trdttt', '2025-10-30', 'test');

-- --------------------------------------------------------

--
-- Estrutura da tabela `event_collections`
--

CREATE TABLE `event_collections` (
  `id_event` int(11) NOT NULL,
  `id_collection` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `event_items`
--

CREATE TABLE `event_items` (
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
  `img` varchar(255) DEFAULT NULL,
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

INSERT INTO `items` (`id_item`, `id_item_category`, `name`, `img`, `importance`, `weight`, `price`, `acquisition_date`, `rarity`, `dimensions`, `year_of_release`, `edition_number`, `condition`, `franchise`, `material`, `scale`, `serial_no`, `status`) VALUES
(6, 1, 'Goku Super Saiyan Figure 18cm', NULL, 9, 0.45, 25.00, '2022-08-05', 'Common', '18x8x6 cm', 2019, 'Standard Release', 'Good', 'Dragon Ball', 'PVC', '1/10', 'DB-GOKU-SSJ-18', 'owned'),
(7, 1, 'Sailor Moon Figure 20cm', NULL, 8, 0.50, 40.00, '2023-03-12', 'Limited', '20x9x7 cm', 2020, 'Anniversary Edition', 'Like New', 'Sailor Moon', 'PVC', '1/8', 'SM-ANNIV-20', 'owned'),
(8, 6, 'Funko Pop! Naruto Uzumaki (No. 71)', NULL, 7, 0.18, 13.50, '2023-09-21', 'Common', '9x6x6 cm', 2018, 'No. 71', 'Like New', 'Naruto', 'Vinyl', 'Funko', 'FK-NARUTO-071', 'owned'),
(9, 6, 'Funko Pop! Gojo Satoru (No. 1163)', NULL, 9, 0.19, 16.99, '2024-02-11', 'Exclusive', '9x6x6 cm', 2023, 'No. 1163 Special', 'New', 'Jujutsu Kaisen', 'Vinyl', 'Funko', 'FK-GOJO-1163', 'owned'),
(10, 7, 'Charizard VMAX', NULL, 10, 0.01, 110.00, '2021-01-03', 'Ultra Rare', '8.8x6.3 cm', 2020, 'Sword & Shield', 'Near Mint', 'Pokémon', 'Cardstock', 'Standard', 'PK-VMAX-CHAR-2020', 'owned'),
(11, 7, 'Blue-Eyes White Dragon', NULL, 9, 0.01, 35.00, '2020-06-18', 'Secret Rare', '8.6x5.9 cm', 2002, 'LOB-001', 'Good', 'Yu-Gi-Oh', 'Cardstock', 'Standard', 'YGO-LOB-001-BEWD', 'owned'),
(12, 3, 'Batman: The Killing Joke', NULL, 9, 0.30, 22.00, '2022-11-15', 'Classic', '26x17 cm', 1988, 'Deluxe Edition', 'Near Mint', 'DC', 'Paper', 'Standard', 'DC-KJ-DELUXE-1988', 'owned'),
(13, 3, 'Amazing Spider-Man #300', NULL, 10, 0.28, 85.00, '2021-07-09', 'Key Issue', '26x17 cm', 1988, '#300', 'Good', 'Marvel', 'Paper', 'Standard', 'MV-ASM-300-1988', 'owned'),
(14, 5, 'One Piece Vol. 1', NULL, 8, 0.22, 9.99, '2023-02-01', 'Common', '19x13 cm', 2001, '1ª edição PT', 'Good', 'One Piece', 'Paper', 'Standard', 'OP-PT-VOL1-2001', 'owned'),
(15, 8, 'Watchmen', NULL, 10, 0.90, 25.00, '2020-12-28', 'Collector', '28x18 cm', 1987, 'Graphic Novel', 'Like New', 'DC', 'Paper', 'Hardcover', 'DC-WM-HC-1987', 'owned');

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
(1, 'Figure'),
(6, 'Funko Pop'),
(8, 'Graphic Novel'),
(5, 'Manga'),
(7, 'Trading Card Game');

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `email` varchar(150) NOT NULL,
  `date_of_joining` date DEFAULT NULL,
  `username` varchar(80) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `profile_img` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`id_user`, `name`, `date_of_birth`, `email`, `date_of_joining`, `username`, `password_hash`, `profile_img`) VALUES
(1, 'Rita', '2003-08-01', 'rita@gmail.com', '2025-11-30', 'rita_collector', '$2y$10$XaUcS/mWRraApLakU5jeMujwb414Go3ieLRSZskEprkYa9OqDZ1d6', 'img/users/user_692c14e402505.jpg'),
(2, 'Raquel', '2003-10-01', 'raquel@gmail.com', '2025-11-30', 'raquel_collector', '$2y$10$Ho1uLdONxa7mLlISoO0YfOW1MXcSZ8RVG/KRZhX67.hZMXUskuzG.', 'img/users/user_692c1523460e9.jpg'),
(3, 'Pedro', '2003-07-01', 'pedro@gmail.com', '2025-11-30', 'pedro_collector', '$2y$10$A/9DfbP9Wygs4KLHfvwdF.XMyKoOe06E7I1J.xGMQm.EgcqIlfUnW', 'img/users/user_692c156438750.jpg'),
(4, 'Joana', '2003-11-01', 'joana@gmail.com', '2025-11-30', 'joana_collector', '$2y$10$s63feH9QGSFemz90d5bmUezkD/ngxERZDKrrq7fQFF0T7eL/7Q6Xa', 'img/users/user_692c15910ddb8.jpg');

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_events_interest`
--

CREATE TABLE `user_events_interest` (
  `id_user` int(11) NOT NULL,
  `id_event` int(11) NOT NULL,
  `liked` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `user_events_went`
--

CREATE TABLE `user_events_went` (
  `id_user` int(11) NOT NULL,
  `id_event` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `wishlists`
--

CREATE TABLE `wishlists` (
  `id_wishlist` int(11) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `collections`
--
ALTER TABLE `collections`
  ADD PRIMARY KEY (`id_collection`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_collection_category` (`id_collection_category`);

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
  ADD PRIMARY KEY (`id_event`,`id_item`),
  ADD KEY `fk_event_items_event` (`id_item`);

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
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

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
  MODIFY `id_collection` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de tabela `collection_categories`
--
ALTER TABLE `collection_categories`
  MODIFY `id_collection_category` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de tabela `collection_event_reviews`
--
ALTER TABLE `collection_event_reviews`
  MODIFY `id_review` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `events`
--
ALTER TABLE `events`
  MODIFY `id_event` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de tabela `items`
--
ALTER TABLE `items`
  MODIFY `id_item` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de tabela `item_categories`
--
ALTER TABLE `item_categories`
  MODIFY `id_item_category` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de tabela `wishlists`
--
ALTER TABLE `wishlists`
  MODIFY `id_wishlist` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `collections`
--
ALTER TABLE `collections`
  ADD CONSTRAINT `collections_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE,
  ADD CONSTRAINT `collections_ibfk_2` FOREIGN KEY (`id_collection_category`) REFERENCES `collection_categories` (`id_collection_category`);

--
-- Limitadores para a tabela `collection_event_reviews`
--
ALTER TABLE `collection_event_reviews`
  ADD CONSTRAINT `collection_event_reviews_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE,
  ADD CONSTRAINT `collection_event_reviews_ibfk_2` FOREIGN KEY (`id_event`) REFERENCES `events` (`id_event`) ON DELETE CASCADE,
  ADD CONSTRAINT `collection_event_reviews_ibfk_3` FOREIGN KEY (`id_collection`) REFERENCES `collections` (`id_collection`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `collection_items`
--
ALTER TABLE `collection_items`
  ADD CONSTRAINT `collection_items_ibfk_1` FOREIGN KEY (`id_collection`) REFERENCES `collections` (`id_collection`) ON DELETE CASCADE,
  ADD CONSTRAINT `collection_items_ibfk_2` FOREIGN KEY (`id_item`) REFERENCES `items` (`id_item`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `event_collections`
--
ALTER TABLE `event_collections`
  ADD CONSTRAINT `event_collections_ibfk_1` FOREIGN KEY (`id_event`) REFERENCES `events` (`id_event`) ON DELETE CASCADE,
  ADD CONSTRAINT `event_collections_ibfk_2` FOREIGN KEY (`id_collection`) REFERENCES `collections` (`id_collection`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `event_items`
--
ALTER TABLE `event_items`
  ADD CONSTRAINT `fk_event_items_event` FOREIGN KEY (`id_item`) REFERENCES `items` (`id_item`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_event_items_item` FOREIGN KEY (`id_item`) REFERENCES `items` (`id_item`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_ibfk_1` FOREIGN KEY (`id_item_category`) REFERENCES `item_categories` (`id_item_category`);

--
-- Limitadores para a tabela `user_events_interest`
--
ALTER TABLE `user_events_interest`
  ADD CONSTRAINT `user_events_interest_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_events_interest_ibfk_2` FOREIGN KEY (`id_event`) REFERENCES `events` (`id_event`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `user_events_went`
--
ALTER TABLE `user_events_went`
  ADD CONSTRAINT `user_events_went_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_events_went_ibfk_2` FOREIGN KEY (`id_event`) REFERENCES `events` (`id_event`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `wishlists`
--
ALTER TABLE `wishlists`
  ADD CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE;

--
-- Limitadores para a tabela `wishlist_items`
--
ALTER TABLE `wishlist_items`
  ADD CONSTRAINT `wishlist_items_ibfk_1` FOREIGN KEY (`id_wishlist`) REFERENCES `wishlists` (`id_wishlist`) ON DELETE CASCADE,
  ADD CONSTRAINT `wishlist_items_ibfk_2` FOREIGN KEY (`id_item`) REFERENCES `items` (`id_item`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
