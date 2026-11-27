<?php
/* =====================================================================
   Kemp Krumlov – API   (adresa: /api/?a=<akce>)
   Web i administrace ukládají data přes js/server.js do této databáze.
   ===================================================================== */
define('KK_API', 1);
ini_set('display_errors', '0');
require __DIR__ . '/lib.php';

date_default_timezone_set(kk_env('APP_TIMEZONE', 'Europe/Prague'));
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex');

$A = preg_replace('/[^a-z_]/', '', (string) ($_GET['a'] ?? ''));
$POST = $_SERVER['REQUEST_METHOD'] === 'POST';
/* zápisy jen z vlastních stránek (vlastní hlavička = prohlížeč ji z cizího webu bez povolení nepošle) */
if ($POST && ($_SERVER['HTTP_X_KK'] ?? '') !== '1') kk_chyba('Neplatný požadavek.', 403);

try {
  if (!kk_env('DB_DATABASE')) kk_chyba('Server není nastavený (chybí private/.env).', 503);
  $db = kk_db();

  switch ($A) {

  /* ---------- stav serveru ---------- */
  case 'stav':
    kk_out(['ok' => true, 'schema' => KK_SCHEMA, 'rev' => kk_rev_ted()]);

  /* ---------- načtení všech dat při otevření stránky ---------- */
  case 'data':
    kk_prvni_spravce();
    $ja = kk_ja();
    $o = [];
    foreach ($db->query("SELECT klic, hodnota FROM kk_kv WHERE hodnota IS NOT NULL")->fetchAll() as $r) {
      if (!$ja && kk_klic_soukromy($r['klic'])) continue;
      $o[$r['klic']] = !$ja && $r['klic'] === 'rez.nast' ? kk_nast_verejne($r['hodnota']) : $r['hodnota'];
    }
    $rez = [];
    if ($ja) {
      foreach ($db->query("SELECT data FROM kk_rezervace WHERE smazano = 0 ORDER BY od, id")->fetchAll() as $r) $rez[] = json_decode($r['data'], true);
      $o['uzivatele'] = json_encode(kk_uzivatele_ven(), JSON_UNESCAPED_UNICODE);
      $o['session'] = json_encode(['id' => $ja['id'], 'jmeno' => $ja['jmeno'], 'role' => $ja['role'], 'od' => ($_SESSION['od'] ?? time()) * 1000, 'do' => (($_SESSION['od'] ?? time()) + KK_SESSION_HODIN * 3600) * 1000], JSON_UNESCAPED_UNICODE);
      $h = [];
      foreach ($db->query("SELECT data FROM kk_historie ORDER BY kdy DESC, id DESC LIMIT 2000")->fetchAll() as $r) $h[] = json_decode($r['data'], true);
      $o['historie'] = json_encode($h, JSON_UNESCAPED_UNICODE);
    } else {
      $s = $db->prepare("SELECT data FROM kk_rezervace WHERE smazano = 0 AND stav <> 'zru' AND (`do` IS NULL OR `do` >= ?)");
      $s->execute([date('Y-m-d', strtotime('-40 days'))]);
      foreach ($s->fetchAll() as $r) $rez[] = kk_rez_verejna(json_decode($r['data'], true) ?: []);
      /* stránka storno.html: host otevřel odkaz z e-mailu → jeho rezervace celá */
      $rid = (string) ($_GET['r'] ?? ''); $rk = (string) ($_GET['k'] ?? '');
      if ($rid !== '' && $rk !== '') {
        kk_limit('storno:' . kk_ip(), 60, 3600);
        $s = $db->prepare("SELECT data, stok FROM kk_rezervace WHERE id = ? AND smazano = 0");
        $s->execute([$rid]);
        $x = $s->fetch();
        if ($x && $x['stok'] && hash_equals($x['stok'], $rk)) {
          $vl = json_decode($x['data'], true);
          unset($vl['hist'], $vl['telefon'], $vl['zprava'], $vl['maily'], $vl['_mt']);
          $rez = array_values(array_filter($rez, function ($y) use ($rid) { return $y['id'] !== $rid; }));
          $rez[] = $vl;
        }
      }
    }
    $o['rezervace'] = json_encode($rez, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    kk_out(['ok' => true, 'rev' => kk_rev_ted(), 'prihlasen' => (bool) $ja, 'cron' => kk_cron_due(), 'data' => $o]);

  /* ---------- pravidelné úlohy ---------- */
  case 'cron':
    if (isset($_GET['klic'])) { if (!kk_env('CRON_KEY') || !hash_equals(kk_env('CRON_KEY'), (string) $_GET['klic'])) kk_chyba('Špatný klíč.', 403); $GLOBALS['KK_CRON_VZDY'] = !empty($_GET['hned']); }
    kk_out(kk_cron());

  /* ---------- změny od posledního načtení (administrace se sama obnovuje) ---------- */
  case 'zmeny':
    kk_musi();
    $rev = (int) ($_GET['rev'] ?? 0);
    $kv = []; $rez = []; $smaz = [];
    $s = $db->prepare("SELECT klic, hodnota FROM kk_kv WHERE rev > ?"); $s->execute([$rev]);
    foreach ($s->fetchAll() as $r) $kv[$r['klic']] = $r['hodnota'];
    $s = $db->prepare("SELECT id, smazano, data FROM kk_rezervace WHERE rev > ?"); $s->execute([$rev]);
    foreach ($s->fetchAll() as $r) { if ($r['smazano']) $smaz[] = $r['id']; else $rez[] = json_decode($r['data'], true); }
    $s = $db->prepare("SELECT COUNT(*) FROM kk_users WHERE rev > ?"); $s->execute([$rev]);
    if ((int) $s->fetchColumn()) $kv['uzivatele'] = json_encode(kk_uzivatele_ven(), JSON_UNESCAPED_UNICODE);
    kk_out(['rev' => kk_rev_ted(), 'kv' => (object) $kv, 'rez' => $rez, 'smaz' => $smaz]);

  /* ---------- přihlášení ---------- */
  case 'login':
    if (!$POST) kk_chyba('POST', 405);
    if (!kk_prvni_spravce()) kk_chyba('Na serveru zatím není žádný účet. Doplňte ADMIN_PASSWORD (aspoň 8 znaků) do .env a nasaďte web znovu.', 503);
    kk_limit('login:' . kk_ip(), 10, 900);
    $V = kk_vstup();
    $q = mb_strtolower(trim((string) ($V['login'] ?? '')));
    $h = (string) ($V['heslo'] ?? '');
    $s = $db->prepare("SELECT id, heslo FROM kk_users WHERE LOWER(login) = ? OR (email <> '' AND LOWER(email) = ?) LIMIT 1");
    $s->execute([$q, $q]);
    $x = $s->fetch();
    if (!$x || $h === '' || !password_verify($h, $x['heslo'])) { usleep(300000); kk_chyba('Špatné přihlašovací jméno nebo heslo.', 401); }
    $u = kk_uzivatel($x['id']);
    if (isset($u['data']['aktivni']) && $u['data']['aktivni'] === false) kk_chyba('Účet je vypnutý. Obraťte se na správce.', 403);
    if (password_needs_rehash($u['heslo'], PASSWORD_DEFAULT)) $u['heslo'] = password_hash($h, PASSWORD_DEFAULT);
    $u['data']['posledni'] = kk_ms();
    kk_uloz_uzivatele($u);
    kk_session(true);
    session_regenerate_id(true);
    $_SESSION['uid'] = $u['id']; $_SESSION['od'] = time();
    kk_out(['ok' => true]);

  case 'logout':
    kk_odhlas();
    kk_out(['ok' => true]);

  case 'me_over':
    if (!$POST) kk_chyba('POST', 405);
    $ja = kk_musi();
    kk_limit('over:' . $ja['id'], 10, 900);
    if (!password_verify((string) (kk_vstup()['heslo'] ?? ''), $ja['heslo'])) kk_chyba('Špatné heslo.', 403);
    kk_out(['ok' => true]);

  case 'me_heslo':
    if (!$POST) kk_chyba('POST', 405);
    $ja = kk_musi(); $V = kk_vstup();
    kk_limit('over:' . $ja['id'], 10, 900);
    if (!password_verify((string) ($V['stare'] ?? ''), $ja['heslo'])) kk_chyba('Současné heslo nesouhlasí.');
    if (mb_strlen((string) ($V['nove'] ?? '')) < 8) kk_chyba('Heslo musí mít aspoň 8 znaků.');
    $ja['heslo'] = password_hash((string) $V['nove'], PASSWORD_DEFAULT);
    unset($ja['data']['vychozi']);
    kk_uloz_uzivatele($ja);
    kk_out(['uzivatele' => kk_uzivatele_ven()]);

  case 'me_uprav':
    if (!$POST) kk_chyba('POST', 405);
    $ja = kk_musi(); $V = kk_vstup();
    if (isset($V['jmeno'])) { if (trim($V['jmeno']) === '') kk_chyba('Jméno nesmí být prázdné.'); $ja['jmeno'] = mb_substr(trim($V['jmeno']), 0, 120); }
    if (isset($V['email'])) $ja['email'] = mb_substr(trim($V['email']), 0, 190);
    kk_uloz_uzivatele($ja);
    kk_out(['uzivatele' => kk_uzivatele_ven()]);

  /* ---------- správa uživatelů (jen správce) ---------- */
  case 'uziv_pridej':
  case 'uziv_uprav':
  case 'uziv_heslo':
  case 'uziv_smaz':
    if (!$POST) kk_chyba('POST', 405);
    $ja = kk_spravce(); $V = kk_vstup();
    $sekce = ['prehled','upravit','galerie','seo','pela_upravit','pela_galerie','pela_seo','ubytovani','pujcovna','doprava','rez_nastaveni','rezervace','cenik','nastaveni','zaznam','kalkulace'];
    $prava = function ($p) use ($sekce) { $o = []; foreach ($sekce as $k) if ($k !== 'prehled') $o[$k] = !empty($p[$k]) ? 1 : 0; return $o; };
    if ($A === 'uziv_pridej') {
      $login = trim((string) ($V['login'] ?? ''));
      if (trim((string) ($V['jmeno'] ?? '')) === '') kk_chyba('Vyplňte jméno.');
      if (!preg_match('/^[a-z0-9._@-]{3,60}$/i', $login)) kk_chyba('Přihlašovací jméno: aspoň 3 znaky, bez mezer a diakritiky.');
      $s = $db->prepare("SELECT COUNT(*) FROM kk_users WHERE LOWER(login) = ?"); $s->execute([mb_strtolower($login)]);
      if ((int) $s->fetchColumn()) kk_chyba('Toto přihlašovací jméno už existuje.');
      if (mb_strlen((string) ($V['heslo'] ?? '')) < 8) kk_chyba('Heslo musí mít aspoň 8 znaků.');
      $d = ['aktivni' => true, 'vzhled' => ($V['vzhled'] ?? '') === 'aplikace' ? 'aplikace' : 'plna', 'platby' => ($V['platby'] ?? true) !== false,
            'souhrny' => ($V['souhrny'] ?? true) !== false, 'vytvoren' => kk_ms()];
      if (isset($V['prava']) && is_array($V['prava'])) $d['prava'] = $prava($V['prava']);
      $id = kk_id('u');
      $db->prepare("INSERT INTO kk_users (id, login, email, jmeno, role, heslo, data, rev, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())")
         ->execute([$id, $login, mb_substr(trim((string) ($V['email'] ?? '')), 0, 190), mb_substr(trim($V['jmeno']), 0, 120),
                    ($V['role'] ?? '') === 'admin' ? 'admin' : 'obsluha', password_hash((string) $V['heslo'], PASSWORD_DEFAULT), json_encode($d), kk_rev()]);
      kk_out(['id' => $id, 'uzivatele' => kk_uzivatele_ven()]);
    }
    $u = kk_uzivatel((string) ($V['id'] ?? ''));
    if (!$u) kk_chyba('Uživatel neexistuje.', 404);
    if ($A === 'uziv_heslo') {
      if (mb_strlen((string) ($V['heslo'] ?? '')) < 8) kk_chyba('Heslo musí mít aspoň 8 znaků.');
      $u['heslo'] = password_hash((string) $V['heslo'], PASSWORD_DEFAULT); unset($u['data']['vychozi']);
      kk_uloz_uzivatele($u);
      kk_out(['uzivatele' => kk_uzivatele_ven()]);
    }
    if ($A === 'uziv_smaz') {
      if ($u['id'] === $ja['id']) kk_chyba('Sami sebe smazat nemůžete.');
      $db->beginTransaction();
      $db->prepare("DELETE FROM kk_users WHERE id = ?")->execute([$u['id']]);
      if (kk_aktivnich_spravcu() < 1) { $db->rollBack(); kk_chyba('Musí zůstat aspoň jeden aktivní správce.'); }
      $db->commit(); kk_rev();
      kk_out(['uzivatele' => kk_uzivatele_ven()]);
    }
    /* uziv_uprav */
    $z = is_array($V['zmena'] ?? null) ? $V['zmena'] : [];
    if (isset($z['jmeno'])) { if (trim($z['jmeno']) === '') kk_chyba('Jméno nesmí být prázdné.'); $u['jmeno'] = mb_substr(trim($z['jmeno']), 0, 120); }
    if (isset($z['email'])) $u['email'] = mb_substr(trim($z['email']), 0, 190);
    if (isset($z['role']) && in_array($z['role'], ['admin', 'obsluha'], true)) $u['role'] = $z['role'];
    if (isset($z['aktivni'])) $u['data']['aktivni'] = (bool) $z['aktivni'];
    if (isset($z['vzhled'])) $u['data']['vzhled'] = $z['vzhled'] === 'aplikace' ? 'aplikace' : 'plna';
    if (isset($z['platby'])) $u['data']['platby'] = (bool) $z['platby'];
    if (isset($z['souhrny'])) $u['data']['souhrny'] = (bool) $z['souhrny'];
    if (isset($z['prava']) && is_array($z['prava'])) $u['data']['prava'] = $prava($z['prava']);
    if ($u['id'] === $ja['id'] && ($u['role'] !== 'admin' || ($u['data']['aktivni'] ?? true) === false)) kk_chyba('Sami sobě nemůžete vzít roli správce ani vypnout účet.');
    $db->beginTransaction();
    kk_uloz_uzivatele($u);
    if (kk_aktivnich_spravcu() < 1) { $db->rollBack(); kk_chyba('Musí zůstat aspoň jeden aktivní správce.'); }
    $db->commit();
    kk_out(['uzivatele' => kk_uzivatele_ven()]);

  /* ---------- obsah a nastavení (klíč → JSON) ---------- */
  case 'kv':
    if (!$POST) kk_chyba('POST', 405);
    $ja = kk_musi(); $V = kk_vstup();
    $k = (string) ($V['klic'] ?? '');
    if (!kk_klic_ok($k)) kk_chyba('Neznámý klíč.');
    if ($k === 'prava' && $ja['role'] !== 'admin') kk_chyba('Práva mění jen správce.', 403);
    $h = $V['hodnota'] ?? null;
    if ($h !== null) { if (!is_string($h) || json_decode($h) === null && $h !== 'null') kk_chyba('Neplatná data.'); }
    kk_kv_uloz($k, $h, $ja['jmeno']);
    kk_out(['rev' => kk_rev_ted()]);

  /* ---------- rezervace z administrace: změněné a smazané ---------- */
  case 'rez':
    if (!$POST) kk_chyba('POST', 405);
    kk_musi(); $V = kk_vstup();
    $db->beginTransaction();
    $rev = kk_rev();
    $st = $db->prepare("SELECT data FROM kk_rezervace WHERE id = ?");
    foreach ((array) ($V['upsert'] ?? []) as $r) {
      if (!is_array($r) || empty($r['id'])) continue;
      /* záznam odeslaných e-mailů drží server – ze starší kopie v prohlížeči se nesmaže */
      $st->execute([(string) $r['id']]); $byl = $st->fetchColumn();
      if ($byl) { $byl = json_decode($byl, true) ?: [];
        if (!empty($byl['maily'])) $r['maily'] = array_merge((array) $byl['maily'], (array) ($r['maily'] ?? []));
        if (!empty($byl['_mt'])) $r['_mt'] = $byl['_mt']; }
      kk_rez_uloz($r, $rev);
    }
    $s = $db->prepare("UPDATE kk_rezervace SET smazano = 1, rev = ?, updated_at = NOW() WHERE id = ?");
    foreach ((array) ($V['smaz'] ?? []) as $id) $s->execute([$rev, (string) $id]);
    $db->commit();
    kk_out(['rev' => kk_rev_ted()]);

  /* ---------- nová rezervace (web i administrace) – číslo přidělí server, obsazenost se ověří znovu ---------- */
  case 'rez_nova':
    if (!$POST) kk_chyba('POST', 405);
    $ja = kk_ja(); $V = kk_vstup(); $r = $V['r'] ?? null;
    if (!is_array($r)) kk_chyba('Chybí rezervace.');
    if (!$ja) {
      kk_limit('rez:' . kk_ip(), 20, 3600);
      $povol = ['od','do','mista','dalsi','osoby','doplnky','lode','doprava','vyzved','platba','jmeno','telefon','email','zprava','prijezd','cena','jazyk','stav','spoj'];
      $r = array_intersect_key($r, array_flip($povol));
      $r['stav'] = in_array($r['stav'] ?? '', ['pop', 'pot'], true) ? $r['stav'] : 'pop';
      $r['zdroj'] = 'web';
      if (isset($r['lode']) && is_array($r['lode'])) $r['lode'] = array_intersect_key($r['lode'], array_flip(['den','dni','kusy','odkud','kam','od']));
      if (isset($r['platba']) && is_array($r['platba'])) { $r['platba'] = array_intersect_key($r['platba'], array_flip(['zaloha','splatnost'])); $r['platba']['stav'] = 'ceka'; }
      foreach (['jmeno' => 160, 'telefon' => 40, 'email' => 190, 'zprava' => 2000, 'prijezd' => 40] as $p => $max) if (isset($r[$p])) $r[$p] = mb_substr(trim((string) $r[$p]), 0, $max);
      if (($r['jmeno'] ?? '') === '' || ($r['telefon'] ?? '') === '') kk_chyba('Vyplňte jméno a telefon.');
    }
    $r['mista'] = array_values(array_unique(array_map('strval', is_array($r['mista'] ?? null) ? $r['mista'] : [])));
    foreach ($r['mista'] as $m) if (!kk_misto_ok($m)) kk_chyba('Neznámé místo: ' . $m);
    $od = kk_datum($r['od'] ?? null); $do = kk_datum($r['do'] ?? null);
    if (!$od || !$do || $do < $od) kk_chyba('Neplatný termín.');
    if (!$ja && $od < date('Y-m-d')) kk_chyba('Termín už začal.');
    $nast = kk_kv('rez.nast', []);
    if (!$ja && $r['mista'] && array_intersect($r['mista'], (array) ($nast['vyp'] ?? []))) kk_chyba('obsazeno', 409);
    $zamek = (int) $db->query("SELECT GET_LOCK('kk_rez', 15)")->fetchColumn();
    if (!$zamek) kk_chyba('Server je zaneprázdněný, zkuste to prosím znovu.', 503);
    try {
      $k = kk_kolize($r['mista'], $od, $do);
      if ($k) kk_chyba('obsazeno', 409);
      if (!$ja && !empty($r['lode']) && kk_lode_chybi($r['lode'])) kk_chyba('vybavení', 409);
      $rada = (string) ($nast['rada'] ?? '') !== '' ? (string) $nast['rada'] : date('y');
      $c = (int) kk_kv('rez.cislo', 0);
      $s = $db->prepare("SELECT COUNT(*) FROM kk_rezervace WHERE cislo = ?");
      do { $c++; $cislo = 'R' . $rada . '-' . str_pad((string) $c, 4, '0', STR_PAD_LEFT); $s->execute([$cislo]); } while ((int) $s->fetchColumn() > 0);
      kk_kv_uloz('rez.cislo', (string) $c, $ja ? $ja['jmeno'] : 'Web');
      $r['id'] = 'r' . base_convert((string) kk_ms(), 10, 36) . $c;
      $r['cislo'] = $cislo;
      $r['vytvoreno'] = kk_ms();
      if (empty($r['stok'])) $r['stok'] = bin2hex(random_bytes(8));
      $mt = bin2hex(random_bytes(12));
      $r['_mt'] = ['t' => $mt, 'do' => time() + 900, 'druhy' => $ja ? [] : ['poptavka', 'rezervace', 'zaloha', 'kemp']];
      kk_rez_uloz($r);
      unset($r['_mt']);
    } finally { $db->query("SELECT RELEASE_LOCK('kk_rez')"); }
    kk_out(['r' => $r, 'mt' => $mt, 'rev' => kk_rev_ted()]);

  /* ---------- zrušení rezervace hostem (storno.html) ---------- */
  case 'storno':
    if (!$POST) kk_chyba('POST', 405);
    kk_limit('storno:' . kk_ip(), 30, 3600);
    $V = kk_vstup();
    $s = $db->prepare("SELECT data, stok FROM kk_rezervace WHERE id = ? AND smazano = 0");
    $s->execute([(string) ($V['r'] ?? '')]);
    $x = $s->fetch();
    if (!$x || !$x['stok'] || !hash_equals($x['stok'], (string) ($V['k'] ?? ''))) kk_chyba('nenalezeno', 404);
    $r = json_decode($x['data'], true);
    $N = kk_kv('rez.nast', [])['storno'] ?? [];
    $zap = !isset($N['zap']) || $N['zap'] !== 0;
    $dni = isset($N['dni']) && $N['dni'] !== '' ? max(0, (int) $N['dni']) : 2;
    $st = 'ok';
    if (!$zap) $st = 'vypnuto';
    else if ($r['stav'] === 'zru') $st = 'zrusena';
    else if ($r['stav'] === 'uby' || $r['stav'] === 'odj') $st = 'odjel';
    else if ($r['stav'] !== 'pot' && $r['stav'] !== 'pop') $st = 'zrusena';
    else if (!empty($r['lode']['vydano'])) $st = 'vydano';
    else { $od = $r['od'] ?? ($r['lode']['od'] ?? ''); if ($od && $od < date('Y-m-d', strtotime("+$dni days"))) $st = 'pozde'; }
    if ($st !== 'ok') kk_chyba($st, 409);
    $t = kk_ms(); $duv = mb_substr(trim((string) ($V['duvod'] ?? '')), 0, 300);
    $r['stav'] = 'zru'; $r['stornoHost'] = $t; $r['stornoDuvod'] = $duv; $r['stok'] = '';
    $r['hist'] = array_merge((array) ($r['hist'] ?? []), [['t' => $t, 'kdo' => 'Host', 'co' => 'Zrušeno hostem přes odkaz v e-mailu' . ($duv !== '' ? ' – ' . mb_substr($duv, 0, 120) : '')]]);
    $mt = bin2hex(random_bytes(12));
    $r['_mt'] = ['t' => $mt, 'do' => time() + 900, 'druhy' => ['zruseno', 'stornoKemp']];
    kk_rez_uloz($r);
    $tel = $r['telefon'] ?? '';
    unset($r['hist'], $r['zprava'], $r['maily'], $r['_mt']);
    kk_out(['r' => $r, 'mt' => $mt]);

  /* ---------- záznam akcí ---------- */
  case 'hist':
    if (!$POST) kk_chyba('POST', 405);
    kk_musi(); $V = kk_vstup();
    $s = $db->prepare("INSERT INTO kk_historie (kdy, data) VALUES (?, ?)");
    foreach (array_slice((array) ($V['polozky'] ?? []), 0, 100) as $p) if (is_array($p)) $s->execute([(int) ($p['kdy'] ?? kk_ms()), json_encode($p, JSON_UNESCAPED_UNICODE)]);
    if (mt_rand(1, 50) === 1) $db->exec("DELETE FROM kk_historie WHERE id < (SELECT id FROM (SELECT id FROM kk_historie ORDER BY id DESC LIMIT 1 OFFSET 5000) t)");
    kk_out(['ok' => true]);

  /* ---------- e-mail k rezervaci: text a vzhled připraví prohlížeč ze šablon, příjemce určí server ---------- */
  case 'mail':
    if (!$POST) kk_chyba('POST', 405);
    $ja = kk_ja(); $V = kk_vstup();
    $druh = (string) ($V['druh'] ?? '');
    $DRUHY = ['poptavka','rezervace','zaloha','zaplaceno','propadla','zruseno','predPrijezdem','plavba','recenze','kemp','stornoKemp'];
    $AUTO = ['predPrijezdem','plavba','recenze','poptavka','rezervace','zaloha','kemp','stornoKemp','propadla','zaplaceno'];
    if (!in_array($druh, $DRUHY, true)) kk_chyba('Neznámý druh e-mailu.');
    if (!$ja) kk_limit('mail:' . kk_ip(), 30, 3600);
    $zamek = (int) $db->query("SELECT GET_LOCK('kk_mail', 20)")->fetchColumn();
    $s = $db->prepare("SELECT data FROM kk_rezervace WHERE id = ? AND smazano = 0");
    $s->execute([(string) ($V['id'] ?? '')]);
    $r = $s->fetchColumn(); if (!$r) kk_chyba('Rezervace nenalezena.', 404);
    $r = json_decode($r, true);
    if (!$ja) {
      $m = $r['_mt'] ?? [];
      if (empty($m['t']) || !hash_equals($m['t'], (string) ($V['mt'] ?? '')) || ($m['do'] ?? 0) < time() || !in_array($druh, (array) ($m['druhy'] ?? []), true)) kk_chyba('E-mail už nejde poslat.', 403);
      $r['_mt']['druhy'] = array_values(array_diff($m['druhy'], [$druh]));
    }
    /* každý druh se k jedné rezervaci pošle jen jednou (zrušení může přijít znovu po obnovení) */
    if (in_array($druh, $AUTO, true) && !empty($r['maily'][$druh]) && empty($V['znovu'])) kk_out(['ok' => true, 'uz' => true]);
    $kemp = $druh === 'kemp' || $druh === 'stornoKemp';
    $komu = $kemp ? kk_email_kemp() : (string) ($r['email'] ?? '');
    if (!filter_var($komu, FILTER_VALIDATE_EMAIL)) kk_out(['ok' => false, 'bez' => true]);
    $html = (string) ($V['html'] ?? ''); $text = (string) ($V['text'] ?? ''); $pr = mb_substr((string) ($V['predmet'] ?? ''), 0, 250);
    if (strlen($html) > 300000 || strlen($text) > 100000) kk_chyba('E-mail je moc dlouhý.', 413);
    if (!$ja && ($r['cislo'] ?? '') !== '' && strpos($pr . $text, (string) $r['cislo']) === false) kk_chyba('E-mail neodpovídá rezervaci.', 400);
    $obr = [];
    if (!empty($V['qr']) && is_string($V['qr']) && strlen($V['qr']) < 200000) {
      $b = base64_decode($V['qr'], true);
      if ($b !== false && (strncmp($b, 'GIF8', 4) === 0 || strncmp($b, "\x89PNG", 4) === 0)) $obr['qrplatba'] = ['data' => $b, 'typ' => $b[0] === 'G' ? 'image/gif' : 'image/png', 'ext' => $b[0] === 'G' ? 'gif' : 'png'];
    }
    try { kk_mail($komu, $pr, $html, $text, $kemp ? (string) ($r['email'] ?? '') : kk_email_kemp(), $obr); }
    catch (Exception $e) { error_log('KK mail: ' . $e->getMessage()); kk_chyba('E-mail se nepodařilo odeslat: ' . $e->getMessage(), 502); }
    $r['maily'] = (array) ($r['maily'] ?? []); $r['maily'][$druh] = kk_ms();
    kk_rez_uloz($r);
    kk_out(['ok' => true, 'komu' => $kemp ? 'kemp' : $komu, 'kdy' => $r['maily'][$druh]]);

  /* ---------- zkušební e-mail (Nastavení) ---------- */
  case 'mail_test':
    if (!$POST) kk_chyba('POST', 405);
    $ja = kk_spravce();
    $komu = (string) (kk_vstup()['komu'] ?? '') ?: kk_email_kemp();
    try { kk_mail($komu, 'Zkušební e-mail – Kemp Krumlov', '<p>Odesílání e-mailů z webu funguje.</p>', 'Odesílání e-mailů z webu funguje.'); }
    catch (Exception $e) { kk_chyba('Nepodařilo se: ' . $e->getMessage(), 502); }
    kk_out(['ok' => true, 'komu' => $komu]);

  /* ---------- galerie ---------- */
  case 'fotky':
    $web = ($_GET['web'] ?? '') === 'pela' ? 'pela' : 'kemp';
    $ja = kk_ja();
    $s = $db->prepare("SELECT data FROM kk_fotky WHERE web = ? ORDER BY poradi, id"); $s->execute([$web]);
    $o = [];
    foreach ($s->fetchAll() as $r) { $f = json_decode($r['data'], true); if ($ja || !isset($f['viditelna']) || $f['viditelna'] !== false) $o[] = $f; }
    kk_out($o);

  case 'fotka':
    if (!$POST) kk_chyba('POST', 405);
    kk_musi();
    $web = ($_POST['web'] ?? '') === 'pela' ? 'pela' : 'kemp';
    $v = kk_obrazek('velka'); $m = kk_obrazek('mala');
    if (!$v) kk_chyba('Chybí fotka.');
    $id = kk_id('f'); $dir = kk_data_dir('fotky');
    move_uploaded_file($v['tmp'], "$dir/$id.{$v['ext']}");
    if ($m) move_uploaded_file($m['tmp'], "$dir/$id-n.{$m['ext']}");
    $f = ['id' => $id, 'popis' => mb_substr((string) ($_POST['popis'] ?? ''), 0, 500), 'kat' => substr((string) ($_POST['kat'] ?? ''), 0, 40),
          'poradi' => (int) ($_POST['poradi'] ?? 0), 'viditelna' => true, 'w' => $v['w'], 'h' => $v['h'], 'velikost' => $v['size'],
          'puvodni' => (int) ($_POST['puvodni'] ?? 0), 'pridano' => kk_ms(), 'zdroj' => 'nahrano',
          'src' => "data/fotky/$id" . ($m ? "-n.{$m['ext']}" : ".{$v['ext']}"), 'full' => "data/fotky/$id.{$v['ext']}"];
    $db->prepare("INSERT INTO kk_fotky (id, web, poradi, data, updated_at) VALUES (?, ?, ?, ?, NOW())")->execute([$id, $web, $f['poradi'], json_encode($f, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);
    kk_out($f);

  case 'fotky_web':
    if (!$POST) kk_chyba('POST', 405);
    kk_musi(); $V = kk_vstup();
    $web = ($V['web'] ?? '') === 'pela' ? 'pela' : 'kemp';
    $s = $db->prepare("INSERT IGNORE INTO kk_fotky (id, web, poradi, data, updated_at) VALUES (?, ?, ?, ?, NOW())");
    foreach (array_values((array) ($V['polozky'] ?? [])) as $i => $p) {
      $fid = ($web === 'pela' ? 'pela-web-' : 'web-') . $i;
      $f = ['id' => $fid, 'popis' => (string) ($p['popis'] ?? ''), 'kat' => (string) ($p['kat'] ?? ''), 'poradi' => $i, 'viditelna' => true,
            'src' => (string) ($p['src'] ?? ''), 'full' => (string) ($p['full'] ?? ''), 'w' => (int) ($p['w'] ?? 1536), 'h' => (int) ($p['h'] ?? 1024),
            'velikost' => 0, 'pridano' => kk_ms(), 'zdroj' => 'web'];
      $s->execute([$fid, $web, $i, json_encode($f, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);
    }
    kk_out(['ok' => true]);

  case 'fotka_uprav':
    if (!$POST) kk_chyba('POST', 405);
    kk_musi(); $V = kk_vstup();
    $s = $db->prepare("SELECT data FROM kk_fotky WHERE id = ?"); $s->execute([(string) ($V['id'] ?? '')]);
    $f = $s->fetchColumn(); if (!$f) kk_chyba('Fotka nenalezena.', 404);
    $f = json_decode($f, true);
    foreach (array_intersect_key((array) ($V['zmena'] ?? []), array_flip(['popis', 'kat', 'viditelna', 'popis_en', 'popis_de', 'popisy'])) as $k => $v) $f[$k] = $v;
    $db->prepare("UPDATE kk_fotky SET data = ?, updated_at = NOW() WHERE id = ?")->execute([json_encode($f, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), $f['id']]);
    kk_out($f);

  case 'fotka_smaz':
    if (!$POST) kk_chyba('POST', 405);
    kk_musi(); $V = kk_vstup();
    $s = $db->prepare("SELECT data FROM kk_fotky WHERE id = ?"); $d = $db->prepare("DELETE FROM kk_fotky WHERE id = ?");
    foreach ((array) ($V['ids'] ?? []) as $id) {
      $s->execute([(string) $id]); $f = $s->fetchColumn(); if (!$f) continue;
      $f = json_decode($f, true);
      if (($f['zdroj'] ?? '') === 'nahrano') foreach ([$f['src'] ?? '', $f['full'] ?? ''] as $p) if (preg_match('#^data/fotky/[A-Za-z0-9-]+\.(webp|jpg|png)$#', $p)) @unlink(dirname(__DIR__) . '/' . $p);
      $d->execute([(string) $id]);
    }
    kk_out(['ok' => true]);

  case 'fotka_poradi':
    if (!$POST) kk_chyba('POST', 405);
    kk_musi(); $V = kk_vstup();
    $s = $db->prepare("SELECT data FROM kk_fotky WHERE id = ?"); $u = $db->prepare("UPDATE kk_fotky SET poradi = ?, data = ? WHERE id = ?");
    foreach (array_values((array) ($V['ids'] ?? [])) as $i => $id) {
      $s->execute([(string) $id]); $f = $s->fetchColumn(); if (!$f) continue;
      $f = json_decode($f, true); $f['poradi'] = $i;
      $u->execute([$i, json_encode($f, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), (string) $id]);
    }
    kk_out(['ok' => true]);

  /* ---------- nahrazená fotka v sekci webu ---------- */
  case 'obrazek':
    if (!$POST) kk_chyba('POST', 405);
    kk_musi();
    $v = kk_obrazek('soubor'); if (!$v) kk_chyba('Chybí fotka.');
    $id = kk_id('o'); $dir = kk_data_dir('obrazky');
    move_uploaded_file($v['tmp'], "$dir/$id.{$v['ext']}");
    kk_out(['id' => $id, 'v' => kk_ms(), 'url' => "data/obrazky/$id.{$v['ext']}"]);

  default:
    kk_chyba('Neznámá akce.', 404);
  }
} catch (PDOException $e) {
  error_log('KK API DB: ' . $e->getMessage());
  kk_chyba('Databáze není dostupná.', 503);
} catch (Throwable $e) {
  error_log('KK API: ' . $e->getMessage() . ' @' . $e->getFile() . ':' . $e->getLine());
  kk_chyba('Chyba serveru.', 500);
}
