-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: localhost    Database: yumbook
-- ------------------------------------------------------
-- Server version	8.0.32

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

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Сніданок'),(2,'Обід'),(3,'Вечеря'),(4,'Другі страви'),(5,'Десерт'),(6,'Випічка'),(7,'Салати'),(8,'Супи'),(9,'Коктейлі та напої');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories_recipes`
--

DROP TABLE IF EXISTS `categories_recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories_recipes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `recipeId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `relationshipCategoryId_idx` (`categoryId`),
  KEY `relationshipManyRecipeId_idx` (`recipeId`),
  CONSTRAINT `relationshipManyCategoryId` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `relationshipManyRecipeId` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=243 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories_recipes`
--

LOCK TABLES `categories_recipes` WRITE;
/*!40000 ALTER TABLE `categories_recipes` DISABLE KEYS */;
INSERT INTO `categories_recipes` VALUES (181,9,4),(185,2,1),(186,3,1),(191,5,25),(192,6,25),(197,9,12),(210,2,26),(211,3,26),(212,4,26),(213,7,26),(214,2,24),(215,8,24),(216,9,2),(227,5,3),(228,6,3),(230,1,28),(231,2,28),(232,3,28),(233,8,28);
/*!40000 ALTER TABLE `categories_recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cuisines`
--

DROP TABLE IF EXISTS `cuisines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cuisines` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `text` varchar(500) NOT NULL,
  `img` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cuisines`
--

LOCK TABLES `cuisines` WRITE;
/*!40000 ALTER TABLE `cuisines` DISABLE KEYS */;
INSERT INTO `cuisines` VALUES (1,'Загальна','Загальна кухня, містить рецепти, які не належать до певної кухні світу!','1717947120928Golden-Rum-Cake (2).webp'),(2,'Американська','Текст про американську кухню.','1718113877178Golden-Rum-Cake.webp'),(3,'Французька','Французька кухня говорить чи каже \"Bonjour!\"','1717980666942fresh-broccoli-salad.webp'),(4,'Австралійська','Австралійська кухня цікава)','1718113893573apple-cake.webp'),(5,'Гавайська','Гавайська кухня!','1718113977652best-lemonade-ever-step.webp'),(6,'Українська','Така рідна, смачна та різноманітна!','1718113997097Borsh-s-kopenoy-grushey_siteWeb.jpg'),(9,'Італійська','Неперевершено смачна!','1718122336406Homemade-Limoncello-45dde685a2c643cfaf0abf16a61434d4.webp'),(10,'Грецька','Опис грецької кухні.','1718188120011AR-olives-getty-4x3-6cc3cb0c5f86450d83839d798e42261a.webp');
/*!40000 ALTER TABLE `cuisines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `directions`
--

DROP TABLE IF EXISTS `directions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `directions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `text` varchar(500) NOT NULL,
  `img` varchar(500) DEFAULT NULL,
  `recipeId` int NOT NULL,
  `orderNum` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `recipeId_idx` (`recipeId`),
  CONSTRAINT `directionsRecipeId` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=361 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `directions`
--

LOCK TABLES `directions` WRITE;
/*!40000 ALTER TABLE `directions` DISABLE KEYS */;
INSERT INTO `directions` VALUES (248,'Очистіть шкірку з 5 лимонів і наріжте їх скибочками. Відкладіть лимони.','NULL',4,1),(249,'Покладіть шкірки в миску і пересипте їх цукром. Залиште приблизно на годину, щоб цукор почав вбирати лимонні олії.','NULL',4,2),(250,'У закритій каструлі доведіть воду до кипіння, а потім залийте гарячою водою зацукровані лимонні шкірки. Дайте суміші охолонути протягом 20 хвилин, а потім приберіть цедру.','NULL',4,3),(251,'Вичавіть лимони в іншу миску. Вилийте сік через ситечко в цукрову суміш. Добре перемішайте, перелийте в глечик і поставте в холодильник! Подавайте з кубиками льоду.','NULL',4,4),(258,'Розігрійте духовку до 180 °С. Змастіть дно і боки форми для випічки оливковою олією (1 столова ложка).','NULL',1,1),(259,'Розігрійте залишок оливкової олії (1 столова ложка) на середньому вогні у сковороді. Обсмажте часник до появи аромату і золотисто-коричневого кольору. Додайте баклажан та петрушку; готуйте, помішуючи, до м\'якості баклажана, приблизно 10 хвилин. Додайте сіль за смаком.','NULL',1,2),(260,'Рівномірно викладіть баклажанову суміш на дно підготовленої каструлі; посипте 2 стол. ложками пармезану. Рівномірно розподіліть кабачки зверху. Злегка посоліть і посипте сиром. Виккладайте шари в такому порядку: помідори, гриби, цибуля і болг. перець, шари присипаючи сиром, сіллю, перцем.','NULL',1,3),(261,'Запікайте в попередньо розігрітій духовці до м\'якості овочів, приблизно 45 хвилин.','1717317174272ratatouille.webp',1,4),(271,'Ретельно помийте 800 г черешень, видаліть з неї хвостики та кісточки. У велику миску розбийте 4 яйця, додайте 100 г цукру, 10 г ванільного цукру та збийте вінчиком до однорідності.','NULL',25,0),(272,'Поступово, порціями додайте до яєчно-цукрової суміші 200 г борошна та перемішайте так, щоб не залишилося грудочок. Додайте 400 мл молока та знову перемішайте вінчиком. Форму для запікання застеліть пергаментним папером, а сам папір додатково змастіть маслом. Вилийте тісто в підготовлену форму','NULL',25,1),(273,'Зверху викладіть черешні, а в сам центр пирога покладіть зірочку бодяну.','NULL',25,2),(274,'Випікайте клафуті у розігрітій до 180 градусів духовці 50-55 хв.','NULL',25,3),(291,'Зберіть всі інгредієнти.','1718121737841AR-32451-homemade-limoncello-DDMFS-4x3-step-01.webp',12,1),(292,'Зніміть цедру з лимонів і помістіть цедру у велику скляну пляшку або банку.','1718121737848AR-32451-homemade-limoncello.webp',12,2),(293,'Налити в пляшку горілку. Нещільно накрити кришкою і дати настоятися 1 тиждень при кімнатній температурі.','NULL',12,3),(294,'Через 1 тиждень змішайте цукор і воду в середній каструлі та доведіть до кипіння; не перемішувати. Кип\'ятіть 15 хвилин, потім зніміть з вогню і дайте сиропу охолонути до кімнатної температури.','NULL',12,4),(295,'Розмішайте горілчану суміш у сиропі.','NULL',12,5),(296,'Процідити в скляні пляшки, потім закупорити кожну пляшку пробкою. Залишити при кімнатній температурі на 2 тижні.','1718121737857AR-32451-homemade-limoncello-DDMFS-4x3-step-06-b5c8735e5af34484acf6001240354dd9.webp',12,6),(297,'Зберігайте лімончелло в пляшках у морозилці до охолодження. Подавати в охолоджених чарках або склянках.','NULL',12,7),(306,'Зберіть всі інгредієнти. Наріжте м\'ясо.','NULL',26,1),(307,'Викладіть мигдаль на сковороду. Підсмажте на середньому сильному вогні, часто струшуючи. Уважно стежте, оскільки вони легко горять.','NULL',26,2),(308,'Змішайте майонез, лимонний сік і перець у середній мисці.','NULL',26,3),(309,'Змішайте все разом і насолоджуйтесь!','NULL',26,4),(310,'Приготуйте бульйон на буряці. Для цього потрібно почистити буряк, розрізати його навпіл, залити водою і варити 40 хвилин до готовності. Додайте у відвар ½ цибулини і продовжуйте готувати далі.','NULL',24,1),(311,'Далі візьміть 3-4 картоплини, наріжте дрібними кубиками і відправте до бурякового бульйону.','NULL',24,2),(312,'Половину моркви наріжте соломкою та додайте в каструлю до бульйону. Нехай все продовжує варитися.','NULL',24,3),(313,'Приготуйте засмажку. Для цього ½ солодкого перцю і другу половину цибулини наріжте кубиком і припустіть на пательні з 1 ст. л. соняшникової олії протягом 3-5 хвилин. Додайте 2 ст. л. томатної пасти і тушкуйте ще 2-3 хвилини.','NULL',24,4),(314,'Тепер дістаньте з бульйону буряк, дайте йому трохи охолонути і наріжте довільними шматочками. Він дуже гарячий, тому нарізайте дуже акуратно, щоб не обпектися. Поверніть нарізаний буряк у бульйон і туди ж відправте засмажку.','NULL',24,5),(315,'Якщо всі овочі готові, то додайте в борщ 200 г квашеної капусти з розсолом. Проваріть 3 хвилини і пробуйте. Тепер прийшов час довести смак сіллю, перцем і медом – усі інгредієнти до вашого смаку.','NULL',24,6),(316,'Готовий борщ можна залишити на 20 хвилин, щоб він настоявся та наситився ароматами. А можна відправити в духовку з температурою 180 градусів на 15-20 хвилин. Подавати можна відразу ж гарячим.','NULL',24,7),(317,'Зберіть всі інгредієнти.','NULL',2,1),(318,'Змішайте цукор і 1 склянку води в маленькій каструлі. Помішуйте, щоб цукор розчинився, поки суміш не закипить. Відставте трохи охолонути.','NULL',2,2),(319,'Тим часом покатайте лимони на столі, щоб вони розм’якшилися. Розріжте навпіл хрест-навхрест і вичавіть у мірну чашку для рідини. Додайте в сік м’якоть, але викиньте насіння. Продовжуйте вичавлювати сік, доки не отримаєте 1 1/2 склянки свіжого соку та м’якоті.','NULL',2,3),(320,'Налийте в кувшин 7 склянок крижаної води. Перемішайте лимонний сік і м’якоть, потім додайте простий сироп за смаком. Додайте лід.','1717318039429best-lemonade-ever-step.webp',2,4),(340,'Зібрати всі інгредієнти і розігріти духовку до 165°С.','1717320719117Golden-Rum-Cake (2).webp',3,1),(341,'Змастіть і обсипте мукою форму для кекса з кільцем діаметром 25 см. Рівномірно розподіліть нарізані горіхи по дну форми.','NULL',3,2),(342,'Сполучіть суміші для кексу та пудингу у великій мисці. Додайте яйця, 1/2 склянки рому, 1/2 склянки води та олію, доки не отримаєте однорідну масу. Вилейте тісто на горіхи у формі.','1717320719123-Golden-Rum-Cake-ddmfs-step-4.webp',3,3),(343,'Випікайте у передогрітій духовці, поки зубочистка, вставлена в кекс, не вийде чистою, близько 1 години.','1717320719131Golden-Rum-Cake-ddmfs-step-5.webp',3,4),(344,'Тим часом приготуйте глазур: Змішайте цукор, масло та залишок 1/4 склянки води у каструлі. Принесіть до кипіння на середньому вогні; готуйте, постійно помішуючи, поки не загустне і слегка потемніє, близько 5 хвилин. Зніміть з вогню та додайте решту 1/2 склянки рому.','1717320719137Golden-Rum-Cake-ddmfs-step-7.webp',3,5),(345,'Дайте випеченому кексу постояти у формі 10 хвилин, потім вийміть його на подачну тарілку. Помажте глазур\'ю зверху та з боків. Дозвольте кексу вбрати глазур, і повторюйте, поки використаєте всю.','1717320719143Golden-Rum-Cake6.webp',3,6),(348,'Зберіть всі інгредієнти, поріжте навпіл моркву, селеру та цибулю.','NULL',28,1),(349,'Помістіть курку, моркву, селеру та цибулю у велику каструлю для супу; додайте стільки холодної води, щоб покрити. Довести до кипіння на середньому вогні; зменшіть вогонь до мінімуму і тушкуйте, не накриваючи кришкою, доки м’ясо не відпаде від кістки, приблизно 90 хвилин. Знімайте піну час від часу.','NULL',28,2),(350,'Вийміть курку з каструлі і дайте їй постояти, поки вона не охолоне, щоб її можна було обробити; м\'ясо нарізати шматочками, а шкіру і кістки викинути.','NULL',28,3),(351,'Процідіть овочі, залишивши бульйон; промийте каструлю для супу та поверніть бульйон у каструлю. Овочі нарізати невеликими шматочками; поверніть нарізану курку та овочі в каструлю.','NULL',28,4),(352,'Розігрійте суп до нагрівання; приправити сіллю, перцем і курячим бульйоном за смаком.','NULL',28,5),(353,'Подавайте та насолоджуйтесь!','17181798004408814-homemade-chicken-soup-DDMFS-beauty-4x3-31640-924adc63a78543a7822c5704727f6e4b.webp',28,6);
/*!40000 ALTER TABLE `directions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ingredients`
--

DROP TABLE IF EXISTS `ingredients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `recipeId` int NOT NULL,
  `text` varchar(100) NOT NULL DEFAULT '1 ingredient',
  PRIMARY KEY (`id`),
  KEY `recipeId_idx` (`recipeId`),
  CONSTRAINT `ingredientsRecipeId` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=352 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredients`
--

LOCK TABLES `ingredients` WRITE;
/*!40000 ALTER TABLE `ingredients` DISABLE KEYS */;
INSERT INTO `ingredients` VALUES (222,4,'лимон - 5 шт.'),(223,4,'цукор - 1 1/4 склянки'),(224,4,'вода - 1 1/4 склянки'),(231,1,'оливкова олія - 2 ст. л.'),(232,1,'часник - 3 зубчики'),(233,1,'баклажан - 1 штука'),(234,1,'сушена петрушка - 2 ч.л.'),(235,1,'сіль - за смаком'),(236,1,'тертий пармезан - 1 склянка'),(237,1,'кабачок - 2 шт.'),(238,1,'помідор - 2 шт.'),(239,1,'гриб - 10 шт.'),(240,1,'цибуля - 1 шт.'),(241,1,'болгарський перець - 1 шт.'),(252,25,'яйце - 4 шт.'),(253,25,'пшеничне борошно - 200 г'),(254,25,'цукор - 200г'),(255,25,'ванільний цукор - 10 г'),(256,25,'молоко - 400 мл'),(257,25,'черешня - 400 г, без кісточок'),(258,25,'бодян - 1 шт.'),(259,25,'вершкове масло - 10 г'),(269,12,'лимон - 10шт.'),(270,12,'цукор - 3 склянки'),(271,12,'горілка - 1 літр'),(272,12,'вода - 4 склянки'),(285,26,'мигдаль'),(286,26,'майонез'),(287,26,'лимонний сік'),(288,26,'чорний мелений перець'),(289,26,'варене куряче м\'ясо'),(290,26,'стебло селери'),(291,24,'буряк - 1 шт. середнього розміру'),(292,24,'ріпчаста цибуля - 1 шт.'),(293,24,'картопля - 3-4 шт.'),(294,24,'морква - 1/2'),(295,24,'томатна паста - 2 ст. л.'),(296,24,'квашена капуста - 200 г з розсолом'),(297,24,'мед - 1-2 ст. л.'),(298,24,'соняшникова олія - 1 ст. л.'),(299,24,'сіль і перець - до смаку'),(300,2,'цукор - 1/5 склянки'),(301,2,'вода - 1 склянка'),(302,2,'лимон - 9 шт.'),(303,2,'крижана вода - 7 склянок'),(304,2,'лід - за потребою'),(329,3,'волоські горіхи - 2 склянки'),(330,3,'суміш для кексу - 1 упаковка'),(331,3,'суміш для пудингу - 1 упаковка'),(332,3,'велике яйце - 4 шт.'),(333,3,'темний ром - 1 склянка'),(334,3,'вода - 3/4 склянки'),(335,3,'рослинна олія - 1/2 склянки'),(336,3,'цукор - 1 склянка'),(337,3,'масло - 1/2 склянки'),(340,28,'ціла курка - 1 шт.'),(341,28,'морква - 4 шт.'),(342,28,'велика цибуля - 1 шт.'),(343,28,'вода - щоб покрити'),(344,28,'сіль та перець - за смаком');
/*!40000 ALTER TABLE `ingredients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recipes`
--

DROP TABLE IF EXISTS `recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recipes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `userId` int NOT NULL,
  `createdAt` datetime DEFAULT NULL,
  `updatedAt` datetime DEFAULT NULL,
  `confirmedAt` datetime DEFAULT NULL,
  `cuisineId` int NOT NULL,
  `currentRating` float DEFAULT '0',
  `cookTime` int NOT NULL,
  `servings` varchar(45) NOT NULL,
  `difficulty` varchar(10) NOT NULL,
  `intro` varchar(400) NOT NULL,
  `status` enum('Private','Public','Submitted','Rejected','Approved') NOT NULL DEFAULT 'Public',
  `img` varchar(500) DEFAULT NULL,
  `userName` varchar(60) NOT NULL,
  `addInfo` varchar(400) DEFAULT NULL,
  `tmeasure` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `userId_idx` (`userId`),
  KEY `cuisineId_idx` (`cuisineId`),
  CONSTRAINT `cuisineId` FOREIGN KEY (`cuisineId`) REFERENCES `cuisines` (`id`),
  CONSTRAINT `userId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recipes`
--

LOCK TABLES `recipes` WRITE;
/*!40000 ALTER TABLE `recipes` DISABLE KEYS */;
INSERT INTO `recipes` VALUES (1,'Рататуй',4,'2024-06-02 11:32:54','2024-06-11 16:56:08','2024-06-11 16:56:16',3,5,60,'4','Medium','Цей рецепт рататую - моя версія французького овочевого рагу, приготованого зі свіжих помідорів та великої кількості літніх овочів. Це дуже універсальна страва, яка чудово підходить як гарнір або як смачна вегетаріанська основна страва.','Approved','1717317174251ratatouille.webp','Ivanna','','години'),(2,'Найкращий домашній лимонад',4,'2024-06-02 11:47:19','2024-06-12 09:36:16','2024-06-12 09:36:21',1,0,15,'10','Easy','За цим рецептом лимонаду виходить дуже освіжаючий напій!','Approved','1717318039410best-lemonade-ever.webp','Ivanna','','хвилини'),(3,'Золотистий ромовий кекс',1,'2024-06-02 12:31:59','2024-06-13 22:35:00',NULL,2,4,90,'11','Medium','Цей ромовий кекс - улюблений рецепт у нашій родині для спільних посиденьок. Глазур з маслом та ромом робить його особливим!','Public','1717320719097Golden-Rum-Cake.webp','Ivanna','','хвилини'),(4,'Вінтажний лимонад',8,'2024-06-02 15:01:28','2024-06-10 00:52:41','2024-06-10 00:52:48',1,0,65,'4','Easy','Ось як люди робили лимонад у 1800-х роках, ви теж можете це зробити! Це не так складно, а на смак чудово!','Approved','1717329688157445156_Vintage-Lemonade-4x3-195c79927325479bb7848ece5cab897f.webp','Ivanna','','хвилини'),(12,'Лімончелло',4,'2024-06-08 15:50:16','2024-06-11 19:12:36','2024-06-11 19:12:43',9,0,468000,'34','Medium','Лімончелло - лікер зі смаком лимона, який походить з Південної Італії. Він особливо популярний на узбережжі Амальфі, де багато лимонних дерев. Він є другим за популярністю лікером в Італії, після кампарі.','Approved','1718121737799AR-32451-Homemade-Limoncello-DDMFS-4x3-beauty-041e0be8f11f4700b966c1fb364b59b0.webp','Ivanna','','дні'),(24,'Пісний смачний борщ!',1,'2024-06-11 17:09:34','2024-06-11 21:37:01','2024-06-11 21:38:34',6,0,60,'4','Medium','А чи знаєте ви, що в далекі часи всі українці були практично вегетаріанцями, бо м’яса було досить мало та домашніх свиней кололи тільки у свята кілька разів на рік. Тому всі страви були пісними, хіба що зрідка приправлялися смальцем або салом із часником. Страва виходить дуже насиченою за смаком і кольором, а пахне так апетитно, що просто неможливо встояти. ','Approved','1718114974187pisnyj-borshh-polissya-img.jpg','Ivanna','','години'),(25,'Клафуті з черешнею',1,'2024-06-11 17:26:59','2024-06-11 17:26:59','2024-06-11 17:28:00',3,5,1,'6','Easy','Рум’яна скоринка, ніжне тісто та соковита солодка черешня поєднуються у неймовірно смачному французькому пирозі Клафуті. Назва страви та її походження з французької кухні може помилково створити враження, що рецепт складний в приготуванні. Але насправді клафуті — це один з найпростіших видів пирогів, які взагалі існують на світі. ','Approved','1718116019672Clafouti_with_cherries_in_baking_dish_sprinkled_with_powder.png','Ivanna','','години'),(26,'Найкращий салат з куркою!',4,'2024-06-11 19:09:46','2024-06-11 20:11:16','2024-06-11 20:12:01',2,0,5,'2','Easy','Цей рецепт салату з курки – найкращий і улюблений у всій родині! Я люблю використовувати залишки смаженої курки або запечені курячі грудки, посипані базиліком або розмарином.','Approved','17181221864448499-basic-chicken-salad.webp','Ivanna','','хвилини'),(28,'Домашній курячий суп',16,'2024-06-12 11:10:00','2024-06-14 09:35:21','2024-06-14 10:12:14',1,0,120,'10','Medium','Цей рецепт домашнього курячого супу вартий того, щоб його приготувати — він корисний для тіла та душі. Як виходить, що звичайна курка та овочі, притовані разом, можуть бути такими ситними? ','Approved','17181798004218814-homemade-chicken-soup-DDMFS-beauty-4x3-31640-924adc63a78543a7822c5704727f6e4b.webp','Joanna','','години');
/*!40000 ALTER TABLE `recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `recipeId` int NOT NULL,
  `rating` int NOT NULL,
  `text` varchar(500) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `img` varchar(500) DEFAULT NULL,
  `status` enum('Submitted','Approved') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `FKreviewUserId_idx` (`userId`),
  KEY `FKreviewRecipeId_idx` (`recipeId`),
  CONSTRAINT `FKreviewRecipeId` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FKreviewUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,3,4,'Чудовий рецепт. Вся родина була задоволена!','2024-06-02 11:32:54','1717526965393Golden-Rum-Cake-ddmfs-step-7.webp','Approved'),(3,8,3,5,'Такий смачний, просто неперевершений!','2024-06-07 19:08:58','1717776538129Golden-Rum-Cake.webp','Approved'),(4,4,3,3,'Не дуже сподобався, бо надто солодкий, але якщо додавати менше цукру, має бути смачно.','2024-06-07 19:48:55',NULL,'Approved'),(9,1,25,5,'Такий смачний!!','2024-06-11 17:28:26','1718116106911klafuti-img-1000x600.jpg','Approved'),(10,1,2,5,'Освіжає!','2024-06-11 17:39:02','1718116742987445156_Vintage-Lemonade-4x3-195c79927325479bb7848ece5cab897f.webp','Submitted'),(11,1,1,5,'Мені дуже сподобався рецепт, поки сезон, готуватиму!','2024-06-11 17:40:08',NULL,'Approved'),(12,1,24,5,'смачний','2024-06-11 22:05:12',NULL,'Submitted'),(13,16,25,4,'Достатньо смачно, але трохи перебір з цукром. Бодян не додавала, не було.','2024-06-12 12:12:01',NULL,'Submitted'),(14,4,25,4,'Тук-тук','2024-06-12 23:30:28',NULL,'Submitted'),(15,4,25,5,'Тук тук','2024-06-12 23:31:18',NULL,'Submitted'),(16,1,25,5,'tuk','2024-06-12 23:32:22',NULL,'Submitted');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `reviews_AFTER_UPDATE` AFTER UPDATE ON `reviews` FOR EACH ROW BEGIN
    DECLARE totalRating DECIMAL(10,2);
    DECLARE totalReviews INT;
    DECLARE avgRating DECIMAL(10,2);
    
    -- Обчислюємо загальну оцінку і кількість відгуків для даного рецепту
    SELECT SUM(rating), COUNT(*) INTO totalRating, totalReviews
    FROM reviews
    WHERE recipeId = NEW.recipeId AND status = 'Approved';

    -- Обчислюємо середню оцінку
    IF totalReviews > 0 THEN
        SET avgRating = totalRating / totalReviews;
    ELSE
        SET avgRating = 0;
    END IF;

    -- Оновлюємо поле currentRating у таблиці recipes
    UPDATE recipes
    SET currentRating = avgRating
    WHERE id = NEW.recipeId;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `reviews_AFTER_DELETE` AFTER DELETE ON `reviews` FOR EACH ROW BEGIN
DECLARE totalRating DECIMAL(10,2);
    DECLARE totalReviews INT;
    DECLARE avgRating DECIMAL(10,2);
    
    -- Calculate total rating and total reviews for the specific recipe
    SELECT SUM(rating), COUNT(*) INTO totalRating, totalReviews
    FROM reviews
    WHERE recipeId = OLD.recipeId AND status = 'Approved';

    -- Calculate average rating
    IF totalReviews > 0 THEN
        SET avgRating = totalRating / totalReviews;
    ELSE
        SET avgRating = 0;
    END IF;

    -- Update the currentRating field in the recipes table
    UPDATE recipes
    SET currentRating = avgRating
    WHERE id = OLD.recipeId;
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `saved_recipes`
--

DROP TABLE IF EXISTS `saved_recipes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `saved_recipes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userId` int NOT NULL,
  `recipeId` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `favUserId_idx` (`userId`),
  KEY `favRecipeId_idx` (`recipeId`),
  CONSTRAINT `savedRecipeId` FOREIGN KEY (`recipeId`) REFERENCES `recipes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `savedUserId` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `saved_recipes`
--

LOCK TABLES `saved_recipes` WRITE;
/*!40000 ALTER TABLE `saved_recipes` DISABLE KEYS */;
INSERT INTO `saved_recipes` VALUES (36,8,2),(44,1,2),(45,1,1),(46,4,1),(47,4,3),(60,4,4),(61,1,4),(63,16,25),(64,1,24);
/*!40000 ALTER TABLE `saved_recipes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(60) NOT NULL,
  `email` varchar(60) NOT NULL,
  `password` varchar(200) NOT NULL,
  `name` varchar(60) NOT NULL,
  `profilePic` varchar(300) DEFAULT 'profilePic.ipeg',
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `level` enum('Amateur','Home Cook','Expert') DEFAULT 'Amateur',
  `about` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'first1','first1@gmail.com','$2a$10$sUaDEAd8aGxPK8NnRxvKAuP8Sg.WXERxL44n5i7E8K9Z155ldPNFC','Ivanna','1717981074467best-lemonade-ever-step.webp',1,'Expert','Трошки про мене, це зовсім трішки'),(2,'second1','second1@gmail.com','$2a$10$b/mANAHW7VvGsxYqaTdkIejGg.NQliL7qBg5KnHmJkD/nWMgPKSky','Usef','NULL',0,'Amateur','ddddddd'),(3,'third1','third1@gmail.com','$2a$10$4jvjzVHBe3SL7YMTm9o7EeLQjMmC.KVWR.L9HdBUA1txR2ICoY07S','Hanna','NULL',0,'Amateur',NULL),(4,'jocli','joacliff@gmail.com','$2a$10$jMk1Bn.FWhITE8n1.g9d4OnOctkQ/AKK5MiuyZEJFfavxLRK2fbTm','Joanna','1718116885671EI4SZITXkAkNx12.jpg',0,'Home Cook','Привіт :)'),(7,'hanco','hancol@gmail.com','$2a$10$h01Cn4HkGZJNqQUew5Zlbu1JEBuNVdzRdj8/3PGIDo3Ld0/2UzpBq','Hank','NULL',0,'Amateur',NULL),(8,'leco','leocorn@gmail.com','$2a$10$neOtUVnBCBwAuAoFU3zcBOedPnDt2bA4GQoIu/WoWhnO/8uB4xxne','Лео','NULL',0,'Amateur',NULL),(9,'limay','linamay@gmail.com','$2a$10$UE3BTA5vAta25ZQ4O9RvSOeSlCiBxU0N2cLeOv8mKcD1.rC6O7dw6','Lina','NULL',0,'Amateur',NULL),(10,'paulg','paulg@gmail.com','$2a$10$HbUd4tJ514iKwuNpvg4qb.L.x.cXcdathMxPmjyTfW2qpNljfKJ4a','Paul','NULL',0,'Amateur',NULL),(11,'fourth1','fourth1@gmail.com','$2a$10$6Nnw9kEa6krEuMMHazRpcuQ1iosyZLh84ybkJ7mTqJBiEY3vQazAm','Forton','NULL',0,'Amateur',NULL),(12,'lavander','lavander@mail.com','$2a$10$Z26t8hAjxfnx8cAdUe/v4OwtavQj3cA40SaRc9TnB2P8xMQHpsL6i','Amber','NULL',0,'Amateur',NULL),(13,'fifth1','fifth1@gmail.com','$2a$10$nZtZJFRIwmoQFHT24i/JSuGUeyCAd08nMRkYJnWVq4Ts9SO9srPRe','Fifton','NULL',0,'Home Cook',NULL),(15,'postmanuser','postman@gmail.com','$2a$10$ZjHOMDMd/l.E9gCyi4otL.pyJx6NVsBvYl0hFy6g7lDnAooeVzVEi','Postman','NULL',0,'Home Cook',NULL),(16,'chia','chiva@gmail.com','$2a$10$0xYKB/SQfoeazBNbN3WnX./R5z4TjC4VVfPt0rfV22StEfopxrhI6','Іванна Чернова','NULL',0,'Home Cook',NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'yumbook'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-15 16:43:33
