-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: mysql-7d87a12-ulab-1405.g.aivencloud.com    Database: defaultdb
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'e290d5f3-37fa-11f1-9c90-5a254e597dd2:1-372';

--
-- Table structure for table `application_status_history`
--

DROP TABLE IF EXISTS `application_status_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `application_status_history` (
  `history_id` int NOT NULL AUTO_INCREMENT,
  `app_id` int NOT NULL,
  `old_status` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `new_status` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `changed_by` int NOT NULL,
  `remarks` text COLLATE utf8mb4_unicode_ci,
  `changed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`history_id`),
  KEY `changed_by` (`changed_by`),
  KEY `idx_app` (`app_id`),
  KEY `idx_changed_at` (`changed_at`),
  CONSTRAINT `application_status_history_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `applications` (`app_id`) ON DELETE CASCADE,
  CONSTRAINT `application_status_history_ibfk_2` FOREIGN KEY (`changed_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application_status_history`
--

LOCK TABLES `application_status_history` WRITE;
/*!40000 ALTER TABLE `application_status_history` DISABLE KEYS */;
INSERT INTO `application_status_history` VALUES (1,1,NULL,'pending',1,'আবেদন জমা দেওয়া হয়েছে','2026-04-02 17:49:49'),(2,1,'pending','processing',4,'নথিপত্র যাচাই শুরু হয়েছে','2026-04-02 17:49:49'),(3,1,'processing','verified',4,'সকল তথ্য সঠিক পাওয়া গেছে','2026-04-02 17:49:49'),(4,1,'verified','approved',4,'অনুমোদন দেওয়া হয়েছে','2026-04-02 17:49:49'),(5,1,'approved','completed',4,'সনদ প্রস্তুত ও প্রদান করা হয়েছে','2026-04-02 17:49:49'),(6,2,NULL,'pending',2,'আবেদন জমা দেওয়া হয়েছে','2026-04-02 17:49:49'),(7,2,'pending','processing',5,'নথিপত্র যাচাই শুরু হয়েছে','2026-04-02 17:49:49'),(8,2,'processing','approved',5,'অনুমোদন দেওয়া হয়েছে','2026-04-02 17:49:49'),(9,3,NULL,'pending',1,'আবেদন জমা দেওয়া হয়েছে','2026-04-02 17:49:49'),(10,3,'pending','processing',4,'নথিপত্র যাচাই শুরু হয়েছে','2026-04-02 17:49:49'),(11,4,NULL,'pending',3,'আবেদন জমা দেওয়া হয়েছে','2026-04-02 17:49:49'),(12,5,NULL,'pending',2,'আবেদন জমা দেওয়া হয়েছে','2026-04-02 17:49:49'),(13,5,'pending','processing',5,'নথিপত্র যাচাই শুরু হয়েছে','2026-04-02 17:49:49'),(14,5,'processing','rejected',5,'NID তথ্য যাচাই ব্যর্থ হয়েছে','2026-04-02 17:49:49'),(15,16,'pending','processing',4,NULL,'2026-04-11 06:36:38'),(16,16,'processing','processing',4,NULL,'2026-04-11 06:36:50'),(17,19,'pending','processing',4,NULL,'2026-04-13 04:52:30'),(18,19,'processing','processing',4,NULL,'2026-04-13 04:52:32'),(19,18,'pending','rejected',4,'You did not submit proper document.','2026-04-13 05:32:44'),(20,19,'processing','processing',4,NULL,'2026-04-14 15:49:45');
/*!40000 ALTER TABLE `application_status_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `applications`
--

DROP TABLE IF EXISTS `applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `applications` (
  `app_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `tracking_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `child_name_bn` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `child_name_en` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `birth_date` date DEFAULT NULL,
  `birth_place` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` enum('male','female','other') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_name_bn` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_name_en` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `father_nationality` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_name_bn` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_name_en` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mother_nationality` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `permanent_address` text COLLATE utf8mb4_unicode_ci,
  `status` enum('pending','processing','verified','approved','rejected','completed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `fee_amount` decimal(10,2) DEFAULT NULL,
  `assigned_officer_id` int DEFAULT NULL,
  `rejection_reason` text COLLATE utf8mb4_unicode_ci,
  `submitted_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `approved_at` timestamp NULL DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `service_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'birth_certificate',
  PRIMARY KEY (`app_id`),
  UNIQUE KEY `tracking_id` (`tracking_id`),
  KEY `assigned_officer_id` (`assigned_officer_id`),
  KEY `idx_tracking` (`tracking_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_birth_date` (`birth_date`),
  CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`assigned_officer_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `applications`
--

LOCK TABLES `applications` WRITE;
/*!40000 ALTER TABLE `applications` DISABLE KEYS */;
INSERT INTO `applications` VALUES (1,1,'TRK-2024-000001','আরিয়ান রহিম','Ariyan Rahim','2023-05-10','Dhaka Medical College Hospital','male','রহিম উদ্দিন','Rahim Uddin',NULL,'সালমা বেগম','Salma Begum',NULL,'বাড়ি-৫, রোড-৩, মিরপুর-১০, ঢাকা','completed',50.00,4,NULL,'2026-04-02 17:49:49','2024-02-15 04:30:00','2024-02-20 08:00:00','2026-04-02 17:49:49','birth_certificate'),(2,2,'TRK-2024-000002','তাসনিম ফাতেমা','Tasnim Fatema','2023-11-22','Ibn Sina Hospital, Dhaka','female','করিম শেখ','Karim Sheikh',NULL,'ফাতেমা বেগম','Fatema Begum',NULL,'বাড়ি-১২, সেক্টর-৭, উত্তরা, ঢাকা','approved',50.00,5,NULL,'2026-04-02 17:49:49','2024-03-10 03:00:00',NULL,'2026-04-02 17:49:49','birth_certificate'),(3,1,'TRK-2024-000003','রায়হান রহিম','Rayhan Rahim','2024-01-05','Popular Hospital, Dhaka','male','রহিম উদ্দিন','Rahim Uddin',NULL,'সালমা বেগম','Salma Begum',NULL,'বাড়ি-৫, রোড-৩, মিরপুর-১০, ঢাকা','processing',50.00,4,NULL,'2026-04-02 17:49:49',NULL,NULL,'2026-04-02 17:49:49','birth_certificate'),(4,3,'TRK-2024-000004','নাফিসা করিম','Nafisa Karim','2024-02-14','Chittagong Medical College Hospital','female','করিম হোসেন','Karim Hossain',NULL,'রুমানা আক্তার','Rumana Akter',NULL,'পাহাড়তলী, চট্টগ্রাম','pending',50.00,NULL,NULL,'2026-04-02 17:49:49',NULL,NULL,'2026-04-02 17:49:49','birth_certificate'),(5,2,'TRK-2024-000005','ইমরান শেখ','Imran Sheikh','2023-08-30','Dhaka Medical College Hospital','male','করিম শেখ','Karim Sheikh',NULL,'ফাতেমা বেগম','Fatema Begum',NULL,'বাড়ি-১২, সেক্টর-৭, উত্তরা, ঢাকা','rejected',50.00,5,'NID তথ্য সঠিক নয়। পিতার NID নম্বর যাচাই করা যায়নি।','2026-04-02 17:49:49',NULL,NULL,'2026-04-02 17:49:49','birth_certificate'),(15,10,'SCST-2026-23677','উম্মে সালমা','Umme salma','2026-03-30','Jamalpur, Noakhali','female','Khair',NULL,NULL,'Parvin akter',NULL,NULL,'Jamalpur,Noakhali','pending',100.00,NULL,NULL,'2026-04-05 19:17:44',NULL,NULL,'2026-04-05 19:17:44','birth_certificate'),(16,10,'SCST-2026-91889','উম্মে সালমা','Umme salma','2026-03-31','Jamalpur, Noakhali','female','খায়ের','Khair','Bangladesh','পারভিন আক্তার','Parvin akter','Bangladesh','Jamalpur,Noakhali','processing',100.00,NULL,NULL,'2026-04-11 06:34:25',NULL,NULL,'2026-04-11 06:36:50','birth_certificate'),(17,10,'SCST-2026-27501','পারভিন আক্তার','Parvin Akter','2026-03-30','Binodhpur, Moakhali','female','আবুল কাশেম','Abul kashem','Bangladesh','সকিনা খাতুন','Sakina Khatun','Bangladesh','Binodhpur,Noakhali','pending',100.00,NULL,NULL,'2026-04-11 10:49:26',NULL,NULL,'2026-04-11 10:49:26','birth_certificate'),(18,10,'SCST-2026-34643','আখি','Akhi','2026-03-29','Binodhpur, Noakhali','female','রিপন মিয়া','Ripon Mia','Bangladeshi','আয়েশা খাতুন','Ayesha Khatun','Bangladeshi','Jamalpur,Noakhali','rejected',100.00,NULL,'You did not submit proper document.','2026-04-12 14:52:48',NULL,NULL,'2026-04-13 05:32:44','birth_certificate'),(19,10,'SCST-2026-59829','আখি','Akhi','2026-03-23','Bashabo, Dhaka','female','রিপন মিয়া',NULL,NULL,'আয়েশা খাতুন',NULL,NULL,'bashabo Dhaka','processing',100.00,NULL,NULL,'2026-04-12 15:02:55',NULL,NULL,'2026-04-14 15:49:44','birth_certificate'),(20,10,'SCST-2026-77775','উম্মে','Umme','2026-02-18','nodipara, rongpur','female','রায়হান','Rayhan',NULL,'ফাতেমা','Fatema',NULL,'nodipara,rongpur','pending',100.00,NULL,NULL,'2026-04-14 05:44:08',NULL,NULL,'2026-04-14 05:44:08','birth_certificate'),(21,10,'SCST-2026-68178','ইমন',NULL,'2026-03-29','Purandhaka, Dhaka','male','শুভ্র','Shuvro',NULL,'আঁখি','Akhi',NULL,'PuranDhaka,Dhaka','pending',100.00,NULL,NULL,'2026-04-14 06:07:09',NULL,NULL,'2026-04-14 06:07:09','birth_certificate'),(22,10,'SCST-2026-82512','সেলিনা আক্তার','Selina akter','2026-03-30','noakhali,gabua, noakhali','female','আবুল কাশেম','Abul kashem',NULL,'সকিনা খাতুন','Sakina Akter',NULL,'gabua,noakhali','pending',100.00,NULL,NULL,'2026-04-16 02:50:59',NULL,NULL,'2026-04-16 02:50:59','birth_certificate'),(23,18,'SCST-2026-54324','মুন্তাকিম রাফি','Muntakim Rafi','2026-04-03','hazaribbag, dhaka','male','আব্দুল জাব্বার','Abdul jabbar','Bangladeshi','রোকেয়া বেগম','Rokeya Begum','Bangladeshi','hazaribagh','pending',100.00,NULL,NULL,'2026-04-16 04:54:54',NULL,NULL,'2026-04-16 04:54:54','birth_certificate'),(24,23,'SCST-2026-51194','saheduzzaman nour','saheduzzaman nur','2001-07-30','dhaka, dhaka','male','fathers name','fathers name','bd','mothers name','mothers name','bd','dhaka','pending',100.00,NULL,NULL,'2026-04-16 14:03:34',NULL,NULL,'2026-04-16 14:03:34','birth_certificate'),(25,29,'SCST-2026-33970','dahsd','dad','2026-04-02','dasda, dasda','male','adad','adad','adad','dada','adad','adad','dadas','pending',100.00,NULL,NULL,'2026-04-19 03:30:58',NULL,NULL,'2026-04-19 03:30:58','birth_certificate');
/*!40000 ALTER TABLE `applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_logs` (
  `log_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `action` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `target_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_id` int DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  `details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`log_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_created` (`created_at`),
  CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL,
  CONSTRAINT `audit_logs_chk_1` CHECK (json_valid(`details`))
) ENGINE=InnoDB AUTO_INCREMENT=315 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,1,'LOGIN','user',1,'103.100.200.50',NULL,'{\"method\": \"mobile_otp\"}','2026-04-02 17:49:49'),(2,1,'APPLICATION_SUBMIT','application',1,'103.100.200.50',NULL,'{\"tracking_id\": \"TRK-2024-000001\"}','2026-04-02 17:49:49'),(3,1,'PAYMENT_SUCCESS','payment',1,'103.100.200.50',NULL,'{\"transaction_id\": \"BKASH-20240201-001\", \"amount\": 50}','2026-04-02 17:49:49'),(4,4,'LOGIN','user',4,'10.0.0.5',NULL,'{\"method\": \"password\"}','2026-04-02 17:49:49'),(5,4,'STATUS_CHANGE','application',1,'10.0.0.5',NULL,'{\"old_status\": \"pending\", \"new_status\": \"processing\"}','2026-04-02 17:49:49'),(6,4,'STATUS_CHANGE','application',1,'10.0.0.5',NULL,'{\"old_status\": \"processing\", \"new_status\": \"approved\"}','2026-04-02 17:49:49'),(7,5,'STATUS_CHANGE','application',5,'10.0.0.8',NULL,'{\"old_status\": \"processing\", \"new_status\": \"rejected\"}','2026-04-02 17:49:49'),(8,6,'LOGIN','user',6,'192.168.1.1',NULL,'{\"method\": \"password\"}','2026-04-02 17:49:49'),(9,6,'USER_VERIFIED','user',3,'192.168.1.1',NULL,'{\"action\": \"manual_verify\"}','2026-04-02 17:49:49'),(10,NULL,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"role\":\"citizen\",\"timestamp\":\"2026-04-02T17:51:34.478Z\"}','2026-04-02 17:51:34'),(11,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"salmapromi12345@gmail.com\",\"timestamp\":\"2026-04-02T17:51:37.108Z\"}','2026-04-02 17:51:37'),(12,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"salmapromi12345@gmail.com\",\"timestamp\":\"2026-04-02T17:51:37.249Z\"}','2026-04-02 17:51:37'),(13,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"salmapromi12345@gmail.com\",\"timestamp\":\"2026-04-02T17:51:37.536Z\"}','2026-04-02 17:51:37'),(14,NULL,'otp_verified',NULL,NULL,NULL,NULL,'{\"timestamp\":\"2026-04-02T17:51:59.597Z\"}','2026-04-02 17:51:59'),(15,NULL,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-02T17:52:07.953Z\"}','2026-04-02 17:52:07'),(16,NULL,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"role\":\"citizen\",\"timestamp\":\"2026-04-03T06:03:40.932Z\"}','2026-04-03 06:03:40'),(17,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01710807454\",\"timestamp\":\"2026-04-03T06:03:58.843Z\"}','2026-04-03 06:03:58'),(18,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01710807454\",\"timestamp\":\"2026-04-03T06:03:58.955Z\"}','2026-04-03 06:03:58'),(19,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01710807454\",\"timestamp\":\"2026-04-03T06:03:58.970Z\"}','2026-04-03 06:03:58'),(20,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01710807454\",\"timestamp\":\"2026-04-03T06:25:19.231Z\"}','2026-04-03 06:25:19'),(21,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01710807454\",\"timestamp\":\"2026-04-03T06:25:19.637Z\"}','2026-04-03 06:25:19'),(22,NULL,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"role\":\"citizen\",\"timestamp\":\"2026-04-03T06:27:06.043Z\"}','2026-04-03 06:27:06'),(23,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01939838241\",\"timestamp\":\"2026-04-03T06:27:19.451Z\"}','2026-04-03 06:27:19'),(24,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01939838241\",\"timestamp\":\"2026-04-03T06:27:19.759Z\"}','2026-04-03 06:27:19'),(25,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01939838241\",\"timestamp\":\"2026-04-03T06:27:19.886Z\"}','2026-04-03 06:27:19'),(26,10,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"role\":\"citizen\",\"timestamp\":\"2026-04-03T06:36:52.068Z\"}','2026-04-03 06:36:52'),(27,10,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01939838241\",\"timestamp\":\"2026-04-03T06:37:01.766Z\"}','2026-04-03 06:37:01'),(28,10,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01939838241\",\"timestamp\":\"2026-04-03T06:37:02.249Z\"}','2026-04-03 06:37:02'),(29,10,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01939838241\",\"timestamp\":\"2026-04-03T06:37:02.756Z\"}','2026-04-03 06:37:02'),(30,10,'otp_verified',NULL,NULL,NULL,NULL,'{\"timestamp\":\"2026-04-03T06:37:47.363Z\"}','2026-04-03 06:37:47'),(31,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-03T06:37:57.360Z\"}','2026-04-03 06:37:57'),(32,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-03T07:39:44.018Z\"}','2026-04-03 07:39:44'),(33,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-03T07:50:47.305Z\"}','2026-04-03 07:50:47'),(34,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-03T07:53:51.458Z\"}','2026-04-03 07:53:51'),(35,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-03T16:26:51.338Z\"}','2026-04-03 16:26:51'),(36,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-03T16:35:00.219Z\"}','2026-04-03 16:35:00'),(37,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-03T16:44:09.820Z\"}','2026-04-03 16:44:09'),(38,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-03T16:47:01.361Z\"}','2026-04-03 16:47:01'),(39,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-03T16:51:28.909Z\"}','2026-04-03 16:51:28'),(40,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-03T17:24:45.659Z\"}','2026-04-03 17:24:45'),(41,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-03T17:51:56.068Z\"}','2026-04-03 17:51:56'),(42,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-04T05:01:48.387Z\"}','2026-04-04 05:01:48'),(43,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-04T05:10:20.350Z\"}','2026-04-04 05:10:20'),(44,10,'application_create','application',6,NULL,NULL,'{\"tracking_id\":\"SCST-2026-32016\",\"timestamp\":\"2026-04-04T16:51:20.704Z\"}','2026-04-04 16:51:20'),(45,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-04T17:00:54.758Z\"}','2026-04-04 17:00:54'),(46,10,'application_create','application',7,NULL,NULL,'{\"tracking_id\":\"SCST-2026-18353\",\"timestamp\":\"2026-04-04T17:40:34.224Z\"}','2026-04-04 17:40:34'),(47,10,'application_create','application',8,NULL,NULL,'{\"tracking_id\":\"SCST-2026-88751\",\"timestamp\":\"2026-04-04T18:10:30.641Z\"}','2026-04-04 18:10:30'),(48,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-04T18:21:17.243Z\"}','2026-04-04 18:21:17'),(49,10,'application_create','application',9,NULL,NULL,'{\"tracking_id\":\"SCST-2026-83110\",\"timestamp\":\"2026-04-04T18:29:50.208Z\"}','2026-04-04 18:29:50'),(50,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-05T05:57:17.034Z\"}','2026-04-05 05:57:17'),(51,NULL,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01567806167\",\"role\":\"citizen\",\"timestamp\":\"2026-04-05T06:00:44.785Z\"}','2026-04-05 06:00:44'),(52,NULL,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01567806167\",\"role\":\"citizen\",\"timestamp\":\"2026-04-05T06:02:38.562Z\"}','2026-04-05 06:02:38'),(53,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01567806167\",\"timestamp\":\"2026-04-05T06:02:56.999Z\"}','2026-04-05 06:02:57'),(54,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01567806167\",\"timestamp\":\"2026-04-05T06:02:57.506Z\"}','2026-04-05 06:02:57'),(55,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01567806167\",\"timestamp\":\"2026-04-05T06:02:57.899Z\"}','2026-04-05 06:02:57'),(56,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01567806167\",\"timestamp\":\"2026-04-05T06:03:41.755Z\"}','2026-04-05 06:03:41'),(57,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01567806167\",\"timestamp\":\"2026-04-05T06:05:52.163Z\"}','2026-04-05 06:05:52'),(58,NULL,'otp_verified',NULL,NULL,NULL,NULL,'{\"timestamp\":\"2026-04-05T06:06:11.902Z\"}','2026-04-05 06:06:11'),(59,NULL,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01567806167\",\"timestamp\":\"2026-04-05T06:06:23.496Z\"}','2026-04-05 06:06:23'),(60,NULL,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01608881287\",\"role\":\"citizen\",\"timestamp\":\"2026-04-05T06:08:22.477Z\"}','2026-04-05 06:08:22'),(61,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01608881287\",\"timestamp\":\"2026-04-05T06:08:39.605Z\"}','2026-04-05 06:08:39'),(62,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01608881287\",\"timestamp\":\"2026-04-05T06:08:40.448Z\"}','2026-04-05 06:08:40'),(63,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01608881287\",\"timestamp\":\"2026-04-05T06:08:40.735Z\"}','2026-04-05 06:08:40'),(64,NULL,'otp_verified',NULL,NULL,NULL,NULL,'{\"timestamp\":\"2026-04-05T06:09:19.321Z\"}','2026-04-05 06:09:19'),(65,NULL,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01608881287\",\"timestamp\":\"2026-04-05T06:09:31.042Z\"}','2026-04-05 06:09:31'),(66,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-05T06:31:23.428Z\"}','2026-04-05 06:31:23'),(67,10,'application_create','application',10,NULL,NULL,'{\"tracking_id\":\"SCST-2026-52804\",\"timestamp\":\"2026-04-05T06:33:44.733Z\"}','2026-04-05 06:33:44'),(68,10,'application_create','application',11,NULL,NULL,'{\"tracking_id\":\"SCST-2026-34977\",\"timestamp\":\"2026-04-05T06:39:21.454Z\"}','2026-04-05 06:39:21'),(69,10,'application_create','application',12,NULL,NULL,'{\"tracking_id\":\"SCST-2026-33753\",\"timestamp\":\"2026-04-05T07:04:53.497Z\"}','2026-04-05 07:04:53'),(70,10,'application_create','application',13,NULL,NULL,'{\"tracking_id\":\"SCST-2026-31657\",\"timestamp\":\"2026-04-05T07:08:53.979Z\"}','2026-04-05 07:08:53'),(71,NULL,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01567806167\",\"role\":\"citizen\",\"timestamp\":\"2026-04-05T17:23:47.804Z\"}','2026-04-05 17:23:47'),(72,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01567806167\",\"timestamp\":\"2026-04-05T17:24:36.337Z\"}','2026-04-05 17:24:36'),(73,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01567806167\",\"timestamp\":\"2026-04-05T17:24:36.990Z\"}','2026-04-05 17:24:36'),(74,NULL,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01567806167\",\"timestamp\":\"2026-04-05T17:24:37.379Z\"}','2026-04-05 17:24:37'),(75,NULL,'otp_verified',NULL,NULL,NULL,NULL,'{\"timestamp\":\"2026-04-05T17:25:15.165Z\"}','2026-04-05 17:25:15'),(76,NULL,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01567806167\",\"timestamp\":\"2026-04-05T17:25:32.632Z\"}','2026-04-05 17:25:32'),(77,NULL,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01567806167\",\"timestamp\":\"2026-04-05T17:58:36.635Z\"}','2026-04-05 17:58:36'),(78,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-05T18:05:05.093Z\"}','2026-04-05 18:05:05'),(79,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-05T18:21:41.750Z\"}','2026-04-05 18:21:41'),(80,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-05T18:30:44.487Z\"}','2026-04-05 18:30:44'),(81,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-05T18:38:24.702Z\"}','2026-04-05 18:38:24'),(82,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-05T18:50:54.277Z\"}','2026-04-05 18:50:54'),(83,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-05T18:51:24.053Z\"}','2026-04-05 18:51:24'),(84,10,'application_create','application',14,NULL,NULL,'{\"tracking_id\":\"SCST-2026-82316\",\"timestamp\":\"2026-04-05T18:53:53.216Z\"}','2026-04-05 18:53:53'),(85,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-05T18:56:05.310Z\"}','2026-04-05 18:56:05'),(86,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-05T19:16:08.754Z\"}','2026-04-05 19:16:08'),(87,10,'application_create','application',15,NULL,NULL,'{\"tracking_id\":\"SCST-2026-23677\",\"timestamp\":\"2026-04-05T19:17:44.521Z\"}','2026-04-05 19:17:44'),(88,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-05T19:19:04.214Z\"}','2026-04-05 19:19:04'),(89,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-07T05:31:52.030Z\"}','2026-04-07 05:31:52'),(90,5,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01755555555\",\"timestamp\":\"2026-04-07T05:35:23.693Z\"}','2026-04-07 05:35:23'),(91,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-07T05:36:12.523Z\"}','2026-04-07 05:36:12'),(92,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-07T05:38:29.217Z\"}','2026-04-07 05:38:29'),(93,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-09T16:51:14.164Z\"}','2026-04-09 16:51:14'),(94,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-09T18:02:55.980Z\"}','2026-04-09 18:02:55'),(95,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-10T06:09:54.181Z\"}','2026-04-10 06:09:54'),(96,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-10T06:37:34.606Z\"}','2026-04-10 06:37:34'),(97,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-10T19:23:38.135Z\"}','2026-04-10 19:23:38'),(98,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-11T05:41:09.234Z\"}','2026-04-11 05:41:09'),(99,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-11T05:42:02.661Z\"}','2026-04-11 05:42:02'),(100,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-11T06:05:51.828Z\"}','2026-04-11 06:05:51'),(101,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-11T06:13:22.654Z\"}','2026-04-11 06:13:22'),(102,10,'application_create','application',16,NULL,NULL,'{\"tracking_id\":\"SCST-2026-91889\",\"timestamp\":\"2026-04-11T06:34:25.571Z\"}','2026-04-11 06:34:25'),(103,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-11T06:36:23.679Z\"}','2026-04-11 06:36:23'),(104,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-11T06:37:48.360Z\"}','2026-04-11 06:37:48'),(105,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-11T10:45:55.820Z\"}','2026-04-11 10:45:55'),(106,10,'application_create','application',17,NULL,NULL,'{\"tracking_id\":\"SCST-2026-27501\",\"timestamp\":\"2026-04-11T10:49:26.187Z\"}','2026-04-11 10:49:26'),(107,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-11T11:09:05.044Z\"}','2026-04-11 11:09:05'),(108,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-12T05:50:23.479Z\"}','2026-04-12 05:50:23'),(109,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-12T05:51:57.505Z\"}','2026-04-12 05:51:57'),(110,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-12T14:49:23.545Z\"}','2026-04-12 14:49:23'),(111,10,'application_create','application',18,NULL,NULL,'{\"tracking_id\":\"SCST-2026-34643\",\"timestamp\":\"2026-04-12T14:52:48.967Z\"}','2026-04-12 14:52:48'),(112,10,'application_create','application',19,NULL,NULL,'{\"tracking_id\":\"SCST-2026-59829\",\"timestamp\":\"2026-04-12T15:02:55.243Z\"}','2026-04-12 15:02:55'),(113,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-12T15:03:33.872Z\"}','2026-04-12 15:03:33'),(114,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-12T15:09:16.578Z\"}','2026-04-12 15:09:16'),(115,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-12T18:32:26.279Z\"}','2026-04-12 18:32:26'),(116,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-12T18:34:00.591Z\"}','2026-04-12 18:34:00'),(117,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-13T04:52:00.812Z\"}','2026-04-13 04:52:00'),(118,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-13T04:53:10.110Z\"}','2026-04-13 04:53:10'),(119,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-13T04:56:02.906Z\"}','2026-04-13 04:56:02'),(120,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-13T05:15:03.072Z\"}','2026-04-13 05:15:03'),(121,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-13T05:15:35.017Z\"}','2026-04-13 05:15:35'),(122,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-13T05:16:00.944Z\"}','2026-04-13 05:16:00'),(123,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-13T05:16:21.846Z\"}','2026-04-13 05:16:21'),(124,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-13T05:33:00.305Z\"}','2026-04-13 05:33:00'),(125,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-13T05:46:25.521Z\"}','2026-04-13 05:46:25'),(126,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-13T06:13:37.215Z\"}','2026-04-13 06:13:37'),(127,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-13T06:48:46.609Z\"}','2026-04-13 06:48:46'),(128,15,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01711223344\",\"role\":\"citizen\",\"timestamp\":\"2026-04-13T07:07:41.511Z\"}','2026-04-13 07:07:41'),(129,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-13T11:43:41.645Z\"}','2026-04-13 11:43:41'),(130,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-13T12:03:46.842Z\"}','2026-04-13 12:03:46'),(131,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-13T16:06:13.838Z\"}','2026-04-13 16:06:13'),(132,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-13T17:49:02.055Z\"}','2026-04-13 17:49:02'),(133,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-13T18:18:13.732Z\"}','2026-04-13 18:18:13'),(134,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-13T18:23:49.927Z\"}','2026-04-13 18:23:49'),(135,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-13T18:24:51.604Z\"}','2026-04-13 18:24:51'),(136,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-13T18:26:13.171Z\"}','2026-04-13 18:26:13'),(137,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-13T18:26:31.066Z\"}','2026-04-13 18:26:31'),(138,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-14T05:16:22.046Z\"}','2026-04-14 05:16:22'),(139,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-14T05:17:23.890Z\"}','2026-04-14 05:17:23'),(140,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-14T05:18:47.132Z\"}','2026-04-14 05:18:47'),(141,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-14T05:20:48.272Z\"}','2026-04-14 05:20:48'),(142,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-14T05:40:48.555Z\"}','2026-04-14 05:40:48'),(143,10,'application_create','application',20,NULL,NULL,'{\"tracking_id\":\"SCST-2026-77775\",\"timestamp\":\"2026-04-14T05:44:08.415Z\"}','2026-04-14 05:44:08'),(144,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-14T05:44:53.325Z\"}','2026-04-14 05:44:53'),(145,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-14T06:02:21.845Z\"}','2026-04-14 06:02:21'),(146,10,'application_create','application',21,NULL,NULL,'{\"tracking_id\":\"SCST-2026-68178\",\"timestamp\":\"2026-04-14T06:07:09.136Z\"}','2026-04-14 06:07:09'),(147,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-14T06:08:01.147Z\"}','2026-04-14 06:08:01'),(148,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-14T06:08:52.681Z\"}','2026-04-14 06:08:52'),(149,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-14T06:10:46.998Z\"}','2026-04-14 06:10:46'),(150,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-14T06:19:15.666Z\"}','2026-04-14 06:19:15'),(151,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-14T15:49:34.058Z\"}','2026-04-14 15:49:34'),(152,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-14T15:49:54.825Z\"}','2026-04-14 15:49:54'),(153,16,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01608881287\",\"role\":\"citizen\",\"timestamp\":\"2026-04-15T12:12:23.471Z\"}','2026-04-15 12:12:23'),(154,16,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01608881287\",\"timestamp\":\"2026-04-15T12:12:40.835Z\"}','2026-04-15 12:12:40'),(155,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-15T12:45:40.422Z\"}','2026-04-15 12:45:40'),(156,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-15T12:50:31.331Z\"}','2026-04-15 12:50:31'),(157,17,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01567806167\",\"role\":\"citizen\",\"timestamp\":\"2026-04-15T12:56:12.892Z\"}','2026-04-15 12:56:12'),(158,17,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"muntakimrafi@gmail.com\",\"timestamp\":\"2026-04-15T12:56:16.728Z\"}','2026-04-15 12:56:16'),(159,17,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01567806167\",\"timestamp\":\"2026-04-15T12:56:48.379Z\"}','2026-04-15 12:56:48'),(160,17,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01567806167\",\"timestamp\":\"2026-04-15T12:58:33.496Z\"}','2026-04-15 12:58:33'),(161,18,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"role\":\"citizen\",\"timestamp\":\"2026-04-15T13:07:50.894Z\"}','2026-04-15 13:07:50'),(162,18,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01567806167\",\"timestamp\":\"2026-04-15T13:08:10.750Z\"}','2026-04-15 13:08:10'),(163,18,'otp_verified',NULL,NULL,NULL,NULL,'{\"timestamp\":\"2026-04-15T13:08:37.133Z\"}','2026-04-15 13:08:37'),(164,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-15T13:09:41.030Z\"}','2026-04-15 13:09:41'),(165,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-15T13:12:04.332Z\"}','2026-04-15 13:12:04'),(166,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-15T13:12:50.232Z\"}','2026-04-15 13:12:50'),(167,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-15T14:04:50.756Z\"}','2026-04-15 14:04:50'),(168,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-15T15:09:31.433Z\"}','2026-04-15 15:09:31'),(169,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-15T15:51:32.363Z\"}','2026-04-15 15:51:32'),(170,19,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"role\":\"citizen\",\"timestamp\":\"2026-04-15T16:07:37.328Z\"}','2026-04-15 16:07:37'),(171,19,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01710807454\",\"timestamp\":\"2026-04-15T16:07:48.618Z\"}','2026-04-15 16:07:48'),(172,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-15T16:08:13.076Z\"}','2026-04-15 16:08:13'),(173,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-15T16:08:54.474Z\"}','2026-04-15 16:08:54'),(174,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-15T16:16:30.576Z\"}','2026-04-15 16:16:30'),(175,20,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01567894710\",\"role\":\"citizen\",\"timestamp\":\"2026-04-15T16:18:31.448Z\"}','2026-04-15 16:18:31'),(176,21,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01545678901\",\"role\":\"citizen\",\"timestamp\":\"2026-04-15T16:19:55.065Z\"}','2026-04-15 16:19:55'),(177,21,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01545678901\",\"timestamp\":\"2026-04-15T16:20:04.055Z\"}','2026-04-15 16:20:04'),(178,21,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01545678901\",\"timestamp\":\"2026-04-15T16:20:28.777Z\"}','2026-04-15 16:20:28'),(179,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-16T02:46:05.358Z\"}','2026-04-16 02:46:05'),(180,10,'application_create','application',22,NULL,NULL,'{\"tracking_id\":\"SCST-2026-82512\",\"timestamp\":\"2026-04-16T02:51:00.219Z\"}','2026-04-16 02:51:00'),(181,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-16T02:54:38.356Z\"}','2026-04-16 02:54:38'),(182,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-16T02:55:16.452Z\"}','2026-04-16 02:55:16'),(183,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-16T04:39:24.841Z\"}','2026-04-16 04:39:24'),(184,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T04:42:34.740Z\"}','2026-04-16 04:42:34'),(185,18,'application_create','application',23,NULL,NULL,'{\"tracking_id\":\"SCST-2026-54324\",\"timestamp\":\"2026-04-16T04:54:54.569Z\"}','2026-04-16 04:54:54'),(186,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-16T05:03:01.545Z\"}','2026-04-16 05:03:01'),(187,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-16T05:03:08.939Z\"}','2026-04-16 05:03:09'),(188,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-16T05:03:57.943Z\"}','2026-04-16 05:03:58'),(189,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-16T05:04:25.337Z\"}','2026-04-16 05:04:25'),(190,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-16T05:04:46.837Z\"}','2026-04-16 05:04:46'),(191,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-16T05:05:32.828Z\"}','2026-04-16 05:05:32'),(192,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-16T05:06:05.539Z\"}','2026-04-16 05:06:05'),(193,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-16T05:06:47.939Z\"}','2026-04-16 05:06:48'),(194,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T05:10:47.335Z\"}','2026-04-16 05:10:47'),(195,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T05:11:41.954Z\"}','2026-04-16 05:11:42'),(196,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-16T05:15:25.837Z\"}','2026-04-16 05:15:25'),(197,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-16T05:19:22.838Z\"}','2026-04-16 05:19:22'),(198,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T05:21:04.141Z\"}','2026-04-16 05:21:04'),(199,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T05:22:53.537Z\"}','2026-04-16 05:22:53'),(200,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-16T05:23:05.339Z\"}','2026-04-16 05:23:05'),(201,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T05:23:39.636Z\"}','2026-04-16 05:23:39'),(202,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-16T05:23:57.740Z\"}','2026-04-16 05:23:57'),(203,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-16T05:25:10.040Z\"}','2026-04-16 05:25:10'),(204,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T05:28:08.937Z\"}','2026-04-16 05:28:09'),(205,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-16T06:23:25.479Z\"}','2026-04-16 06:23:25'),(206,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-16T06:24:25.486Z\"}','2026-04-16 06:24:25'),(207,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-16T06:25:42.881Z\"}','2026-04-16 06:25:42'),(208,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-16T06:27:12.881Z\"}','2026-04-16 06:27:12'),(209,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-16T06:28:22.793Z\"}','2026-04-16 06:28:22'),(210,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-16T06:29:17.885Z\"}','2026-04-16 06:29:17'),(211,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-16T06:34:11.282Z\"}','2026-04-16 06:34:11'),(212,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T06:48:11.081Z\"}','2026-04-16 06:48:11'),(213,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-16T06:49:34.681Z\"}','2026-04-16 06:49:34'),(214,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-16T07:14:14.935Z\"}','2026-04-16 07:14:15'),(215,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-16T07:26:17.043Z\"}','2026-04-16 07:26:17'),(216,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T07:26:48.143Z\"}','2026-04-16 07:26:48'),(217,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T07:46:43.341Z\"}','2026-04-16 07:46:43'),(218,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T07:49:54.636Z\"}','2026-04-16 07:49:54'),(219,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T08:35:55.014Z\"}','2026-04-16 08:35:55'),(220,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T08:35:58.609Z\"}','2026-04-16 08:35:58'),(221,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T08:42:19.607Z\"}','2026-04-16 08:42:19'),(222,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T08:45:34.713Z\"}','2026-04-16 08:45:34'),(223,18,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01640479587\",\"timestamp\":\"2026-04-16T08:54:00.212Z\"}','2026-04-16 08:54:00'),(224,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-16T09:19:46.094Z\"}','2026-04-16 09:19:46'),(225,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-16T09:21:23.105Z\"}','2026-04-16 09:21:23'),(226,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-16T09:22:03.405Z\"}','2026-04-16 09:22:03'),(227,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-16T09:22:20.407Z\"}','2026-04-16 09:22:20'),(228,22,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"+880123456789\",\"role\":\"citizen\",\"timestamp\":\"2026-04-16T13:51:01.479Z\"}','2026-04-16 13:51:01'),(229,22,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"mdnour7025@gmail.com\",\"timestamp\":\"2026-04-16T13:51:26.586Z\"}','2026-04-16 13:51:26'),(230,22,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"mdnour7025@gmail.com\",\"timestamp\":\"2026-04-16T13:52:35.519Z\"}','2026-04-16 13:52:35'),(231,23,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01974962406\",\"role\":\"citizen\",\"timestamp\":\"2026-04-16T13:53:24.684Z\"}','2026-04-16 13:53:24'),(232,23,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"mdfarhan7025@gmail.com\",\"timestamp\":\"2026-04-16T13:53:28.707Z\"}','2026-04-16 13:53:28'),(233,23,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01974962406\",\"timestamp\":\"2026-04-16T14:00:26.827Z\"}','2026-04-16 14:00:26'),(234,23,'application_create','application',24,NULL,NULL,'{\"tracking_id\":\"SCST-2026-51194\",\"timestamp\":\"2026-04-16T14:03:34.644Z\"}','2026-04-16 14:03:34'),(235,23,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01974962406\",\"timestamp\":\"2026-04-16T14:06:45.325Z\"}','2026-04-16 14:06:45'),(236,23,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01974962406\",\"timestamp\":\"2026-04-16T14:08:02.648Z\"}','2026-04-16 14:08:02'),(237,24,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01788888888\",\"role\":\"citizen\",\"timestamp\":\"2026-04-17T05:29:42.501Z\"}','2026-04-17 05:29:42'),(238,24,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"1234\",\"timestamp\":\"2026-04-17T05:29:51.117Z\"}','2026-04-17 05:29:51'),(239,24,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01788888888\",\"timestamp\":\"2026-04-17T05:30:30.090Z\"}','2026-04-17 05:30:30'),(240,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-17T05:33:48.489Z\"}','2026-04-17 05:33:48'),(241,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-17T07:47:45.680Z\"}','2026-04-17 07:47:45'),(242,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-17T07:50:37.487Z\"}','2026-04-17 07:50:37'),(243,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-17T17:47:01.544Z\"}','2026-04-17 17:47:01'),(244,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-17T18:00:59.506Z\"}','2026-04-17 18:00:59'),(245,25,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01959453488\",\"role\":\"citizen\",\"timestamp\":\"2026-04-18T17:15:01.057Z\"}','2026-04-18 17:15:01'),(246,25,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"sharderramim@gmail.com\",\"timestamp\":\"2026-04-18T17:15:06.797Z\"}','2026-04-18 17:15:06'),(247,25,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01959453488\",\"timestamp\":\"2026-04-18T17:15:46.716Z\"}','2026-04-18 17:15:46'),(248,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-18T17:19:12.413Z\"}','2026-04-18 17:19:12'),(249,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-18T17:20:26.515Z\"}','2026-04-18 17:20:26'),(250,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-18T17:20:35.115Z\"}','2026-04-18 17:20:35'),(251,25,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01959453488\",\"timestamp\":\"2026-04-18T19:40:25.291Z\"}','2026-04-18 19:40:25'),(252,26,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"0130847231\",\"role\":\"citizen\",\"timestamp\":\"2026-04-18T21:10:57.782Z\"}','2026-04-18 21:10:57'),(253,26,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"a7@gmail.com\",\"timestamp\":\"2026-04-18T21:11:06.947Z\"}','2026-04-18 21:11:07'),(254,26,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"a7@gmail.com\",\"timestamp\":\"2026-04-18T21:11:37.862Z\"}','2026-04-18 21:11:37'),(255,27,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01308472310\",\"role\":\"citizen\",\"timestamp\":\"2026-04-18T21:12:46.054Z\"}','2026-04-18 21:12:46'),(256,27,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"ziaul.haque1.cse@ulab.edu.bd\",\"timestamp\":\"2026-04-18T21:12:49.408Z\"}','2026-04-18 21:12:49'),(257,28,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01406434629\",\"role\":\"citizen\",\"timestamp\":\"2026-04-18T21:14:57.958Z\"}','2026-04-18 21:14:58'),(258,28,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"a7@gmail.com\",\"timestamp\":\"2026-04-18T21:15:00.841Z\"}','2026-04-18 21:15:00'),(259,28,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01406434629\",\"timestamp\":\"2026-04-18T21:15:47.590Z\"}','2026-04-18 21:15:47'),(260,28,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01406434629\",\"timestamp\":\"2026-04-18T21:20:41.590Z\"}','2026-04-18 21:20:41'),(261,29,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"1222222\",\"role\":\"citizen\",\"timestamp\":\"2026-04-19T03:11:06.452Z\"}','2026-04-19 03:11:06'),(262,29,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"mdalvi987@gmail.com\",\"timestamp\":\"2026-04-19T03:18:52.792Z\"}','2026-04-19 03:18:52'),(263,29,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"1222222\",\"timestamp\":\"2026-04-19T03:19:37.717Z\"}','2026-04-19 03:19:37'),(264,29,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"1222222\",\"timestamp\":\"2026-04-19T03:28:47.014Z\"}','2026-04-19 03:28:47'),(265,29,'application_create','application',25,NULL,NULL,'{\"tracking_id\":\"SCST-2026-33970\",\"timestamp\":\"2026-04-19T03:30:58.796Z\"}','2026-04-19 03:30:58'),(266,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-20T06:23:00.400Z\"}','2026-04-20 06:23:00'),(267,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-21T06:42:48.948Z\"}','2026-04-21 06:42:49'),(268,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-21T08:52:56.281Z\"}','2026-04-21 08:52:56'),(269,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-21T08:53:45.287Z\"}','2026-04-21 08:53:45'),(270,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-21T08:56:10.774Z\"}','2026-04-21 08:56:10'),(271,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-21T08:58:53.373Z\"}','2026-04-21 08:58:53'),(272,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-21T09:00:13.474Z\"}','2026-04-21 09:00:13'),(273,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-21T09:01:05.875Z\"}','2026-04-21 09:01:05'),(274,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-21T09:11:16.570Z\"}','2026-04-21 09:11:16'),(275,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-21T09:17:30.274Z\"}','2026-04-21 09:17:30'),(276,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-21T09:17:38.273Z\"}','2026-04-21 09:17:38'),(277,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-21T09:18:07.675Z\"}','2026-04-21 09:18:07'),(278,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-21T09:24:38.066Z\"}','2026-04-21 09:24:38'),(279,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-21T09:27:26.572Z\"}','2026-04-21 09:27:26'),(280,30,'user_register',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710808454\",\"role\":\"citizen\",\"timestamp\":\"2026-04-21T12:10:43.460Z\"}','2026-04-21 12:10:43'),(281,30,'otp_sent',NULL,NULL,NULL,NULL,'{\"contact\":\"01710808454\",\"timestamp\":\"2026-04-21T12:10:48.917Z\"}','2026-04-21 12:10:49'),(282,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T12:11:29.459Z\"}','2026-04-21 12:11:29'),(283,19,'application_create','application',26,NULL,NULL,'{\"tracking_id\":\"SCST-2026-63789\",\"timestamp\":\"2026-04-21T12:14:35.171Z\"}','2026-04-21 12:14:35'),(284,6,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01766666666\",\"timestamp\":\"2026-04-21T12:20:00.770Z\"}','2026-04-21 12:20:00'),(285,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-21T12:20:15.662Z\"}','2026-04-21 12:20:15'),(286,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T12:21:13.469Z\"}','2026-04-21 12:21:13'),(287,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-21T12:22:40.068Z\"}','2026-04-21 12:22:40'),(288,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T12:23:47.576Z\"}','2026-04-21 12:23:47'),(289,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T12:25:18.669Z\"}','2026-04-21 12:25:18'),(290,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-21T12:25:28.469Z\"}','2026-04-21 12:25:28'),(291,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-21T12:33:41.369Z\"}','2026-04-21 12:33:41'),(292,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T12:46:43.270Z\"}','2026-04-21 12:46:43'),(293,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T12:50:46.268Z\"}','2026-04-21 12:50:46'),(294,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T12:54:28.173Z\"}','2026-04-21 12:54:28'),(295,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T13:02:52.173Z\"}','2026-04-21 13:02:52'),(296,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-21T13:04:09.268Z\"}','2026-04-21 13:04:09'),(297,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T13:07:09.467Z\"}','2026-04-21 13:07:09'),(298,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-21T13:07:51.665Z\"}','2026-04-21 13:07:51'),(299,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-21T13:09:28.169Z\"}','2026-04-21 13:09:28'),(300,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-21T13:24:36.272Z\"}','2026-04-21 13:24:36'),(301,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T13:25:24.768Z\"}','2026-04-21 13:25:24'),(302,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-21T13:27:38.776Z\"}','2026-04-21 13:27:38'),(303,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T13:27:56.768Z\"}','2026-04-21 13:27:56'),(304,10,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01939838241\",\"timestamp\":\"2026-04-21T13:28:19.970Z\"}','2026-04-21 13:28:20'),(305,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-21T13:29:09.068Z\"}','2026-04-21 13:29:09'),(306,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T13:30:10.970Z\"}','2026-04-21 13:30:11'),(307,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-21T13:33:04.067Z\"}','2026-04-21 13:33:04'),(308,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T13:34:13.562Z\"}','2026-04-21 13:34:13'),(309,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-21T13:52:49.875Z\"}','2026-04-21 13:52:49'),(310,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T13:53:43.072Z\"}','2026-04-21 13:53:43'),(311,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-21T13:57:16.870Z\"}','2026-04-21 13:57:16'),(312,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T14:32:22.608Z\"}','2026-04-21 14:32:22'),(313,4,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01744444444\",\"timestamp\":\"2026-04-21T14:35:39.507Z\"}','2026-04-21 14:35:39'),(314,19,'user_login',NULL,NULL,NULL,NULL,'{\"mobile\":\"01710807454\",\"timestamp\":\"2026-04-21T14:37:04.207Z\"}','2026-04-21 14:37:04');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documents`
--

DROP TABLE IF EXISTS `documents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documents` (
  `doc_id` int NOT NULL AUTO_INCREMENT,
  `app_id` int NOT NULL,
  `doc_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_size` int DEFAULT NULL,
  `mime_type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uploaded_by` int NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`doc_id`),
  KEY `uploaded_by` (`uploaded_by`),
  KEY `idx_app` (`app_id`),
  KEY `idx_doc_type` (`doc_type`),
  CONSTRAINT `documents_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `applications` (`app_id`) ON DELETE CASCADE,
  CONSTRAINT `documents_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documents`
--

LOCK TABLES `documents` WRITE;
/*!40000 ALTER TABLE `documents` DISABLE KEYS */;
INSERT INTO `documents` VALUES (1,1,'hospital_certificate','hospital_cert_001.pdf','/uploads/docs/hospital_cert_001.pdf',204800,'application/pdf',1,'2026-04-02 17:49:49'),(2,1,'father_nid','father_nid_001.jpg','/uploads/docs/father_nid_001.jpg',102400,'image/jpeg',1,'2026-04-02 17:49:49'),(3,1,'mother_nid','mother_nid_001.jpg','/uploads/docs/mother_nid_001.jpg',98304,'image/jpeg',1,'2026-04-02 17:49:49'),(4,2,'hospital_certificate','hospital_cert_002.pdf','/uploads/docs/hospital_cert_002.pdf',215040,'application/pdf',2,'2026-04-02 17:49:49'),(5,2,'father_nid','father_nid_002.jpg','/uploads/docs/father_nid_002.jpg',110592,'image/jpeg',2,'2026-04-02 17:49:49'),(6,3,'hospital_certificate','hospital_cert_003.pdf','/uploads/docs/hospital_cert_003.pdf',198656,'application/pdf',1,'2026-04-02 17:49:49'),(7,4,'hospital_certificate','hospital_cert_004.pdf','/uploads/docs/hospital_cert_004.pdf',220160,'application/pdf',3,'2026-04-02 17:49:49'),(8,5,'hospital_certificate','hospital_cert_005.pdf','/uploads/docs/hospital_cert_005.pdf',189440,'application/pdf',2,'2026-04-02 17:49:49'),(9,5,'father_nid','father_nid_005.jpg','/uploads/docs/father_nid_005.jpg',92160,'image/jpeg',2,'2026-04-02 17:49:49'),(19,15,'application_document','1000016836.jpg','C:\\Users\\USER\\Desktop\\SCST\\Backend\\src\\uploads\\1775416664503-379947615.jpg',265693,'image/jpeg',10,'2026-04-05 19:17:44'),(20,16,'application_document','1000016836.jpg','C:\\Users\\USER\\Desktop\\SCST\\Backend\\src\\uploads\\1775889265551-544538202.jpg',265693,'image/jpeg',10,'2026-04-11 06:34:25'),(21,17,'application_document','1000016837.jpg','C:\\Users\\USER\\Desktop\\SCST\\Backend\\src\\uploads\\1775904566171-509277880.jpg',219097,'image/jpeg',10,'2026-04-11 10:49:26'),(22,18,'application_document','1000010690.jpg','C:\\Users\\USER\\Desktop\\SCST\\Backend\\src\\uploads\\1776005568921-971150644.jpg',462493,'image/jpeg',10,'2026-04-12 14:52:48'),(23,19,'application_document','1000016837.jpg','C:\\Users\\USER\\Desktop\\SCST\\Backend\\src\\uploads\\1776006175199-930412449.jpg',219097,'image/jpeg',10,'2026-04-12 15:02:55'),(24,20,'application_document','png (1).png','C:\\Users\\USER\\Desktop\\SCST\\Backend\\src\\uploads\\1776145448365-346497207.png',33332,'image/png',10,'2026-04-14 05:44:08'),(25,21,'application_document','2.png','C:\\Users\\USER\\Desktop\\SCST\\Backend\\src\\uploads\\1776146829124-395737051.png',74714,'image/png',10,'2026-04-14 06:07:09'),(26,22,'application_document','Bill copy (1).pdf','/opt/render/project/src/backend/src/uploads/1776307859694-234122153.pdf',211453,'application/pdf',10,'2026-04-16 02:51:00'),(27,23,'application_document','NID Certificate (1).pdf','/opt/render/project/src/backend/src/uploads/1776315293870-132088284.pdf',167429,'application/pdf',18,'2026-04-16 04:54:54'),(28,24,'application_document','Whisk_49e2bc697f20aabbf1242c0a442817e6dr.png','/opt/render/project/src/backend/src/uploads/1776348213989-274321425.png',1531759,'image/png',23,'2026-04-16 14:03:34'),(29,25,'application_document','WhatsApp Image 2026-04-19 at 3.10.43 AM.jpeg','/opt/render/project/src/backend/src/uploads/1776569458444-122891005.jpeg',58503,'image/jpeg',29,'2026-04-19 03:30:58');
/*!40000 ALTER TABLE `documents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `feedback_complaints`
--

DROP TABLE IF EXISTS `feedback_complaints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `feedback_complaints` (
  `feedback_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `app_id` int DEFAULT NULL,
  `type` enum('feedback','complaint') COLLATE utf8mb4_unicode_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('pending','in_review','resolved','closed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `assigned_to` int DEFAULT NULL,
  `resolution_note` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `resolved_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`feedback_id`),
  KEY `app_id` (`app_id`),
  KEY `assigned_to` (`assigned_to`),
  KEY `idx_user` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  CONSTRAINT `feedback_complaints_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `feedback_complaints_ibfk_2` FOREIGN KEY (`app_id`) REFERENCES `applications` (`app_id`) ON DELETE SET NULL,
  CONSTRAINT `feedback_complaints_ibfk_3` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `feedback_complaints`
--

LOCK TABLES `feedback_complaints` WRITE;
/*!40000 ALTER TABLE `feedback_complaints` DISABLE KEYS */;
INSERT INTO `feedback_complaints` VALUES (1,1,1,'feedback','Service Quality','দ্রুত সেবার জন্য ধন্যবাদ','আবেদন প্রক্রিয়া অনেক সহজ ও দ্রুত ছিল। অফিসারগণ সহযোগিতামূলক ছিলেন।','resolved',4,'ধন্যবাদ আপনার মতামতের জন্য।','2026-04-02 17:49:49','2024-02-25 04:00:00'),(2,2,5,'complaint','Application','ভুল কারণে আবেদন বাতিল','আমার পিতার NID সঠিক ছিল, তবুও আবেদন বাতিল করা হয়েছে। পুনর্বিবেচনার অনুরোধ।','in_review',5,NULL,'2026-04-02 17:49:49',NULL),(3,3,4,'feedback','System','পেমেন্ট সিস্টেম উন্নত করুন','bKash পেমেন্টে সমস্যা হচ্ছিল। আরও পেমেন্ট অপশন যোগ করলে ভালো হতো।','pending',NULL,NULL,'2026-04-02 17:49:49',NULL);
/*!40000 ALTER TABLE `feedback_complaints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notif_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `app_id` int DEFAULT NULL,
  `title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('sms','email','app','push') COLLATE utf8mb4_unicode_ci DEFAULT 'app',
  `status` enum('pending','sent','failed') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `is_read` tinyint(1) DEFAULT '0',
  `sent_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `read_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`notif_id`),
  KEY `app_id` (`app_id`),
  KEY `idx_user_read` (`user_id`,`is_read`),
  KEY `idx_status` (`status`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`app_id`) REFERENCES `applications` (`app_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
INSERT INTO `notifications` VALUES (1,1,1,'আবেদন সম্পন্ন হয়েছে','আপনার জন্ম নিবন্ধন সনদ (TRK-2024-000001) প্রস্তুত। অফিস থেকে সংগ্রহ করুন।','app','sent',1,'2026-04-02 17:49:49',NULL),(2,1,1,'পেমেন্ট সফল','TRK-2024-000001 আবেদনের জন্য ৳৫০ পেমেন্ট সফলভাবে গ্রহণ করা হয়েছে।','sms','sent',1,'2026-04-02 17:49:49',NULL),(3,2,2,'আবেদন অনুমোদিত হয়েছে','আপনার জন্ম নিবন্ধন আবেদন (TRK-2024-000002) অনুমোদন করা হয়েছে।','app','sent',0,'2026-04-02 17:49:49',NULL),(4,1,3,'আবেদন প্রক্রিয়াধীন','আপনার আবেদন (TRK-2024-000003) যাচাই করা হচ্ছে।','app','sent',0,'2026-04-02 17:49:49',NULL),(5,3,4,'আবেদন জমা হয়েছে','আপনার জন্ম নিবন্ধন আবেদন (TRK-2024-000004) সফলভাবে জমা হয়েছে।','app','sent',1,'2026-04-02 17:49:49',NULL),(6,2,5,'আবেদন বাতিল হয়েছে','আপনার আবেদন (TRK-2024-000005) বাতিল করা হয়েছে। কারণ: NID তথ্য সঠিক নয়।','app','sent',1,'2026-04-02 17:49:49',NULL),(7,10,18,'আবেদন বাতিল হয়েছে','প্রিয় আখি, আপনার আবেদন (SCST-2026-34643) বাতিল করা হয়েছে। কারণ: You did not submit proper document.','app','sent',0,'2026-04-13 05:32:44',NULL),(8,10,19,'আবেদন অনুমোদিত হয়েছে','প্রিয় আখি, আপনার জন্ম নিবন্ধন আবেদন (SCST-2026-59829) অনুমোদিত হয়েছে এবং এখন In Progress অবস্থায় আছে।','app','sent',0,'2026-04-14 15:49:45',NULL),(9,19,NULL,'আবেদন বাতিল হয়েছে','প্রিয় রামিসা খানম, আপনার আবেদন (SCST-2026-63789) বাতিল করা হয়েছে। কারণ: Information wrong','app','sent',1,'2026-04-21 14:36:38','2026-04-21 14:38:07');
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `officers`
--

DROP TABLE IF EXISTS `officers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `officers` (
  `officer_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `employee_id` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `department` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `designation` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `office_location` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `joined_at` date DEFAULT NULL,
  PRIMARY KEY (`officer_id`),
  UNIQUE KEY `employee_id` (`employee_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_department` (`department`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT `officers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `officers`
--

LOCK TABLES `officers` WRITE;
/*!40000 ALTER TABLE `officers` DISABLE KEYS */;
INSERT INTO `officers` VALUES (1,4,'EMP-2021-001','Birth & Death Registration','Registration Officer','Dhaka North City Corporation',1,'2021-03-15'),(2,5,'EMP-2019-045','Birth & Death Registration','Senior Registration Officer','Dhaka South City Corporation',1,'2019-07-01');
/*!40000 ALTER TABLE `officers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `invoice_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `app_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `currency` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'BDT',
  `service_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_name` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_mobile` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `customer_email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `payment_method` enum('bkash','nagad','rocket','card','bank') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_status` enum('pending','success','paid','failed','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
  `gateway_response` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `receipt_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `verified_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `transaction_id` (`transaction_id`),
  UNIQUE KEY `invoice_id` (`invoice_id`),
  KEY `idx_transaction` (`transaction_id`),
  KEY `idx_app` (`app_id`),
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`payment_status`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `applications` (`app_id`) ON DELETE CASCADE,
  CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `payments_chk_1` CHECK (json_valid(`gateway_response`))
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
INSERT INTO `payments` VALUES (11,'INV-2024-001',1,1,'BKASH-20240201-001',50.00,'BDT','Birth Certificate','Rahim Uddin','01711111111','rahim@gmail.com','bkash','paid',NULL,NULL,'2024-02-01 05:00:00','2024-02-01 05:02:00','2026-04-10 06:35:51'),(12,'INV-2024-002',2,2,'NAGAD-20240305-002',50.00,'BDT','Birth Certificate','Fatema Begum','01722222222','fatema@gmail.com','nagad','paid',NULL,NULL,'2024-03-05 04:15:00','2024-03-05 04:16:00','2026-04-10 06:35:51'),(13,'INV-2024-003',3,1,'BKASH-20240310-003',50.00,'BDT','Birth Certificate','Rahim Uddin','01711111111','rahim@gmail.com','bkash','paid',NULL,NULL,'2024-03-10 03:45:00','2024-03-10 03:46:00','2026-04-10 06:35:51'),(15,'INV-2024-005',5,2,'BKASH-20240401-005',50.00,'BDT','Birth Certificate','Fatema Begum','01722222222','fatema@gmail.com','bkash','paid',NULL,NULL,'2024-04-01 02:30:00','2024-04-01 02:31:00','2026-04-10 06:35:51'),(52,'INV-MO8ERQES-DIIKG2',22,10,NULL,100.00,'BDT','Birth Certificate','Selina akter','01939838241','umme.salma1.cse@ulab.edu.bd','bkash','pending','{\"status\":true,\"message\":\"Payment Url\",\"payment_url\":\"https://sandbox.uddoktapay.com/payment/bdcccd9326232cf4227ed3ca4687f4943e5afe8a\"}',NULL,NULL,NULL,'2026-04-21 09:15:24');
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_fees`
--

DROP TABLE IF EXISTS `service_fees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_fees` (
  `fee_id` int NOT NULL AUTO_INCREMENT,
  `service_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'New Birth Certificate',
  `fee_amount` decimal(10,2) NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `effective_from` date DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`fee_id`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_fees`
--

LOCK TABLES `service_fees` WRITE;
/*!40000 ALTER TABLE `service_fees` DISABLE KEYS */;
INSERT INTO `service_fees` VALUES (1,'New Birth Certificate',50.00,1,'2024-01-01','2026-04-02 17:49:49');
/*!40000 ALTER TABLE `service_fees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_address` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('citizen','review_handler','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'citizen',
  `otp` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `otp_expires` datetime DEFAULT NULL,
  `is_verified` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `mobile` (`mobile`),
  KEY `idx_mobile` (`mobile`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Rahim Uddin','01711111111','rahim@gmail.com','Mirpur-10, Dhaka','$2b$10$n/x0PDjNDxnGg1Rw0cLrUupHObThqqDjKCrcFrBqMQg2tKMQpAy72','citizen',NULL,NULL,1,'2026-04-02 17:49:49'),(2,'Fatema Begum','01722222222','fatema@gmail.com','Uttara, Dhaka','$2b$10$n/x0PDjNDxnGg1Rw0cLrUupHObThqqDjKCrcFrBqMQg2tKMQpAy72','citizen',NULL,NULL,1,'2026-04-02 17:49:49'),(3,'Karim Hossain','01733333333','karim@gmail.com','Chittagong Sadar','$2b$10$n/x0PDjNDxnGg1Rw0cLrUupHObThqqDjKCrcFrBqMQg2tKMQpAy72','citizen',NULL,NULL,0,'2026-04-02 17:49:49'),(4,'Officer Nasrin','01744444444','nasrin@gov.bd','Dhaka City Corporation','$2b$10$Xl1WDhXWFDd/hQGmrd6p5uQKq9J3vx7IuCV.NacD8U4f4PsCUM2jK','review_handler',NULL,NULL,1,'2026-04-02 17:49:49'),(5,'Officer Jamal','01755555555','jamal@gov.bd','Dhaka City Corporation','$2b$10$Xl1WDhXWFDd/hQGmrd6p5uQKq9J3vx7IuCV.NacD8U4f4PsCUM2jK','review_handler',NULL,NULL,1,'2026-04-02 17:49:49'),(6,'Admin Sumaiya','01766666666','admin@scst.gov.bd','Segunbagicha, Dhaka','$2b$10$CVYA70yuOXt0TeIHTvE7V.RO9TqEV4Gx/4r388QQFatALKgcJhmxG','admin',NULL,NULL,1,'2026-04-02 17:49:49'),(10,'umme salma','01939838241','umme.salma1.cse@ulab.edu.bd','Mohammadpur,Dhaka','$2b$10$hJl15rFT10pWXOciIMnCnO6lD435ZbbOHlarXRFCHFLHLJA3UbWyC','citizen',NULL,NULL,1,'2026-04-03 06:36:52'),(15,'Rahim Uddin','01711223344','rahim@example.com',NULL,'$2b$10$8pjk.njhd8fYTgieaZHNB.RCUGK2U.5wf/DmsOFnwft7tzdN9ms8q','citizen',NULL,NULL,0,'2026-04-13 07:07:41'),(16,'Ramim','01608881287','mehrajul.islam.cse@ulab.edu.bd','Bashabo,Dhaka','$2b$10$xKgBJ/dspdimao1yyCnCf.wrMsJa4jmp1Nt81K4h9HaFn03Qw2UZG','citizen','4646','2026-04-15 12:22:41',0,'2026-04-15 12:12:22'),(17,'Muhammad Muntakim Rafi ','01567806167','muntakimrafi@gmail.com','Hazaribagh Dhaka ','$2b$10$kuRIDotgCumxUCixRz9tb.p0O.xKXjjC4plnukxnkwA089vqyLyOW','citizen','5920','2026-04-15 13:08:33',0,'2026-04-15 12:56:12'),(18,'Muhammad Muntakim Rafi ','01640479587','muntakim.rafi.cse@ulab.edu.bd','Hazaribagh Dhaka ','$2b$10$Sx0.97cJUJn2s8OQE3tOoOkP7Gy/IzvnTn5FKSDtPwbq54j/W12HG','citizen',NULL,NULL,1,'2026-04-15 13:07:50'),(19,'Umme promi','01710807454','ummepromi094@gmail.com','Mohammadpur,Dhaka','$2b$10$72h7/h7PJXU3IrUo4O4JaOubc5KByys.28CBMZVVKEszQPtFC4NuK','citizen','5815','2026-04-15 16:17:48',0,'2026-04-15 16:07:37'),(20,'akhi','01567894710','ummsalma96@gmail.com','mohammadpur','$2b$10$6.fVSAw9e4XLNCoi63avm.x0ulWZDSL9aemz4c9y8XGcGEbhTpYoS','citizen',NULL,NULL,0,'2026-04-15 16:18:31'),(21,'Karim','01545678901','ummsalma96@gmail.com','mohammadpur','$2b$10$CNMrvTN/z9VynFAMjPq1.eWNtkQ7ggj2PrB.UucpCUe3jePDSrJHW','citizen','3114','2026-04-15 16:30:03',0,'2026-04-15 16:19:54'),(22,'test name','+880123456789','test@gmail.com','dhaka','$2b$10$8sycBisH8jrpwv8GPOlVrutX7yox6ccaDqVqUSJ4zJy0pHNqPDX4y','citizen','1623','2026-04-16 14:02:35',0,'2026-04-16 13:51:00'),(23,'test name','01974962406','mdfarhan7025@gmail.com','dhaka','$2b$10$cjEngz4w/wLQfBUNmXooqO47/mJqLLYHzUg0TNHSaMbN3N2SisCDq','citizen','7238','2026-04-16 14:03:28',0,'2026-04-16 13:53:24'),(24,'Ramisa khanom','01788888888','ramisa12@gmail.com','Mohammadpur,Dhaka','$2b$10$WkkajHl3M7J55OHGOf.Fw.9owNzKH8Tur8Bg15YuBKlqMXTPh729a','citizen','5977','2026-04-17 05:39:51',0,'2026-04-17 05:29:42'),(25,'MD.MEHRAJUL ISLAM RAMIM','01959453488','sharderramim@gmail.com','Baganbari','$2b$10$DBy5lRe1.7ZfNHT8pB4q/efyB91fm3AItMwOzceAGW0iNPz7qZk9W','citizen','7171','2026-04-18 17:25:06',0,'2026-04-18 17:15:00'),(26,'sourov','0130847231','a7@gmail.com','zigatola,Dhaka','$2b$10$/EcOY/.F5gwoTyY.cx/XZeJmzmbP8MOeOAx1XfoxZvxfOVLrDInnG','citizen','6517','2026-04-18 21:21:38',0,'2026-04-18 21:10:57'),(27,'Sourov','01308472310','ziaul.haque1.cse@ulab.edu.bd','zigatola,Dhaka','$2b$10$/ZV0hpl4tA.cNSAVWbuyD.iD7nz0PggdvZHVPCMuXgxpd6duDClpG','citizen','9415','2026-04-18 21:22:49',0,'2026-04-18 21:12:45'),(28,'Sourov','01406434629','a7@gmail.com','zigatola,Dhaka','$2b$10$ESC4mQ9rHWjn56GAk5fkXuvxUEz.y.er3QUzL043UNrvAX5ylhbui','citizen','6006','2026-04-18 21:25:00',0,'2026-04-18 21:14:57'),(29,'Alvi','1222222','mdalvi987@gmail.com','dha','$2b$10$xJBV08DbeaJIRKu0RR5KI.O8IJiuQpDU.ax.dC1uZIRTkmnyVd6li','citizen','6125','2026-04-19 03:28:52',0,'2026-04-19 03:11:05'),(30,'Ramisa','01710808454','ummepromi094@gmail.com','Mohammadpur,Dhaka','$2b$10$S5BQ7a60xJuOJjPFKLt8Ku84drL7Yb/dNZdiYHL8wRZuppRBnCTIq','citizen','7939','2026-04-21 12:20:48',0,'2026-04-21 12:10:43');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-22 19:09:03
