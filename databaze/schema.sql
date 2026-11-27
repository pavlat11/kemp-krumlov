-- =====================================================================
-- Kemp Krumlov + PE-LA – struktura databáze (MariaDB, WEDOS)
--
-- NENÍ POTŘEBA IMPORTOVAT: tabulky si server (api/) vytvoří sám při
-- prvním otevření webu – uživatelem DB_ADMIN_USERNAME z private/.env.
-- Tento soubor je jen pro přehled, případně pro ruční import v phpMyAdminu.
--
-- kk_kv         obsah webů a nastavení (klíč → JSON): texty, překlady, ikony,
--               fotky na webu, SEO, galerie, ceník, nastavení rezervací, práva
-- kk_rezervace  rezervace (ubytování, lodě, doprava) – celý záznam v `data`
-- kk_users      účty administrace (hesla bcrypt)
-- kk_historie   záznam akcí v administraci
-- kk_fotky      galerie (soubory jsou ve www/data/fotky/)
-- kk_limity     ochrana proti zkoušení hesel
-- kk_meta, kk_rev  verze struktury a počítadlo změn
-- =====================================================================

/*M!999999\- enable the sandbox mode */ 

CREATE TABLE IF NOT EXISTS `kk_fotky` (
  `id` varchar(40) NOT NULL,
  `web` varchar(5) NOT NULL DEFAULT 'kemp',
  `poradi` int(11) NOT NULL DEFAULT 0,
  `data` longtext NOT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `kk_fotky_web` (`web`,`poradi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;
CREATE TABLE IF NOT EXISTS `kk_historie` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `kdy` bigint(20) NOT NULL,
  `data` longtext NOT NULL,
  PRIMARY KEY (`id`),
  KEY `kk_hist_kdy` (`kdy`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;
CREATE TABLE IF NOT EXISTS `kk_kv` (
  `klic` varchar(120) NOT NULL,
  `hodnota` longtext DEFAULT NULL,
  `rev` bigint(20) unsigned NOT NULL DEFAULT 0,
  `upravil` varchar(120) DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`klic`),
  KEY `kk_kv_rev` (`rev`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;
CREATE TABLE IF NOT EXISTS `kk_limity` (
  `klic` varchar(120) NOT NULL,
  `pocet` int(10) unsigned NOT NULL DEFAULT 0,
  `do_kdy` int(10) unsigned NOT NULL,
  PRIMARY KEY (`klic`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;
CREATE TABLE IF NOT EXISTS `kk_meta` (
  `k` varchar(40) NOT NULL,
  `v` text DEFAULT NULL,
  PRIMARY KEY (`k`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;
CREATE TABLE IF NOT EXISTS `kk_rev` (
  `id` tinyint(3) unsigned NOT NULL,
  `r` bigint(20) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;
CREATE TABLE IF NOT EXISTS `kk_rezervace` (
  `id` varchar(40) NOT NULL,
  `cislo` varchar(30) DEFAULT NULL,
  `stav` varchar(5) NOT NULL DEFAULT 'pop',
  `od` date DEFAULT NULL,
  `do` date DEFAULT NULL,
  `jmeno` varchar(160) DEFAULT NULL,
  `email` varchar(190) DEFAULT NULL,
  `stok` varchar(64) DEFAULT NULL,
  `data` longtext NOT NULL,
  `smazano` tinyint(1) NOT NULL DEFAULT 0,
  `rev` bigint(20) unsigned NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `kk_rez_termin` (`od`,`do`),
  KEY `kk_rez_cislo` (`cislo`),
  KEY `kk_rez_rev` (`rev`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;
CREATE TABLE IF NOT EXISTS `kk_users` (
  `id` varchar(40) NOT NULL,
  `login` varchar(60) NOT NULL,
  `email` varchar(190) DEFAULT NULL,
  `jmeno` varchar(120) NOT NULL,
  `role` varchar(10) NOT NULL DEFAULT 'obsluha',
  `heslo` varchar(255) NOT NULL,
  `data` longtext DEFAULT NULL,
  `rev` bigint(20) unsigned NOT NULL DEFAULT 0,
  `updated_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `kk_users_login` (`login`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;


INSERT IGNORE INTO kk_rev (id, r) VALUES (1, 0);
REPLACE INTO kk_meta (k, v) VALUES ('schema', '1');
