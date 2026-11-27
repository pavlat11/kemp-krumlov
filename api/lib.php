<?php
/* =====================================================================
   Kemp Krumlov – serverová část (PHP 7.4+ / 8.x, MariaDB)
   Pomocné funkce: nastavení z .env, databáze, tabulky, přihlášení.
   .env leží MIMO web: <kořen FTP>/private/.env (vedle složky www/).
   ===================================================================== */

if (!defined('KK_API')) { http_response_code(403); exit; }

const KK_SCHEMA = 1;

/* ---------------- nastavení (.env) ---------------- */
function kk_env_cesty() {
  $c = [];
  if (getenv('KK_ENV')) $c[] = getenv('KK_ENV');
  $www = dirname(__DIR__);                 // www/
  $c[] = dirname($www) . '/private/.env';  // <kořen>/private/.env (WEDOS)
  $c[] = $www . '/../private/.env';
  $c[] = $www . '/.env';                   // jen pro vývoj na vlastním počítači
  return $c;
}
function kk_env($klic = null, $vychozi = null) {
  static $E = null;
  if ($E === null) {
    $E = [];
    foreach (kk_env_cesty() as $p) {
      if (!is_file($p) || !is_readable($p)) continue;
      foreach (file($p, FILE_IGNORE_NEW_LINES) as $r) {
        $r = trim($r);
        if ($r === '' || $r[0] === '#' || strpos($r, '=') === false) continue;
        list($k, $v) = explode('=', $r, 2);
        $k = trim($k); $v = trim($v);
        if (strlen($v) >= 2 && ($v[0] === '"' || $v[0] === "'") && substr($v, -1) === $v[0]) $v = substr($v, 1, -1);
        else if (($h = strpos($v, ' #')) !== false) $v = rtrim(substr($v, 0, $h));
        $E[$k] = $v;
      }
      break;
    }
  }
  if ($klic === null) return $E;
  return array_key_exists($klic, $E) && $E[$klic] !== '' ? $E[$klic] : $vychozi;
}

/* ---------------- odpovědi ---------------- */
function kk_out($data, $kod = 200) {
  http_response_code($kod);
  header('Content-Type: application/json; charset=utf-8');
  header('Cache-Control: no-store');
  echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}
function kk_chyba($zprava, $kod = 400) { kk_out(['chyba' => $zprava], $kod); }
function kk_vstup() {
  static $V = null;
  if ($V === null) {
    $t = file_get_contents('php://input');
    $V = $t !== '' && $t !== false ? json_decode($t, true) : [];
    if (!is_array($V)) $V = [];
  }
  return $V;
}
function kk_ms() { return (int) round(microtime(true) * 1000); }
function kk_ip() { return substr((string) ($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45); }

/* ---------------- databáze ---------------- */
function kk_pdo($admin = false) {
  $host = kk_env('DB_HOST', 'localhost');
  $port = kk_env('DB_PORT', '3306');
  $dbn  = kk_env('DB_DATABASE', '');
  $u = $admin && kk_env('DB_ADMIN_USERNAME') ? kk_env('DB_ADMIN_USERNAME') : kk_env('DB_USERNAME', '');
  $p = $admin && kk_env('DB_ADMIN_USERNAME') ? kk_env('DB_ADMIN_PASSWORD', '') : kk_env('DB_PASSWORD', '');
  $pdo = new PDO("mysql:host=$host;port=$port;dbname=$dbn;charset=utf8mb4", $u, $p, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
  ]);
  $pdo->exec("SET time_zone = '+00:00'");
  return $pdo;
}
function kk_db() {
  static $db = null;
  if ($db) return $db;
  $db = kk_pdo(false);
  $verze = null;
  try { $verze = (int) $db->query("SELECT v FROM kk_meta WHERE k='schema'")->fetchColumn(); }
  catch (PDOException $e) { $verze = 0; }
  if ($verze < KK_SCHEMA) { kk_instaluj(); }
  return $db;
}

/* tabulky se vytvoří samy při prvním spuštění (uživatelem admin z .env, jinak web) */
function kk_instaluj() {
  try { $a = kk_pdo(true); } catch (PDOException $e) { $a = kk_pdo(false); }
  $T = 'ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_czech_ci';
  $sql = [
    "CREATE TABLE IF NOT EXISTS kk_meta (k VARCHAR(40) NOT NULL PRIMARY KEY, v TEXT NULL) $T",
    "CREATE TABLE IF NOT EXISTS kk_rev (id TINYINT UNSIGNED NOT NULL PRIMARY KEY, r BIGINT UNSIGNED NOT NULL DEFAULT 0) $T",
    // obsah webů a nastavení: klíč → JSON (texty, překlady, ikony, fotky na webu, SEO, ceník, nastavení rezervací …)
    "CREATE TABLE IF NOT EXISTS kk_kv (
       klic VARCHAR(120) NOT NULL PRIMARY KEY,
       hodnota LONGTEXT NULL,
       rev BIGINT UNSIGNED NOT NULL DEFAULT 0,
       upravil VARCHAR(120) NULL,
       updated_at DATETIME NULL,
       KEY kk_kv_rev (rev)) $T",
    // rezervace (ubytování, lodě, doprava) – celý záznam v data, hlavní údaje ve sloupcích kvůli hledání a kontrole obsazenosti
    "CREATE TABLE IF NOT EXISTS kk_rezervace (
       id VARCHAR(40) NOT NULL PRIMARY KEY,
       cislo VARCHAR(30) NULL,
       stav VARCHAR(5) NOT NULL DEFAULT 'pop',
       od DATE NULL,
       `do` DATE NULL,
       jmeno VARCHAR(160) NULL,
       email VARCHAR(190) NULL,
       stok VARCHAR(64) NULL,
       data LONGTEXT NOT NULL,
       smazano TINYINT(1) NOT NULL DEFAULT 0,
       rev BIGINT UNSIGNED NOT NULL DEFAULT 0,
       created_at DATETIME NULL,
       updated_at DATETIME NULL,
       KEY kk_rez_termin (od, `do`),
       KEY kk_rez_cislo (cislo),
       KEY kk_rez_rev (rev)) $T",
    "CREATE TABLE IF NOT EXISTS kk_users (
       id VARCHAR(40) NOT NULL PRIMARY KEY,
       login VARCHAR(60) NOT NULL,
       email VARCHAR(190) NULL,
       jmeno VARCHAR(120) NOT NULL,
       role VARCHAR(10) NOT NULL DEFAULT 'obsluha',
       heslo VARCHAR(255) NOT NULL,
       data LONGTEXT NULL,
       rev BIGINT UNSIGNED NOT NULL DEFAULT 0,
       updated_at DATETIME NULL,
       UNIQUE KEY kk_users_login (login)) $T",
    "CREATE TABLE IF NOT EXISTS kk_historie (
       id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
       kdy BIGINT NOT NULL,
       data LONGTEXT NOT NULL,
       KEY kk_hist_kdy (kdy)) $T",
    "CREATE TABLE IF NOT EXISTS kk_fotky (
       id VARCHAR(40) NOT NULL PRIMARY KEY,
       web VARCHAR(5) NOT NULL DEFAULT 'kemp',
       poradi INT NOT NULL DEFAULT 0,
       data LONGTEXT NOT NULL,
       updated_at DATETIME NULL,
       KEY kk_fotky_web (web, poradi)) $T",
    "CREATE TABLE IF NOT EXISTS kk_limity (
       klic VARCHAR(120) NOT NULL PRIMARY KEY,
       pocet INT UNSIGNED NOT NULL DEFAULT 0,
       do_kdy INT UNSIGNED NOT NULL) $T",
    "INSERT IGNORE INTO kk_rev (id, r) VALUES (1, 0)",
  ];
  foreach ($sql as $s) $a->exec($s);
  $a->prepare("REPLACE INTO kk_meta (k, v) VALUES ('schema', ?)")->execute([(string) KK_SCHEMA]);
}

function kk_rev() {
  $db = kk_db();
  $db->exec("UPDATE kk_rev SET r = LAST_INSERT_ID(r + 1) WHERE id = 1");
  return (int) $db->lastInsertId();
}
function kk_rev_ted() { return (int) kk_db()->query("SELECT r FROM kk_rev WHERE id = 1")->fetchColumn(); }

/* ---------------- ochrana proti zkoušení (počet pokusů za okno) ---------------- */
function kk_limit($klic, $max, $okno) {
  $db = kk_db(); $t = time();
  $db->prepare("DELETE FROM kk_limity WHERE do_kdy < ?")->execute([$t]);
  $db->prepare("INSERT INTO kk_limity (klic, pocet, do_kdy) VALUES (?, 1, ?) ON DUPLICATE KEY UPDATE pocet = pocet + 1")
     ->execute([$klic, $t + $okno]);
  $n = (int) $db->query("SELECT pocet FROM kk_limity WHERE klic = " . $db->quote($klic))->fetchColumn();
  if ($n > $max) kk_chyba('Příliš mnoho pokusů. Zkuste to prosím za chvíli znovu.', 429);
}

/* ---------------- přihlášení (PHP session) ---------------- */
function kk_session($zalozit = false) {
  if (session_status() === PHP_SESSION_ACTIVE) return true;
  $jm = 'kksess';
  if (!$zalozit && empty($_COOKIE[$jm])) return false;
  $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
  session_name($jm);
  session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => $https, 'httponly' => true, 'samesite' => 'Lax']);
  session_start();
  return true;
}
const KK_SESSION_HODIN = 12;
function kk_ja() {
  static $ja = false;
  if ($ja !== false) return $ja;
  $ja = null;
  if (!kk_session(false) || empty($_SESSION['uid'])) return null;
  if (($_SESSION['od'] ?? 0) < time() - KK_SESSION_HODIN * 3600) { kk_odhlas(); return null; }
  $u = kk_uzivatel($_SESSION['uid']);
  if (!$u || (isset($u['data']['aktivni']) && $u['data']['aktivni'] === false)) { kk_odhlas(); return null; }
  $ja = $u;
  return $ja;
}
function kk_odhlas() {
  if (session_status() !== PHP_SESSION_ACTIVE) kk_session(false);
  if (session_status() === PHP_SESSION_ACTIVE) {
    $_SESSION = [];
    setcookie(session_name(), '', ['expires' => time() - 3600, 'path' => '/']);
    session_destroy();
  }
}
function kk_musi() { $j = kk_ja(); if (!$j) kk_chyba('Nejste přihlášen.', 401); return $j; }
function kk_spravce() { $j = kk_musi(); if ($j['role'] !== 'admin') kk_chyba('Jen pro správce.', 403); return $j; }

/* ---------------- uživatelé ---------------- */
function kk_uzivatel($id) {
  $s = kk_db()->prepare("SELECT * FROM kk_users WHERE id = ?");
  $s->execute([$id]);
  $r = $s->fetch();
  if (!$r) return null;
  $r['data'] = json_decode($r['data'] ?: '{}', true) ?: [];
  return $r;
}
/* tvar jako v prohlížeči (kkt.uzivatele) – bez hesla */
function kk_uzivatel_ven($r) {
  $d = $r['data'];
  $o = ['id' => $r['id'], 'jmeno' => $r['jmeno'], 'login' => $r['login'], 'email' => (string) $r['email'], 'role' => $r['role'],
        'aktivni' => !isset($d['aktivni']) || $d['aktivni'] !== false,
        'vzhled' => ($d['vzhled'] ?? 'plna') === 'aplikace' ? 'aplikace' : 'plna',
        'platby' => !isset($d['platby']) || $d['platby'] !== false,
        'souhrny' => !isset($d['souhrny']) || $d['souhrny'] !== false,
        'posledni' => $d['posledni'] ?? null, 'vytvoren' => $d['vytvoren'] ?? null];
  if (!empty($d['vychozi'])) $o['vychozi'] = true;
  if (isset($d['prava']) && is_array($d['prava'])) $o['prava'] = $d['prava'];
  return $o;
}
function kk_uzivatele_ven() {
  $o = [];
  foreach (kk_db()->query("SELECT * FROM kk_users ORDER BY jmeno")->fetchAll() as $r) {
    $r['data'] = json_decode($r['data'] ?: '{}', true) ?: [];
    $o[] = kk_uzivatel_ven($r);
  }
  return $o;
}
/* první spuštění: správce „admin“ s heslem ADMIN_PASSWORD z .env (bez něj se účet nezaloží – web je veřejný) */
function kk_prvni_spravce() {
  $db = kk_db();
  if ((int) $db->query("SELECT COUNT(*) FROM kk_users")->fetchColumn() > 0) return true;
  $heslo = kk_env('ADMIN_PASSWORD');
  if (!$heslo || strlen($heslo) < 8) return false;
  $d = ['aktivni' => true, 'vytvoren' => kk_ms()];
  $db->prepare("INSERT INTO kk_users (id, login, email, jmeno, role, heslo, data, rev, updated_at) VALUES ('u1', 'admin', ?, 'Správce', 'admin', ?, ?, ?, NOW())")
     ->execute([kk_env('ADMIN_EMAIL', ''), password_hash($heslo, PASSWORD_DEFAULT), json_encode($d), kk_rev()]);
  return true;
}
function kk_uloz_uzivatele($u) {
  kk_db()->prepare("UPDATE kk_users SET login = ?, email = ?, jmeno = ?, role = ?, heslo = ?, data = ?, rev = ?, updated_at = NOW() WHERE id = ?")
    ->execute([$u['login'], $u['email'], $u['jmeno'], $u['role'], $u['heslo'], json_encode($u['data'], JSON_UNESCAPED_UNICODE), kk_rev(), $u['id']]);
}
function kk_aktivnich_spravcu() {
  $n = 0;
  foreach (kk_db()->query("SELECT role, data FROM kk_users")->fetchAll() as $r) {
    $d = json_decode($r['data'] ?: '{}', true) ?: [];
    if ($r['role'] === 'admin' && (!isset($d['aktivni']) || $d['aktivni'] !== false)) $n++;
  }
  return $n;
}

/* ---------------- klíče obsahu (stejné jako kkt.* v prohlížeči) ---------------- */
function kk_klic_ok($k) {
  return (bool) preg_match('/^(pela\.)?((texty|dtexty)(\.(en|de))?|ikony|obrazky|seo|galerie|galerie\.kat)$/', $k)
      || in_array($k, ['cenik', 'rez.nast', 'rez.archiv', 'rez.cislo', 'prava'], true);
}
/* klíče, které návštěvník webu nedostane */
function kk_klic_soukromy($k) { return in_array($k, ['rez.archiv', 'rez.cislo', 'prava'], true); }
function kk_kv($klic, $vychozi = null) {
  $s = kk_db()->prepare("SELECT hodnota FROM kk_kv WHERE klic = ?");
  $s->execute([$klic]);
  $v = $s->fetchColumn();
  if ($v === false || $v === null) return $vychozi;
  $d = json_decode($v, true);
  return $d === null ? $vychozi : $d;
}
function kk_kv_uloz($klic, $hodnotaJson, $kdo = null) {
  kk_db()->prepare("INSERT INTO kk_kv (klic, hodnota, rev, upravil, updated_at) VALUES (?, ?, ?, ?, NOW())
                    ON DUPLICATE KEY UPDATE hodnota = VALUES(hodnota), rev = VALUES(rev), upravil = VALUES(upravil), updated_at = NOW()")
    ->execute([$klic, $hodnotaJson, kk_rev(), $kdo]);
}
/* nastavení rezervací pro návštěvníky – poškozené vybavení bez jmen a popisů */
function kk_nast_verejne($json) {
  $n = json_decode($json, true);
  if (!is_array($n)) return $json;
  if (isset($n['poskozeno']) && is_array($n['poskozeno'])) {
    $n['poskozeno'] = array_values(array_map(function ($x) {
      return ['id' => $x['id'] ?? '', 'k' => $x['k'] ?? '', 'ks' => $x['ks'] ?? 0, 'typ' => $x['typ'] ?? 'poskozeno'];
    }, $n['poskozeno']));
  }
  return json_encode($n, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

/* ---------------- rezervace ---------------- */
function kk_datum($s) { return is_string($s) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $s) ? $s : null; }
function kk_rez_uloz($r, $rev = null) {
  if (!is_array($r) || empty($r['id']) || !preg_match('/^[A-Za-z0-9_-]{1,40}$/', (string) $r['id'])) return false;
  $rev = $rev ?: kk_rev();
  kk_db()->prepare("INSERT INTO kk_rezervace (id, cislo, stav, od, `do`, jmeno, email, stok, data, smazano, rev, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, NOW(), NOW())
                    ON DUPLICATE KEY UPDATE cislo = VALUES(cislo), stav = VALUES(stav), od = VALUES(od), `do` = VALUES(`do`), jmeno = VALUES(jmeno),
                      email = VALUES(email), stok = VALUES(stok), data = VALUES(data), smazano = 0, rev = VALUES(rev), updated_at = NOW()")
    ->execute([$r['id'], substr((string) ($r['cislo'] ?? ''), 0, 30), substr((string) ($r['stav'] ?? 'pop'), 0, 5),
               kk_datum($r['od'] ?? null), kk_datum($r['do'] ?? null), mb_substr((string) ($r['jmeno'] ?? ''), 0, 160),
               mb_substr((string) ($r['email'] ?? ''), 0, 190), ($r['stok'] ?? '') !== '' ? substr((string) $r['stok'], 0, 64) : null,
               json_encode($r, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $rev]);
  return true;
}
/* jen to, co web potřebuje ke kontrole obsazenosti míst a vybavení – žádné osobní údaje */
function kk_rez_verejna($r) {
  $o = ['id' => $r['id'] ?? '', 'stav' => $r['stav'] ?? '', 'od' => $r['od'] ?? '', 'do' => $r['do'] ?? '', 'mista' => $r['mista'] ?? []];
  if (!empty($r['lode']) && is_array($r['lode'])) {
    $l = $r['lode'];
    $o['lode'] = ['den' => $l['den'] ?? null, 'dni' => $l['dni'] ?? 1, 'kusy' => $l['kusy'] ?? new stdClass()];
    if (!empty($l['vydano'])) $o['lode']['vydano'] = ['kusy' => $l['vydano']['kusy'] ?? new stdClass()];
    if (!empty($l['vraceno']) && is_array($l['vraceno'])) $o['lode']['vraceno'] = array_map(function ($v) { return ['kusy' => $v['kusy'] ?? new stdClass()]; }, $l['vraceno']);
  }
  return $o;
}
/* noci od ≤ noc < do → [od, do) se překrývá */
function kk_kolize($mista, $od, $do, $krome = null) {
  if (!$mista || !$od || !$do || $od >= $do) return [];
  $s = kk_db()->prepare("SELECT id, data FROM kk_rezervace WHERE smazano = 0 AND stav <> 'zru' AND od < ? AND `do` > ?");
  $s->execute([$do, $od]);
  $ch = [];
  foreach ($s->fetchAll() as $x) {
    if ($krome && $x['id'] === $krome) continue;
    $d = json_decode($x['data'], true) ?: [];
    foreach (array_intersect($mista, $d['mista'] ?? []) as $m) $ch[$m] = 1;
  }
  return array_keys($ch);
}
function kk_misto_ok($m) {
  if (!preg_match('/^(chatka|podsad|teepee)-(\d{1,2})$/', $m, $x)) return false;
  $n = (int) $x[2];
  return ($x[1] === 'chatka' && $n >= 1 && $n <= 21) || ($x[1] === 'podsad' && $n >= 1 && $n <= 11) || ($x[1] === 'teepee' && $n === 1);
}

/* ---------------- soubory (fotky) ---------------- */
function kk_data_dir($pod) {
  $d = dirname(__DIR__) . '/data';
  if (!is_dir($d)) { @mkdir($d, 0755, true); }
  if (!is_file("$d/.htaccess")) @file_put_contents("$d/.htaccess", "# jen obrázky – žádné skripty\n<FilesMatch \"\\.(php|phtml|phar|pl|py|cgi|sh)$\">\n  Require all denied\n</FilesMatch>\nOptions -Indexes\n");
  $p = "$d/$pod";
  if (!is_dir($p)) @mkdir($p, 0755, true);
  return $p;
}
function kk_obrazek($pole, $max = 10485760) {
  if (empty($_FILES[$pole]) || $_FILES[$pole]['error'] !== UPLOAD_ERR_OK) return null;
  $f = $_FILES[$pole];
  if ($f['size'] > $max) kk_chyba('Soubor je moc velký.', 413);
  $i = @getimagesize($f['tmp_name']);
  $typy = ['image/webp' => 'webp', 'image/jpeg' => 'jpg', 'image/png' => 'png'];
  if (!$i || !isset($typy[$i['mime']])) kk_chyba('Soubor není obrázek (WebP, JPG, PNG).', 415);
  return ['tmp' => $f['tmp_name'], 'ext' => $typy[$i['mime']], 'w' => $i[0], 'h' => $i[1], 'size' => $f['size']];
}
function kk_id($p) { return $p . base_convert((string) kk_ms(), 10, 36) . bin2hex(random_bytes(3)); }
