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
/* návštěvník; u požadavků přes web PE-LA (rez.php) jeho adresa z X-Forwarded-For */
function kk_proxy() { return ($_SERVER['HTTP_X_KK_PROXY'] ?? '') === 'pela'; }
function kk_ip() {
  $ip = (string) ($_SERVER['REMOTE_ADDR'] ?? '');
  if (kk_proxy() && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) $ip = 'pela:' . trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
  return substr($ip, 0, 60);
}

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
  /* přes web PE-LA navíc společný strop, ať ho nejde obejít podvrženou adresou */
  if (kk_proxy() && strpos($klic, 'pela-celkem:') !== 0) kk_limit('pela-celkem:' . explode(':', $klic)[0], $max * 15, $okno);
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
function kk_klic_soukromy($k) { return in_array($k, ['rez.archiv', 'rez.cislo', 'prava', 'cron', 'voda.dny'], true); }
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

/* ---------------- e-maily (SMTP z .env, bez dalších knihoven) ---------------- */
function kk_hlavicka($t) { return '=?UTF-8?B?' . base64_encode($t) . '?='; }
function kk_adresa($email, $jmeno = '') {
  $email = trim(str_replace(["\r", "\n", '<', '>'], '', (string) $email));
  return $jmeno !== '' ? kk_hlavicka($jmeno) . " <$email>" : "<$email>";
}
function kk_mail($komu, $predmet, $html, $text, $odpovedet = '', $obrazky = [], $odJmeno = '') {
  $komu = trim((string) $komu);
  if (!filter_var($komu, FILTER_VALIDATE_EMAIL)) throw new Exception('Neplatná adresa příjemce.');
  $od = kk_env('MAIL_FROM_ADDRESS', kk_env('MAIL_USERNAME', ''));
  if (!filter_var($od, FILTER_VALIDATE_EMAIL)) throw new Exception('Chybí MAIL_FROM_ADDRESS v .env.');
  $predmet = trim(preg_replace('/[\r\n]+/', ' ', (string) $predmet));
  $hr = 'kk' . bin2hex(random_bytes(8));
  $dom = substr(strrchr($od, '@'), 1);
  $h = [
    'Date: ' . date('r'),
    'From: ' . kk_adresa($od, $odJmeno !== '' ? $odJmeno : kk_env('MAIL_FROM_NAME', 'Kemp Krumlov')),
    'To: ' . kk_adresa($komu),
    'Subject: ' . kk_hlavicka($predmet),
    'Message-ID: <' . bin2hex(random_bytes(12)) . '@' . $dom . '>',
    'MIME-Version: 1.0',
    'Content-Type: multipart/alternative; boundary="' . $hr . '"',
  ];
  if ($odpovedet && filter_var($odpovedet, FILTER_VALIDATE_EMAIL)) $h[] = 'Reply-To: ' . kk_adresa($odpovedet);
  $alt = "--$hr\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode((string) $text))
        . "--$hr\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n" . chunk_split(base64_encode((string) $html))
        . "--$hr--\r\n";
  if ($obrazky) {
    /* obrázky vložené do e-mailu (QR platba): multipart/related, v HTML jako cid:<id> */
    $hrR = 'kr' . bin2hex(random_bytes(8));
    foreach ($h as $i => $x) if (strpos($x, 'Content-Type:') === 0) $h[$i] = 'Content-Type: multipart/related; boundary="' . $hrR . '"';
    $telo = "--$hrR\r\nContent-Type: multipart/alternative; boundary=\"$hr\"\r\n\r\n" . $alt;
    foreach ($obrazky as $cid => $o) $telo .= "--$hrR\r\nContent-Type: {$o['typ']}; name=\"$cid.{$o['ext']}\"\r\nContent-Transfer-Encoding: base64\r\nContent-ID: <$cid>\r\nContent-Disposition: inline; filename=\"$cid.{$o['ext']}\"\r\n\r\n" . chunk_split(base64_encode($o['data']));
    $telo .= "--$hrR--\r\n";
  } else $telo = $alt;
  if (kk_env('MAIL_MAILER', 'smtp') === 'mail' || !kk_env('MAIL_HOST')) {
    $hh = array_values(array_filter($h, function ($x) { return strpos($x, 'To: ') !== 0 && strpos($x, 'Subject: ') !== 0; }));
    if (!mail($komu, kk_hlavicka($predmet), $telo, implode("\r\n", $hh), '-f' . $od)) throw new Exception('Odeslání přes mail() selhalo.');
    return true;
  }
  kk_smtp($od, $komu, implode("\r\n", $h) . "\r\n\r\n" . $telo);
  return true;
}
function kk_smtp($od, $komu, $zprava) {
  $host = kk_env('MAIL_HOST'); $port = (int) kk_env('MAIL_PORT', '587');
  $sif = strtolower(kk_env('MAIL_ENCRYPTION', $port === 465 ? 'ssl' : 'tls'));
  $ctx = stream_context_create(['ssl' => ['verify_peer' => true, 'verify_peer_name' => true, 'SNI_enabled' => true, 'peer_name' => $host]]);
  $s = @stream_socket_client(($sif === 'ssl' ? 'ssl://' : 'tcp://') . "$host:$port", $en, $es, 20, STREAM_CLIENT_CONNECT, $ctx);
  if (!$s) throw new Exception("SMTP: nelze se připojit k $host:$port ($es)");
  stream_set_timeout($s, 20);
  $cti = function () use ($s) { $o = ''; while (($r = fgets($s, 1024)) !== false) { $o .= $r; if (strlen($r) < 4 || $r[3] !== '-') break; } return $o; };
  $pis = function ($c, $ok) use ($s, $cti) { if ($c !== null) fwrite($s, $c . "\r\n"); $r = $cti(); if (!in_array(substr($r, 0, 3), (array) $ok, true)) throw new Exception('SMTP: ' . trim($r)); return $r; };
  try {
    $pis(null, '220');
    $ja = 'kemp-krumlov.cz';
    $pis("EHLO $ja", '250');
    if ($sif === 'tls') {
      $pis('STARTTLS', '220');
      if (!stream_socket_enable_crypto($s, true, STREAM_CRYPTO_METHOD_TLSv1_2_CLIENT | (defined('STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT') ? STREAM_CRYPTO_METHOD_TLSv1_3_CLIENT : 0))) throw new Exception('SMTP: TLS se nepodařilo zapnout.');
      $pis("EHLO $ja", '250');
    }
    if (kk_env('MAIL_USERNAME')) {
      $pis('AUTH LOGIN', '334');
      $pis(base64_encode(kk_env('MAIL_USERNAME')), '334');
      $pis(base64_encode(kk_env('MAIL_PASSWORD', '')), '235');
    }
    $pis("MAIL FROM:<$od>", '250');
    $pis("RCPT TO:<$komu>", ['250', '251']);
    $pis('DATA', '354');
    $z = preg_replace('/^\./m', '..', preg_replace("/\r\n|\r|\n/", "\r\n", $zprava));
    $pis($z . "\r\n.", '250');
    $pis('QUIT', ['221', '250']);
  } finally { fclose($s); }
}
/* adresa kempu pro upozornění: Nastavení rezervací → e-mail kempu, jinak KEMP_NOTIFY_EMAIL z .env */
function kk_email_kemp() {
  $n = kk_kv('rez.nast', []);
  $e = trim((string) ($n['emailKemp'] ?? ''));
  return filter_var($e, FILTER_VALIDATE_EMAIL) ? $e : kk_env('KEMP_NOTIFY_EMAIL', kk_env('MAIL_FROM_ADDRESS', ''));
}

/* ---------------- pravidelné úlohy (stav vody, propadlé zálohy) ----------------
   Spouští je samy stránky webu (nejvýš jednou za hodinu, na pozadí),
   případně cron na hostingu: /api/?a=cron&klic=<CRON_KEY z .env> */
function kk_cron_due() { $c = kk_kv('cron', []); return (time() - (int) ($c['kdy'] ?? 0)) > 3000; }
function kk_cron() {
  $db = kk_db();
  if (!(int) $db->query("SELECT GET_LOCK('kk_cron', 0)")->fetchColumn()) return ['bezi' => true];
  if (!kk_cron_due() && empty($GLOBALS['KK_CRON_VZDY'])) return ['brzy' => true];
  kk_kv_uloz('cron', json_encode(['kdy' => time()]), 'Systém');
  $o = [];
  try { $o['voda'] = kk_voda(); } catch (Throwable $e) { $o['voda'] = 'chyba: ' . $e->getMessage(); error_log('KK voda: ' . $e->getMessage()); }
  try { $o['propadle'] = kk_propadle(); } catch (Throwable $e) { $o['propadle'] = 'chyba'; error_log('KK propadle: ' . $e->getMessage()); }
  return $o;
}
/* rezervace se zálohou, která nepřišla do splatnosti → zrušit (e-mail „Rezervace propadla“ pošle administrace) */
function kk_propadle() {
  $db = kk_db(); $dnes = date('Y-m-d'); $n = 0;
  foreach ($db->query("SELECT data FROM kk_rezervace WHERE smazano = 0 AND stav = 'pop'")->fetchAll() as $x) {
    $r = json_decode($x['data'], true);
    $p = $r['platba'] ?? [];
    if (($p['stav'] ?? '') !== 'ceka' || empty($p['splatnost']) || $p['splatnost'] >= $dnes) continue;
    $r['stav'] = 'zru';
    $r['hist'] = array_slice(array_merge((array) ($r['hist'] ?? []), [['t' => kk_ms(), 'kdo' => 'Systém', 'co' => 'Propadla – záloha nepřišla do ' . $p['splatnost']]]), -30);
    kk_rez_uloz($r); $n++;
  }
  return $n;
}
/* ČHMÚ – operativní data (opendata.chmi.cz/hydrology/now/data/), uloží se jako kkt.voda.data pro web */
const KK_VODA_STANICE = [['0-203-1-109000', 'Vyšší Brod'], ['0-203-1-CB110100', 'Český Krumlov']];
function kk_stahni($url) {
  if (function_exists('curl_init')) {
    $c = curl_init($url);
    curl_setopt_array($c, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10, CURLOPT_CONNECTTIMEOUT => 5, CURLOPT_FOLLOWLOCATION => true, CURLOPT_USERAGENT => 'kemp-krumlov.cz']);
    $t = curl_exec($c); $k = curl_getinfo($c, CURLINFO_HTTP_CODE); curl_close($c);
    return $k === 200 ? $t : false;
  }
  return @file_get_contents($url, false, stream_context_create(['http' => ['timeout' => 10, 'header' => "User-Agent: kemp-krumlov.cz\r\n"]]));
}
function kk_voda() {
  $st = []; $dny = kk_kv('voda.dny', []); $cas = '';
  foreach (KK_VODA_STANICE as $i => $s) {
    $t = kk_stahni((getenv('KK_VODA_URL') ?: 'https://opendata.chmi.cz/hydrology/now/data/') . $s[0] . '.json');
    if (!$t) continue;
    $j = json_decode($t, true);
    $ts = [];
    foreach ((array) ($j['objList'][0]['tsList'] ?? []) as $x) $ts[$x['tsConID'] ?? ''] = (array) ($x['tsData'] ?? []);
    $Q = $ts['Q'] ?? []; $H = $ts['H'] ?? []; $T = $ts['TH'] ?? [];
    $posl = function ($a) { for ($k = count($a) - 1; $k >= 0; $k--) if (isset($a[$k]['value']) && $a[$k]['value'] !== null) return $a[$k]; return null; };
    $q = $posl($Q); $h = $posl($H); $tt = $posl($T);
    if (!$q && !$h) continue;
    $tr = 0;
    if ($q && count($Q) > 18) { $pred = $Q[count($Q) - 19]['value'] ?? null; if ($pred) { $d = ($q['value'] - $pred) / max(0.1, $pred); $tr = $d > 0.03 ? 1 : ($d < -0.03 ? -1 : 0); } }
    $st[] = ['n' => $s[1], 'q' => $q ? round($q['value'], 1) : null, 'h' => $h ? (int) round($h['value']) : null, 't' => $tt ? round($tt['value'], 1) : null, 'tr' => $tr];
    if ($i === 0 && $q) {
      $cas = date('H:i', strtotime($q['dt']));
      $sum = 0; $n = 0; foreach ($Q as $x) if (isset($x['value'])) { $sum += $x['value']; $n++; }
      if ($n) $dny[date('Y-m-d', strtotime($q['dt']))] = round($sum / $n, 1);
    }
  }
  if (!$st || $st[0]['q'] === null) return 'bez dat';
  ksort($dny); $dny = array_slice($dny, -7, 7, true);
  kk_kv_uloz('voda.dny', json_encode($dny), 'ČHMÚ');
  $hist = [];
  foreach ($dny as $d => $q) { $t = strtotime($d); $hist[] = ['d' => date('j', $t) . '. ' . date('n', $t) . '.', 'q' => $q]; }
  if (count($hist) < 2) array_unshift($hist, $hist[0]);
  kk_kv_uloz('voda.data', json_encode(['cas' => $cas, 'st' => $st, 'hist' => $hist, 'zdroj' => 'ČHMÚ'], JSON_UNESCAPED_UNICODE), 'ČHMÚ');
  return 'ok';
}

/* ---------------- lodě a vybavení: stejná pravidla jako KKR.lodeChybi v js/cenik.js ---------------- */
const KK_SKLAD0 = ['lode' => ['kanoe' => ['ks' => 30, 'padla' => 2, 'vesty' => 3, 'barely' => 1], 'raft4' => ['ks' => 10, 'padla' => 4, 'vesty' => 4, 'barely' => 1],
  'raft6' => ['ks' => 8, 'padla' => 6, 'vesty' => 6, 'barely' => 2], 'raft8' => ['ks' => 4, 'padla' => 8, 'vesty' => 8, 'barely' => 2], 'baraka' => ['ks' => 6, 'padla' => 2, 'vesty' => 2, 'barely' => 1]],
  'vyb' => ['padla' => 200, 'vesty' => 230, 'barely' => 70]];
const KK_LODE0 = ['kanoe' => 3, 'raft4' => 4, 'raft6' => 6, 'raft8' => 8, 'baraka' => 2];
function kk_sklad($nast) {
  $s = (array) ($nast['sklad'] ?? []);
  $typy = KK_LODE0;
  $c = kk_kv('cenik', null);
  if (is_array($c) && !empty($c['polozky'])) {
    $t = [];
    foreach ($c['polozky'] as $p) if (($p['kat'] ?? '') === 'lode' && ($p['skryt'] ?? 0) !== 1) $t[$p['k']] = (int) ($p['osob'] ?? 2) ?: 2;
    if ($t) $typy = $t;
  }
  $o = ['lode' => [], 'vyb' => array_merge(KK_SKLAD0['vyb'], (array) ($s['vyb'] ?? []))];
  foreach ($typy as $k => $os) $o['lode'][$k] = array_merge(['ks' => 0, 'padla' => $os, 'vesty' => $os, 'barely' => 1], KK_SKLAD0['lode'][$k] ?? [], (array) ($s['lode'][$k] ?? []));
  return $o;
}
function kk_lode_dny($l) {
  $r = []; if (empty($l['den'])) return $r;
  $t = strtotime($l['den']); $n = max(1, (int) ($l['dni'] ?? 1));
  for ($i = 0; $i < $n && $i < 60; $i++) $r[] = date('Y-m-d', strtotime("+$i day", $t));
  return $r;
}
function kk_lode_pocet($l) { $n = 0; foreach ((array) ($l['kusy'] ?? []) as $v) $n += (int) $v; return $n; }
function kk_lode_potreba($l, $S) {
  $o = ['padla' => 0, 'vesty' => 0, 'barely' => 0];
  foreach ((array) ($l['kusy'] ?? []) as $k => $n) { $n = (int) $n; if (!$n) continue; $o[$k] = ($o[$k] ?? 0) + $n;
    if (isset($S['lode'][$k])) { $t = $S['lode'][$k]; $o['padla'] += $n * (int) $t['padla']; $o['vesty'] += $n * (int) $t['vesty']; $o['barely'] += $n * (int) $t['barely']; } }
  return $o;
}
function kk_lode_ven($r) {
  $l = $r['lode'] ?? []; $o = []; if (empty($l['vydano'])) return $o;
  foreach ((array) ($l['vydano']['kusy'] ?? []) as $k => $v) $o[$k] = (int) $v;
  foreach ((array) ($l['vraceno'] ?? []) as $v) foreach ((array) ($v['kusy'] ?? []) as $k => $x) $o[$k] = ($o[$k] ?? 0) - (int) $x;
  return array_filter($o, function ($x) { return $x > 0; });
}
/* vrací seznam toho, co chybí (prázdné = je dost) */
function kk_lode_chybi($l) {
  if (!is_array($l) || !kk_lode_pocet($l) || empty($l['den'])) return [];
  $nast = kk_kv('rez.nast', []); $S = kk_sklad($nast);
  $cel = $S['vyb']; foreach ($S['lode'] as $k => $t) $cel[$k] = (int) $t['ks'];
  foreach ((array) ($nast['poskozeno'] ?? []) as $x) if (!empty($x['k']) && (int) ($x['ks'] ?? 0) > 0 && isset($cel[$x['k']])) $cel[$x['k']] = max(0, $cel[$x['k']] - (int) $x['ks']);
  $dny = kk_lode_dny($l); $dnes = date('Y-m-d');
  $rez = [];
  $s = kk_db()->prepare("SELECT data FROM kk_rezervace WHERE smazano = 0 AND stav <> 'zru' AND (`do` IS NULL OR `do` >= ?)");
  $s->execute([date('Y-m-d', strtotime(min($dny[0], $dnes) . ' -70 days'))]);
  foreach ($s->fetchAll() as $x) { $r = json_decode($x['data'], true); if (!empty($r['lode']) && kk_lode_pocet($r['lode'])) $rez[] = $r; }
  $volno = $cel;
  foreach ($dny as $d) {
    $obs = [];
    foreach ($rez as $r) {
      $dn = kk_lode_dny($r['lode']); if (!$dn) continue; $v = !empty($r['lode']['vydano']); $p = null;
      if ($v && $d === $dnes && $d >= $dn[0]) $p = kk_lode_ven($r);
      else if (in_array($d, $dn, true)) $p = kk_lode_potreba($r['lode'], $S);
      else if ($v && $d > end($dn) && $d <= $dnes) $p = kk_lode_ven($r);
      if ($p) foreach ($p as $k => $n) $obs[$k] = ($obs[$k] ?? 0) + (int) $n;
    }
    foreach ($cel as $k => $c) $volno[$k] = min($volno[$k], $c - ($obs[$k] ?? 0));
  }
  $ch = [];
  foreach (kk_lode_potreba($l, $S) as $k => $n) if ($n > ($volno[$k] ?? 0)) $ch[] = $k;
  return $ch;
}
