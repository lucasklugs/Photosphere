-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 27, 2025 at 11:03 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `photosphere`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admcodigo` int(11) NOT NULL,
  `admemail` char(50) NOT NULL,
  `admsenha` char(15) NOT NULL,
  `admnome` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admcodigo`, `admemail`, `admsenha`, `admnome`) VALUES
(1, 'matheus@gmail.com', '123', 'Matheus'),
(2, 'kaua@gmail.com', '123', 'Kau?'),
(3, 'lucas@gmail.com', '123', 'Lucas');

-- --------------------------------------------------------

--
-- Table structure for table `album_fotos`
--

CREATE TABLE `album_fotos` (
  `id` int(11) NOT NULL,
  `album_id` int(11) NOT NULL,
  `foto_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `album_fotos`
--

INSERT INTO `album_fotos` (`id`, `album_id`, `foto_id`) VALUES
(1, 1, 1),
(2, 1, 1),
(3, 2, 1),
(4, 2, 1),
(5, 2, 1),
(6, 3, 1),
(7, 3, 27);

-- --------------------------------------------------------

--
-- Table structure for table `albuns`
--

CREATE TABLE `albuns` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `albuns`
--

INSERT INTO `albuns` (`id`, `usuario_id`, `nome`, `data_criacao`) VALUES
(1, 26, '123', '2025-06-27 20:57:53'),
(2, 26, '424242', '2025-06-27 20:58:06'),
(3, 26, 'Teste', '2025-06-27 21:01:21');

-- --------------------------------------------------------

--
-- Table structure for table `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categorias`
--

INSERT INTO `categorias` (`id`, `nome`) VALUES
(13, 'Cinema'),
(6, 'Comida'),
(5, 'Moda');

-- --------------------------------------------------------

--
-- Table structure for table `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `foto_id` int(11) NOT NULL,
  `texto` text NOT NULL,
  `data_comentario` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comentarios`
--

INSERT INTO `comentarios` (`id`, `usuario_id`, `foto_id`, `texto`, `data_comentario`) VALUES
(1, 1, 4, 'arara linda', '2025-06-11 20:35:47'),
(3, 1, 1, 'gatinho bonito', '2025-06-12 22:56:27'),
(5, 1, 12, 'lobo bonito', '2025-06-26 20:24:31');

-- --------------------------------------------------------

--
-- Table structure for table `curtidas`
--

CREATE TABLE `curtidas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `foto_id` int(11) NOT NULL,
  `data_curtida` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `curtidas`
--

INSERT INTO `curtidas` (`id`, `usuario_id`, `foto_id`, `data_curtida`) VALUES
(94, 1, 1, '2025-06-16 01:12:05'),
(95, 1, 3, '2025-06-16 01:12:06'),
(96, 1, 6, '2025-06-16 01:12:07'),
(98, 1, 7, '2025-06-16 01:12:09'),
(99, 1, 4, '2025-06-16 01:12:09'),
(100, 1, 5, '2025-06-20 18:54:52'),
(111, 5, 19, '2025-06-22 17:27:46'),
(112, 5, 18, '2025-06-22 17:27:47'),
(116, 26, 27, '2025-06-27 20:32:20');

-- --------------------------------------------------------

--
-- Table structure for table `fotos`
--

CREATE TABLE `fotos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `url` varchar(255) NOT NULL,
  `data_upload` timestamp NOT NULL DEFAULT current_timestamp(),
  `origem` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fotos`
--

INSERT INTO `fotos` (`id`, `usuario_id`, `titulo`, `descricao`, `url`, `data_upload`, `origem`) VALUES
(1, 1, 'Gato fofo', 'Um gato olhando curioso para a c?mera', '/images/gato.jpg', '2025-06-11 00:08:13', NULL),
(3, 1, 'Hamb?rguer gourmet', 'Com cheddar e bacon artesanal', '/images/hamburguer.jpg', '2025-06-11 00:08:13', NULL),
(4, 1, 'Arara Azul', 'Arara azul em galho de ?rvore tropical.', '/images/arara.jpg', '2025-06-11 00:11:57', NULL),
(5, 1, 'Tucano Colorido', 'Tucano com bico amarelo vibrante.', '/images/tucano.jpg', '2025-06-11 00:11:57', NULL),
(6, 1, 'Bal?o ao Amanhecer', 'Bal?o voando sobre colinas ao amanhecer.', '/images/balao.jpg', '2025-06-11 00:12:18', NULL),
(7, 1, 'Folha com Gotas', 'Folha verde com gotas de orvalho.', '/images/folha.jpg', '2025-06-11 00:12:18', NULL),
(8, 1, 'Lagarto Verde', 'Lagarto em uma rocha observando o ambiente.', '/images/lagarto.jpg', '2025-06-11 00:12:18', NULL),
(9, 1, 'Flor Amarela', 'Flor amarela sob a luz do sol.', '/images/flor.jpg', '2025-06-11 00:12:18', NULL),
(10, 1, 'Rio Tranquilo', 'Rio calmo entre ?rvores e pedras.', '/images/rio.jpg', '2025-06-11 00:12:18', NULL),
(11, 1, 'C?u Azul', 'C?u limpo com poucas nuvens brancas.', '/images/ceu.jpg', '2025-06-11 00:30:45', NULL),
(12, 1, 'Lobo na Neve', 'Lobo solit?rio observando ao longe.', '/images/lobo.jpg', '2025-06-11 00:30:45', NULL),
(13, 1, 'Bob Bonitinho', 'Um cachorro chamado Bob com olhar fofo.', '/images/bob_bonitinho.jpg', '2025-06-11 00:30:45', NULL),
(14, 1, 'Bob Descansando', 'Bob deitado em um gramado ao sol.', '/images/bob.jpg', '2025-06-11 00:30:45', NULL),
(15, 1, 'Sol Brilhando', 'Sol forte iluminando o c?u.', '/images/sol.jpg', '2025-06-11 00:30:45', NULL),
(16, 1, 'Girassol', 'Um girassol aberto acompanhando o sol.', '/images/girassol.jpg', '2025-06-11 00:30:45', NULL),
(17, 1, 'Teclado', 'Teclado de computador com ilumina??o RGB.', '/images/teclado.jpg', '2025-06-11 00:30:45', NULL),
(18, 1, 'Cachoeira', 'Queda d\'agua entre rochas e vegetacao.', '/images/cachoeira.jpg', '2025-06-11 00:35:29', NULL),
(19, 1, 'Paisagem Natural', 'Vista de campo, montanhas e ceu azul.', '/images/paisagem.jpg', '2025-06-11 00:35:29', NULL),
(26, 1, 'Hamburguer', NULL, '/uploads/1750969774670.jpg', '2025-06-26 20:29:34', 'upload'),
(27, 26, 'Cachorro', NULL, '/uploads/1751056269665.png', '2025-06-27 20:31:09', 'upload');

-- --------------------------------------------------------

--
-- Table structure for table `fotos_categorias`
--

CREATE TABLE `fotos_categorias` (
  `id` int(11) NOT NULL,
  `foto_id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `fotos_categorias`
--

INSERT INTO `fotos_categorias` (`id`, `foto_id`, `categoria_id`) VALUES
(4, 26, 6),
(5, 27, 13);

-- --------------------------------------------------------

--
-- Table structure for table `seguidores`
--

CREATE TABLE `seguidores` (
  `id` int(11) NOT NULL,
  `seguidor_id` int(11) NOT NULL,
  `seguido_id` int(11) NOT NULL,
  `data_seguimento` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `foto_cover` varchar(255) DEFAULT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha_hash`, `foto_perfil`, `foto_cover`, `data_criacao`) VALUES
(1, 'Matheus Ferreira Fagundes', 'matheusferreirafagundes23@gmail.com', '$2b$10$HLsymifG6VOdESiQdBokhOYeXenJkMVvbbPJHKsxhhuDWI2PVc1je', '/uploads/1750036270392.jpg', '/uploads/1750036395759.png', '2025-05-25 23:16:39'),
(4, 'Lucas', 'lucas@gmail.com', '$2b$10$05m.LlMLGugsZ2WlY6XGj.sX.4AxjbiYZSpCIKQPCzMc9.az8q6Cy', NULL, NULL, '2025-05-31 00:40:43'),
(5, 'Maria', 'maria@uol.com.br', '$2b$10$hX2TS2Dp1fSRbbHaldyh7.dGrwksGz/7OGEHfbPK.gjKQaYSJwGU2', NULL, NULL, '2025-05-31 03:11:54'),
(20, 'Jamal', 'jamal@gmail.com', '$2b$10$dSrAslEHW1ZZ5IX.E9sG7eXsE.xVjyLpgFBlQhamfbCS8RyZx293O', NULL, NULL, '2025-06-22 17:45:49'),
(23, 'Fernanda', 'fernanda@gmail.com', '$2b$10$2a2.S9ssLJfWT5ghRDahgOAxD00pWedefdM4tneP49D2WXxq9Ez3S', NULL, NULL, '2025-06-22 18:12:20'),
(24, 'Amanda Oliveira', 'amanda.oliveira@uoul.com.br', '$2b$10$BjS8GmwPAjTWoTt/Wiu0LuCzvFWxwYhwWw.8JAqXwhl58oEiG8XSS', NULL, NULL, '2025-06-22 18:12:46'),
(25, 'Danilo Soares', 'danilo@gmail.com', '$2b$10$PbjisraGVaRkJM4Hnk41AOyAOiAzJWmv64ZgchSfXYbxu/BZRMQFO', NULL, NULL, '2025-06-22 18:13:12'),
(26, 'adm', 'admin@gmail.com', '$2b$10$P9a.wEKiFYh6djAfBWU.g.Dcw29BwyVoK1uxYXjEA6NIsYqF99TKK', '/uploads/1751056248509.png', '/uploads/1751056243745.png', '2025-06-27 20:30:30');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admcodigo`);

--
-- Indexes for table `album_fotos`
--
ALTER TABLE `album_fotos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `album_id` (`album_id`),
  ADD KEY `foto_id` (`foto_id`);

--
-- Indexes for table `albuns`
--
ALTER TABLE `albuns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indexes for table `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nome` (`nome`);

--
-- Indexes for table `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `foto_id` (`foto_id`);

--
-- Indexes for table `curtidas`
--
ALTER TABLE `curtidas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario_id` (`usuario_id`,`foto_id`),
  ADD KEY `foto_id` (`foto_id`);

--
-- Indexes for table `fotos`
--
ALTER TABLE `fotos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indexes for table `fotos_categorias`
--
ALTER TABLE `fotos_categorias`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `foto_id` (`foto_id`,`categoria_id`),
  ADD KEY `categoria_id` (`categoria_id`);

--
-- Indexes for table `seguidores`
--
ALTER TABLE `seguidores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `seguidor_id` (`seguidor_id`,`seguido_id`),
  ADD KEY `seguido_id` (`seguido_id`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `admcodigo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `album_fotos`
--
ALTER TABLE `album_fotos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `albuns`
--
ALTER TABLE `albuns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `curtidas`
--
ALTER TABLE `curtidas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `fotos`
--
ALTER TABLE `fotos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `fotos_categorias`
--
ALTER TABLE `fotos_categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `seguidores`
--
ALTER TABLE `seguidores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `album_fotos`
--
ALTER TABLE `album_fotos`
  ADD CONSTRAINT `album_fotos_ibfk_1` FOREIGN KEY (`album_id`) REFERENCES `albuns` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `album_fotos_ibfk_2` FOREIGN KEY (`foto_id`) REFERENCES `fotos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `albuns`
--
ALTER TABLE `albuns`
  ADD CONSTRAINT `albuns_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`foto_id`) REFERENCES `fotos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `curtidas`
--
ALTER TABLE `curtidas`
  ADD CONSTRAINT `curtidas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `curtidas_ibfk_2` FOREIGN KEY (`foto_id`) REFERENCES `fotos` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `fotos`
--
ALTER TABLE `fotos`
  ADD CONSTRAINT `fotos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `fotos_categorias`
--
ALTER TABLE `fotos_categorias`
  ADD CONSTRAINT `fotos_categorias_ibfk_1` FOREIGN KEY (`foto_id`) REFERENCES `fotos` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fotos_categorias_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `seguidores`
--
ALTER TABLE `seguidores`
  ADD CONSTRAINT `seguidores_ibfk_1` FOREIGN KEY (`seguidor_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `seguidores_ibfk_2` FOREIGN KEY (`seguido_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;