-- =====================================================================
-- Kemp Krumlov + PE-LA – struktura databáze (MariaDB 10.11, WEDOS)
-- Databáze: d408445_krumlov
--
-- Import: https://pma.wedos.net/ → přihlásit jako a408445_krumlov (admin)
--         → vybrat d408445_krumlov → Import → vybrat tento soubor → Import.
-- Soubor jde spustit opakovaně: tabulky, které už existují, nechá být
-- a výchozí místa jen doplní.
--
-- Návrh vychází z admin/NAPOJENI-NA-SERVER.md. Složitější struktury,
-- se kterými už pracuje web (ceník, nastavení rezervací, lodě, doprava,
-- platba), zůstávají jako JSON ve stejném tvaru jako teď v náhledu.
-- =====================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- UŽIVATELÉ A PŘIHLÁŠENÍ (tvar podle Laravelu)
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
  id                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  jmeno                 VARCHAR(120)    NOT NULL,
  login                 VARCHAR(60)     NOT NULL,
  email                 VARCHAR(190)    NULL,
  password              VARCHAR(255)    NOT NULL COMMENT 'bcrypt',
  role                  ENUM('admin','obsluha') NOT NULL DEFAULT 'obsluha',
  aktivni               TINYINT(1)      NOT NULL DEFAULT 1,
  vzhled                ENUM('aplikace','plna') NOT NULL DEFAULT 'plna',
  prava                 JSON            NULL COMMENT 'sekce povolené obsluze, např. ["ubytovani","pujcovna"]',
  platby                TINYINT(1)      NOT NULL DEFAULT 0 COMMENT 'smí potvrzovat zálohy a doplatky',
  souhrny               TINYINT(1)      NOT NULL DEFAULT 1 COMMENT 'smí vidět tržby a kalkulace',
  posledni_prihlaseni   TIMESTAMP       NULL,
  remember_token        VARCHAR(100)    NULL,
  created_at            TIMESTAMP       NULL,
  updated_at            TIMESTAMP       NULL,
  PRIMARY KEY (id),
  UNIQUE KEY users_login_unique (login),
  UNIQUE KEY users_email_unique (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  email       VARCHAR(190) NOT NULL,
  token       VARCHAR(255) NOT NULL,
  created_at  TIMESTAMP    NULL,
  PRIMARY KEY (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  id             VARCHAR(255)    NOT NULL,
  user_id        BIGINT UNSIGNED NULL,
  ip_address     VARCHAR(45)     NULL,
  user_agent     TEXT            NULL,
  payload        LONGTEXT        NOT NULL,
  last_activity  INT             NOT NULL,
  PRIMARY KEY (id),
  KEY sessions_user_id_index (user_id),
  KEY sessions_last_activity_index (last_activity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cache (
  `key`       VARCHAR(255) NOT NULL,
  value       MEDIUMTEXT   NOT NULL,
  expiration  INT          NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS cache_locks (
  `key`       VARCHAR(255) NOT NULL,
  owner       VARCHAR(255) NOT NULL,
  expiration  INT          NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- fronta e-mailů (odesílání na pozadí)
CREATE TABLE IF NOT EXISTS jobs (
  id            BIGINT UNSIGNED  NOT NULL AUTO_INCREMENT,
  queue         VARCHAR(255)     NOT NULL,
  payload       LONGTEXT         NOT NULL,
  attempts      TINYINT UNSIGNED NOT NULL,
  reserved_at   INT UNSIGNED     NULL,
  available_at  INT UNSIGNED     NOT NULL,
  created_at    INT UNSIGNED     NOT NULL,
  PRIMARY KEY (id),
  KEY jobs_queue_index (queue)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS failed_jobs (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid        VARCHAR(255)    NOT NULL,
  connection  TEXT            NOT NULL,
  queue       TEXT            NOT NULL,
  payload     LONGTEXT        NOT NULL,
  exception   LONGTEXT        NOT NULL,
  failed_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY failed_jobs_uuid_unique (uuid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- pokusy o přihlášení / storno z jedné IP (ochrana proti zkoušení hesel)
CREATE TABLE IF NOT EXISTS limity (
  klic      VARCHAR(190) NOT NULL COMMENT 'např. login:1.2.3.4, storno:1.2.3.4',
  pokusy    INT UNSIGNED NOT NULL DEFAULT 0,
  do_kdy    TIMESTAMP    NOT NULL,
  PRIMARY KEY (klic)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------
-- NASTAVENÍ (klíč → JSON)
--   cenik          celý ceník (formát KKC.vychozi v js/cenik.js) – společný pro kemp i PE-LA
--   rezervace      nastavení rezervací: rezim, vyp, zaloha, sklad, sablony,
--                  emailKemp, storno, voda, autoMail, recenzeUrl …
--   ikony.kemp / ikony.pela   přepsané ikony
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS nastaveni (
  klic        VARCHAR(60)     NOT NULL,
  hodnota     JSON            NOT NULL,
  upravil_id  BIGINT UNSIGNED NULL,
  updated_at  TIMESTAMP       NULL,
  PRIMARY KEY (klic),
  CONSTRAINT nastaveni_upravil_fk FOREIGN KEY (upravil_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

-- ---------------------------------------------------------------------
-- OBSAH WEBŮ (kemp | pela, jazyky cs | en | de)
-- ---------------------------------------------------------------------

-- texty s klíčem data-t="sekce.cislo"
CREATE TABLE IF NOT EXISTS texty (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  web         ENUM('kemp','pela') NOT NULL DEFAULT 'kemp',
  jazyk       CHAR(2)         NOT NULL DEFAULT 'cs',
  klic        VARCHAR(120)    NOT NULL,
  html        MEDIUMTEXT      NOT NULL,
  upravil_id  BIGINT UNSIGNED NULL,
  created_at  TIMESTAMP       NULL,
  updated_at  TIMESTAMP       NULL,
  PRIMARY KEY (id),
  UNIQUE KEY texty_web_jazyk_klic_unique (web, jazyk, klic),
  CONSTRAINT texty_upravil_fk FOREIGN KEY (upravil_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

-- texty ze skriptů, map a animací: {"původní český text": "nový"}
CREATE TABLE IF NOT EXISTS prepisy_texty (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  web         ENUM('kemp','pela') NOT NULL DEFAULT 'kemp',
  jazyk       CHAR(2)         NOT NULL DEFAULT 'cs',
  puvodni_hash CHAR(64)       NOT NULL COMMENT 'SHA-256 z puvodni (kvůli unikátnímu klíči)',
  puvodni     TEXT            NOT NULL,
  text        TEXT            NOT NULL,
  upravil_id  BIGINT UNSIGNED NULL,
  created_at  TIMESTAMP       NULL,
  updated_at  TIMESTAMP       NULL,
  PRIMARY KEY (id),
  UNIQUE KEY prepisy_texty_unique (web, jazyk, puvodni_hash),
  CONSTRAINT prepisy_texty_upravil_fk FOREIGN KEY (upravil_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

-- nahrazené fotky v sekcích webu: původní cesta → nový soubor
CREATE TABLE IF NOT EXISTS prepisy_fotky (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  web         ENUM('kemp','pela') NOT NULL DEFAULT 'kemp',
  cesta       VARCHAR(255)    NOT NULL COMMENT 'např. img/chatka.webp',
  soubor      VARCHAR(255)    NOT NULL,
  verze       INT UNSIGNED    NOT NULL DEFAULT 1,
  upravil_id  BIGINT UNSIGNED NULL,
  created_at  TIMESTAMP       NULL,
  updated_at  TIMESTAMP       NULL,
  PRIMARY KEY (id),
  UNIQUE KEY prepisy_fotky_unique (web, cesta),
  CONSTRAINT prepisy_fotky_upravil_fk FOREIGN KEY (upravil_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

-- SEO každého webu (objekt jako KK.SEO_VYCHOZI)
CREATE TABLE IF NOT EXISTS seo (
  web         ENUM('kemp','pela') NOT NULL,
  jazyk       CHAR(2)         NOT NULL DEFAULT 'cs',
  data        JSON            NOT NULL,
  upravil_id  BIGINT UNSIGNED NULL,
  updated_at  TIMESTAMP       NULL,
  PRIMARY KEY (web, jazyk),
  CONSTRAINT seo_upravil_fk FOREIGN KEY (upravil_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

-- galerie
CREATE TABLE IF NOT EXISTS fotky (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  web         ENUM('kemp','pela') NOT NULL DEFAULT 'kemp',
  soubor      VARCHAR(255)    NOT NULL COMMENT 'WebP max 1920 px',
  nahled      VARCHAR(255)    NOT NULL COMMENT 'WebP 640 px',
  popis       VARCHAR(500)    NULL,
  popis_en    VARCHAR(500)    NULL,
  popis_de    VARCHAR(500)    NULL,
  kat         VARCHAR(40)     NULL,
  poradi      INT             NOT NULL DEFAULT 0,
  viditelna   TINYINT(1)      NOT NULL DEFAULT 1,
  sirka       SMALLINT UNSIGNED NULL,
  vyska       SMALLINT UNSIGNED NULL,
  velikost    INT UNSIGNED    NULL COMMENT 'bajty',
  pridal_id   BIGINT UNSIGNED NULL,
  created_at  TIMESTAMP       NULL,
  updated_at  TIMESTAMP       NULL,
  PRIMARY KEY (id),
  KEY fotky_web_poradi_index (web, poradi),
  CONSTRAINT fotky_pridal_fk FOREIGN KEY (pridal_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

-- ---------------------------------------------------------------------
-- UBYTOVÁNÍ: místa
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS mista (
  id       VARCHAR(20)     NOT NULL COMMENT 'chatka-1 … chatka-20, podsad-1 … podsad-11, teepee-1',
  typ      ENUM('chatka','podsad','teepee') NOT NULL,
  cislo    SMALLINT UNSIGNED NOT NULL,
  skupina  VARCHAR(10)     NOT NULL COMMENT 'cn, cd, cl, ps, tp (KKR.SKUPINY)',
  poradi   SMALLINT        NOT NULL DEFAULT 0,
  aktivni  TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '0 = vypnuté místo (nastaveni.vyp)',
  PRIMARY KEY (id),
  UNIQUE KEY mista_typ_cislo_unique (typ, cislo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

-- ---------------------------------------------------------------------
-- REZERVACE (ubytování, lodě, doprava v jedné rezervaci)
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS rezervace (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  cislo          VARCHAR(20)     NOT NULL COMMENT 'R2027-0001',
  stav           ENUM('pop','pot','uby','odj','zru','blk') NOT NULL DEFAULT 'pop'
                 COMMENT 'poptávka, potvrzená, ubytovaný, odjel, zrušená, blokace',
  od             DATE            NOT NULL COMMENT 'příjezd / první den půjčení',
  `do`           DATE            NOT NULL COMMENT 'odjezd (den odjezdu je volný) / poslední den',
  prijezd        VARCHAR(40)     NULL COMMENT 'čas příjezdu, např. 14–16',

  osoby_dosp     SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  osoby_dite     SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  osoby_zak      SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  dalsi          JSON            NULL COMMENT '{stan, karavan} – vlastní stany a karavany',
  doplnky        JSON            NULL COMMENT '{auto:2, elek:1, pes:1}',

  lode           JSON            NULL COMMENT '{den, dni, kusy:{kanoe:2}, odkud, kam, vydano, vraceno[]}',
  lode_den       DATE            NULL COMMENT 'kopie lode.den kvůli vyhledávání',
  lode_dni       TINYINT UNSIGNED NULL COMMENT 'kopie lode.dni',
  doprava        JSON            NULL COMMENT '{misto, osob, cas, den, hotovo}',
  vyzved         JSON            NULL COMMENT '{misto, osob, cas, den, hotovo}',
  poskozeno      JSON            NULL,

  jmeno          VARCHAR(160)    NOT NULL DEFAULT '',
  telefon        VARCHAR(40)     NULL,
  email          VARCHAR(190)    NULL,
  zprava         TEXT            NULL,
  jazyk          CHAR(2)         NOT NULL DEFAULT 'cs',
  zdroj          ENUM('web','rucne') NOT NULL DEFAULT 'web',

  cena           DECIMAL(10,2)   NOT NULL DEFAULT 0 COMMENT 'Kč, bez návozu lodí',
  platba_stav    ENUM('ceka','zal','vse') NULL COMMENT 'čeká na zálohu, záloha zaplacena, zaplaceno vše',
  zaloha         DECIMAL(10,2)   NULL,
  splatnost      DATE            NULL,
  zaplaceno_kdy  TIMESTAMP       NULL,
  vs             VARCHAR(10)     NULL COMMENT 'variabilní symbol',

  stok           VARCHAR(64)     NULL COMMENT 'klíč pro zrušení hostem (storno.html), po zrušení NULL',
  storno_host    TINYINT(1)      NOT NULL DEFAULT 0,
  storno_duvod   VARCHAR(500)    NULL,
  maily          JSON            NULL COMMENT 'odeslané automatické e-maily {predPrijezdem: čas, …}',

  archiv         SMALLINT UNSIGNED NULL COMMENT 'rok uzavřené sezóny; NULL = aktuální',
  vytvoril_id    BIGINT UNSIGNED NULL COMMENT 'NULL = z webu',
  created_at     TIMESTAMP       NULL,
  updated_at     TIMESTAMP       NULL,

  PRIMARY KEY (id),
  UNIQUE KEY rezervace_cislo_unique (cislo),
  KEY rezervace_termin_index (od, `do`),
  KEY rezervace_stav_index (stav),
  KEY rezervace_lode_index (lode_den),
  KEY rezervace_platba_index (platba_stav, splatnost),
  KEY rezervace_archiv_index (archiv),
  KEY rezervace_email_index (email),
  CONSTRAINT rezervace_vytvoril_fk FOREIGN KEY (vytvoril_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

-- která místa rezervace zabírá
CREATE TABLE IF NOT EXISTS rezervace_mista (
  rezervace_id  BIGINT UNSIGNED NOT NULL,
  misto_id      VARCHAR(20)     NOT NULL,
  PRIMARY KEY (rezervace_id, misto_id),
  KEY rezervace_mista_misto_index (misto_id),
  CONSTRAINT rezervace_mista_rez_fk FOREIGN KEY (rezervace_id) REFERENCES rezervace (id) ON DELETE CASCADE,
  CONSTRAINT rezervace_mista_misto_fk FOREIGN KEY (misto_id) REFERENCES mista (id) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

-- číslování rezervací po letech (R2027-0001); zápis v transakci FOR UPDATE
CREATE TABLE IF NOT EXISTS cisla_rezervaci (
  rok       SMALLINT UNSIGNED NOT NULL,
  posledni  INT UNSIGNED      NOT NULL DEFAULT 0,
  PRIMARY KEY (rok)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- historie: vše, co se s rezervací (a v administraci) stalo; slouží i pro „Vrátit zpět“
CREATE TABLE IF NOT EXISTS historie (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  rezervace_id  BIGINT UNSIGNED NULL,
  user_id       BIGINT UNSIGNED NULL,
  kdo           VARCHAR(120)    NULL COMMENT 'jméno v okamžiku změny (host / systém / obsluha)',
  oblast        VARCHAR(30)     NOT NULL DEFAULT 'rezervace' COMMENT 'rezervace, cenik, texty, uzivatele, nastaveni …',
  akce          VARCHAR(40)     NOT NULL COMMENT 'vytvoreno, stav, presun, platba, vydano, vraceno, email …',
  popis         VARCHAR(500)    NULL,
  pred          JSON            NULL COMMENT 'stav před změnou (pro Vrátit zpět)',
  po            JSON            NULL,
  ip            VARCHAR(45)     NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY historie_rezervace_index (rezervace_id, created_at),
  KEY historie_user_index (user_id, created_at),
  KEY historie_oblast_index (oblast, created_at),
  CONSTRAINT historie_rez_fk FOREIGN KEY (rezervace_id) REFERENCES rezervace (id) ON DELETE SET NULL,
  CONSTRAINT historie_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

-- ---------------------------------------------------------------------
-- PŮJČOVNA: poškozené / ztracené vybavení
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS poskozeni (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  polozka       VARCHAR(30)     NOT NULL COMMENT 'kanoe, raft4, padla, vesty, barely …',
  ks            SMALLINT UNSIGNED NOT NULL DEFAULT 1,
  typ           ENUM('poskozeno','ztraceno') NOT NULL DEFAULT 'poskozeno',
  popis         VARCHAR(500)    NULL,
  rezervace_id  BIGINT UNSIGNED NULL,
  nahlasil_id   BIGINT UNSIGNED NULL,
  opraveno_kdy  TIMESTAMP       NULL COMMENT 'NULL = pořád mimo provoz',
  opravil_id    BIGINT UNSIGNED NULL,
  created_at    TIMESTAMP       NULL,
  updated_at    TIMESTAMP       NULL,
  PRIMARY KEY (id),
  KEY poskozeni_otevrene_index (opraveno_kdy, polozka),
  CONSTRAINT poskozeni_rez_fk FOREIGN KEY (rezervace_id) REFERENCES rezervace (id) ON DELETE SET NULL,
  CONSTRAINT poskozeni_nahlasil_fk FOREIGN KEY (nahlasil_id) REFERENCES users (id) ON DELETE SET NULL,
  CONSTRAINT poskozeni_opravil_fk FOREIGN KEY (opravil_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

-- ---------------------------------------------------------------------
-- SEZÓNY (uzavření a archiv)
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS sezony (
  rok           SMALLINT UNSIGNED NOT NULL,
  uzavreno_kdy  TIMESTAMP       NULL,
  uzavrel_id    BIGINT UNSIGNED NULL,
  souhrn        JSON            NULL COMMENT 'rezervací, nocí, hostů, lodí, tržby, zrušených',
  PRIMARY KEY (rok),
  CONSTRAINT sezony_uzavrel_fk FOREIGN KEY (uzavrel_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci;

-- ---------------------------------------------------------------------
-- STAV VODY NA VLTAVĚ (ČHMÚ, cron každou hodinu)
-- ---------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS voda (
  id        BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  stanice   VARCHAR(20)     NOT NULL COMMENT 'objekt ČHMÚ, např. 307036 = Vyšší Brod',
  cas       DATETIME        NOT NULL,
  stav_cm   SMALLINT        NULL,
  prutok    DECIMAL(8,2)    NULL COMMENT 'm³/s',
  teplota   DECIMAL(4,1)    NULL COMMENT '°C',
  PRIMARY KEY (id),
  UNIQUE KEY voda_stanice_cas_unique (stanice, cas)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
-- VÝCHOZÍ DATA: místa v kempu (KKR.SKUPINY)
-- =====================================================================

INSERT IGNORE INTO mista (id, typ, cislo, skupina, poradi) VALUES
  ('chatka-1','chatka',1,'cn',1),  ('chatka-2','chatka',2,'cn',2),  ('chatka-3','chatka',3,'cn',3),
  ('chatka-4','chatka',4,'cn',4),  ('chatka-5','chatka',5,'cn',5),
  ('chatka-6','chatka',6,'cd',6),  ('chatka-7','chatka',7,'cd',7),  ('chatka-8','chatka',8,'cd',8),
  ('chatka-9','chatka',9,'cd',9),  ('chatka-10','chatka',10,'cd',10),
  ('chatka-11','chatka',11,'cl',11),('chatka-12','chatka',12,'cl',12),('chatka-13','chatka',13,'cl',13),
  ('chatka-14','chatka',14,'cl',14),('chatka-15','chatka',15,'cl',15),('chatka-16','chatka',16,'cl',16),
  ('chatka-17','chatka',17,'cl',17),('chatka-18','chatka',18,'cl',18),('chatka-19','chatka',19,'cl',19),
  ('chatka-20','chatka',20,'cl',20),
  ('podsad-1','podsad',1,'ps',21), ('podsad-2','podsad',2,'ps',22), ('podsad-3','podsad',3,'ps',23),
  ('podsad-4','podsad',4,'ps',24), ('podsad-5','podsad',5,'ps',25), ('podsad-6','podsad',6,'ps',26),
  ('podsad-7','podsad',7,'ps',27), ('podsad-8','podsad',8,'ps',28), ('podsad-9','podsad',9,'ps',29),
  ('podsad-10','podsad',10,'ps',30),('podsad-11','podsad',11,'ps',31),
  ('teepee-1','teepee',1,'tp',32);
