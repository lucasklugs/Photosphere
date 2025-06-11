-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: photosphere
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `admin` (
  `admcodigo` int(11) NOT NULL AUTO_INCREMENT,
  `admemail` char(50) NOT NULL,
  `admsenha` char(15) NOT NULL,
  `admnome` char(20) DEFAULT NULL,
  PRIMARY KEY (`admcodigo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'matheus@gmail.com','123','Matheus'),(2,'kaua@gmail.com','123','Kau?'),(3,'lucas@gmail.com','123','Lucas');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categorias`
--

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nome` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Comida'),(6,'Esportes'),(5,'Moda');
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comentarios`
--

DROP TABLE IF EXISTS `comentarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `foto_id` int(11) NOT NULL,
  `texto` text NOT NULL,
  `data_comentario` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `foto_id` (`foto_id`),
  CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comentarios_ibfk_2` FOREIGN KEY (`foto_id`) REFERENCES `fotos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comentarios`
--

LOCK TABLES `comentarios` WRITE;
/*!40000 ALTER TABLE `comentarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `comentarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `curtidas`
--

DROP TABLE IF EXISTS `curtidas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `curtidas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `foto_id` int(11) NOT NULL,
  `data_curtida` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`,`foto_id`),
  KEY `foto_id` (`foto_id`),
  CONSTRAINT `curtidas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `curtidas_ibfk_2` FOREIGN KEY (`foto_id`) REFERENCES `fotos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `curtidas`
--

LOCK TABLES `curtidas` WRITE;
/*!40000 ALTER TABLE `curtidas` DISABLE KEYS */;
INSERT INTO `curtidas` VALUES (22,13,14,'2025-06-11 00:32:28'),(24,13,5,'2025-06-11 00:32:44'),(25,13,6,'2025-06-11 00:32:45'),(26,13,7,'2025-06-11 00:32:45'),(27,13,4,'2025-06-11 00:32:46'),(28,13,3,'2025-06-11 00:32:47'),(29,13,9,'2025-06-11 00:32:48'),(30,13,8,'2025-06-11 00:32:49'),(31,13,10,'2025-06-11 00:32:50'),(33,13,12,'2025-06-11 00:32:54'),(34,13,15,'2025-06-11 00:32:55'),(35,13,16,'2025-06-11 00:32:56'),(36,13,13,'2025-06-11 00:32:56'),(37,13,11,'2025-06-11 00:32:57'),(38,13,17,'2025-06-11 00:32:59'),(39,13,18,'2025-06-11 00:35:52'),(40,13,19,'2025-06-11 00:35:53'),(43,13,1,'2025-06-11 00:39:28');
/*!40000 ALTER TABLE `curtidas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fotos`
--

DROP TABLE IF EXISTS `fotos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fotos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `titulo` varchar(255) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `url` varchar(255) NOT NULL,
  `data_upload` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `fotos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fotos`
--

LOCK TABLES `fotos` WRITE;
/*!40000 ALTER TABLE `fotos` DISABLE KEYS */;
INSERT INTO `fotos` VALUES (1,1,'Gato fofo','Um gato olhando curioso para a c?mera','/images/gato.jpg','2025-06-11 00:08:13'),(3,1,'Hamb?rguer gourmet','Com cheddar e bacon artesanal','/images/hamburguer.jpg','2025-06-11 00:08:13'),(4,1,'Arara Azul','Arara azul em galho de ?rvore tropical.','/images/arara.jpg','2025-06-11 00:11:57'),(5,1,'Tucano Colorido','Tucano com bico amarelo vibrante.','/images/tucano.jpg','2025-06-11 00:11:57'),(6,1,'Bal?o ao Amanhecer','Bal?o voando sobre colinas ao amanhecer.','/images/balao.jpg','2025-06-11 00:12:18'),(7,1,'Folha com Gotas','Folha verde com gotas de orvalho.','/images/folha.jpg','2025-06-11 00:12:18'),(8,1,'Lagarto Verde','Lagarto em uma rocha observando o ambiente.','/images/lagarto.jpg','2025-06-11 00:12:18'),(9,1,'Flor Amarela','Flor amarela sob a luz do sol.','/images/flor.jpg','2025-06-11 00:12:18'),(10,1,'Rio Tranquilo','Rio calmo entre ?rvores e pedras.','/images/rio.jpg','2025-06-11 00:12:18'),(11,1,'C?u Azul','C?u limpo com poucas nuvens brancas.','/images/ceu.jpg','2025-06-11 00:30:45'),(12,1,'Lobo na Neve','Lobo solit?rio observando ao longe.','/images/lobo.jpg','2025-06-11 00:30:45'),(13,1,'Bob Bonitinho','Um cachorro chamado Bob com olhar fofo.','/images/bob_bonitinho.jpg','2025-06-11 00:30:45'),(14,1,'Bob Descansando','Bob deitado em um gramado ao sol.','/images/bob.jpg','2025-06-11 00:30:45'),(15,1,'Sol Brilhando','Sol forte iluminando o c?u.','/images/sol.jpg','2025-06-11 00:30:45'),(16,1,'Girassol','Um girassol aberto acompanhando o sol.','/images/girassol.jpg','2025-06-11 00:30:45'),(17,1,'Teclado','Teclado de computador com ilumina??o RGB.','/images/teclado.jpg','2025-06-11 00:30:45'),(18,1,'Cachoeira','Queda d\'agua entre rochas e vegetacao.','/images/cachoeira.jpg','2025-06-11 00:35:29'),(19,1,'Paisagem Natural','Vista de campo, montanhas e ceu azul.','/images/paisagem.jpg','2025-06-11 00:35:29');
/*!40000 ALTER TABLE `fotos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fotos_categorias`
--

DROP TABLE IF EXISTS `fotos_categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `fotos_categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `foto_id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `foto_id` (`foto_id`,`categoria_id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `fotos_categorias_ibfk_1` FOREIGN KEY (`foto_id`) REFERENCES `fotos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fotos_categorias_ibfk_2` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fotos_categorias`
--

LOCK TABLES `fotos_categorias` WRITE;
/*!40000 ALTER TABLE `fotos_categorias` DISABLE KEYS */;
/*!40000 ALTER TABLE `fotos_categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seguidores`
--

DROP TABLE IF EXISTS `seguidores`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `seguidores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `seguidor_id` int(11) NOT NULL,
  `seguido_id` int(11) NOT NULL,
  `data_seguimento` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `seguidor_id` (`seguidor_id`,`seguido_id`),
  KEY `seguido_id` (`seguido_id`),
  CONSTRAINT `seguidores_ibfk_1` FOREIGN KEY (`seguidor_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `seguidores_ibfk_2` FOREIGN KEY (`seguido_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seguidores`
--

LOCK TABLES `seguidores` WRITE;
/*!40000 ALTER TABLE `seguidores` DISABLE KEYS */;
/*!40000 ALTER TABLE `seguidores` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `foto_perfil` varchar(255) DEFAULT NULL,
  `foto_cover` varchar(255) DEFAULT NULL,
  `data_criacao` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Matheus Ferreira Fagundes','matheusferreirafagundes23@gmail.com','$2b$10$Kpk/XqL2f8/nQuz076amAezgxxdZNei1KxUWynyyJF6G6UfB7A4mS',NULL,NULL,'2025-05-25 23:16:39'),(4,'Lucas','lucas@gmail.com','$2b$10$05m.LlMLGugsZ2WlY6XGj.sX.4AxjbiYZSpCIKQPCzMc9.az8q6Cy',NULL,NULL,'2025-05-31 00:40:43'),(5,'Maria','maria@uol.com.br','$2b$10$hX2TS2Dp1fSRbbHaldyh7.dGrwksGz/7OGEHfbPK.gjKQaYSJwGU2',NULL,NULL,'2025-05-31 03:11:54'),(6,'Vitor','vitor@hotmail.com','$2b$10$xrbF6rozwHc7gTrn/lGeyu2aq5QS/N23O7lvwilT3KYStrHPBGE8W',NULL,NULL,'2025-05-31 03:12:08'),(7,'Jamal','jamal@gmail.com','$2b$10$yfun4wdCctsrewN2VVBW7ubVyYz7aAWA3tlU0uah3LAzCBpLTkWvu',NULL,NULL,'2025-05-31 03:12:24'),(12,'Batatal','batatal@gmail.com','$2b$10$Op1tCSV4Kz/uokHuGFxRmeAv5MOqG.iv34PgBWXZ7/MKaeBm2ClZe',NULL,NULL,'2025-06-06 00:10:02'),(13,'Junior','junior@gmail.com','$2b$10$fuGZB8vqoSPVIzS4ejTvZOstQ6rCxpmU9q1Zr40hYS1DiseQGTSEu',NULL,NULL,'2025-06-11 00:12:44');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-10 21:43:17
