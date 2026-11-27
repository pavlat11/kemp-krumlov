<?php
/* =====================================================================
   Kemp Krumlov – výpočet ceny rezervace na serveru.
   Stejná pravidla jako kalkulačka na webu (js/pobyt.js → compute)
   a KKR.cenaRez v js/cenik.js. Ceník = uložený v administraci,
   jinak výchozí (cenik-vychozi.json, vygenerovaný z js/cenik.js).
   ===================================================================== */
if (!defined('KK_API')) { http_response_code(403); exit; }

function kk_n($x) { return is_numeric($x) ? $x + 0 : (is_bool($x) ? (int) $x : 0); }

/* ceník + doplnění starších formátů (jako doplň() v js/cenik.js) */
function kk_cenik() {
  static $C = null;
  if ($C !== null) return $C;
  $V = json_decode((string) @file_get_contents(__DIR__ . '/cenik-vychozi.json'), true) ?: ['polozky' => [], 'slevy' => [], 'sezona' => [], 'kategorie' => []];
  $u = kk_kv('cenik', null);
  $C = is_array($u) && ($u['verze'] ?? 0) == 1 && !empty($u['polozky']) ? $u : $V;
  $C['slevy'] = array_map(function ($x) {
    return is_array($x) && isset($x['pod']) ? $x : ['n' => 'Od ' . (kk_n($x['noci'] ?? 1) ?: 1) . ' nocí', 'pod' => ['noci' => kk_n($x['noci'] ?? 1) ?: 1], 'typ' => 'proc', 'h' => kk_n($x['proc'] ?? 0), 'web' => 1];
  }, (array) ($C['slevy'] ?? []));
  foreach ($C['polozky'] as &$p) if (($p['k'] ?? '') === 'zak' && !array_key_exists('pro', $p)) $p['pro'] = ['stan'];
  unset($p);
  $kat = $V['kategorie'] ?: [];
  if ($kat) $C['polozky'] = array_values(array_filter($C['polozky'], function ($p) use ($kat) { return isset($kat[$p['kat'] ?? '']); }));
  foreach (['navoz', 'lode'] as $k) {
    $je = false; foreach ($C['polozky'] as $p) if (($p['kat'] ?? '') === $k) $je = true;
    if (!$je) foreach ($V['polozky'] as $p) if (($p['kat'] ?? '') === $k) $C['polozky'][] = $p;
  }
  $C['_mapa'] = [];
  foreach ($C['polozky'] as $p) $C['_mapa'][$p['k']] = $p;
  $C['_hz'] = ($C['sezona']['hlavniZap'] ?? true) !== false;
  return $C;
}
function kk_c_p($k) { $C = kk_cenik(); return $C['_mapa'][$k] ?? null; }
function kk_c_kat($kat) { return array_values(array_filter(kk_cenik()['polozky'], function ($p) use ($kat) { return ($p['kat'] ?? '') === $kat; })); }
function kk_c_v($k, $mode) {
  $p = kk_c_p($k); if (!$p) return 0;
  $a = kk_n($p['a'] ?? 0); $b = (!array_key_exists('b', $p) || $p['b'] === null || !kk_cenik()['_hz']) ? $a : kk_n($p['b']);
  return $mode === 'b' ? $b : ($mode === 'min' ? min($a, $b) : $a);
}
function kk_c_hlavni($m) { $C = kk_cenik(); return $C['_hz'] && $m + 1 >= kk_n($C['sezona']['hlavniOd'] ?? 6) && $m + 1 <= kk_n($C['sezona']['hlavniDo'] ?? 8); }
function kk_c_lod($k, $dni) { $p = kk_c_p($k); if (!$p) return 0; return $dni >= 3 && array_key_exists('b', $p) && $p['b'] !== null ? kk_n($p['b']) : kk_n($p['a'] ?? 0); }
function kk_c_osoba_plati($k, $typy) {
  $p = kk_c_p($k); if (!$p || empty($p['pro']) || !$typy) return true;
  $j = function ($t) use ($p) { return in_array($t, $p['pro'], true); };
  if ($k === 'os') { foreach ($typy as $t) if ($j($t)) return true; return false; }
  foreach ($typy as $t) if (!$j($t)) return false; return true;
}
function kk_noci($od, $do) {
  $r = []; if (!kk_datum($od) || !kk_datum($do)) return $r;
  for ($t = strtotime($od . ' 12:00'); date('Y-m-d', $t) < $do && count($r) < 400; $t = strtotime('+1 day', $t)) $r[] = date('Y-m-d', $t);
  return $r;
}
function kk_aut($osob) { return max(1, (int) ceil(kk_n($osob) / 8)); }
function kk_cena_dopravy($d) {
  if (!is_array($d) || empty($d['misto']) || $d['misto'] === 'kemp') return 0;
  $p = kk_c_p($d['misto']); return $p ? kk_n($p['a'] ?? 0) * kk_aut($d['osob'] ?? 0) : 0;
}
function kk_cena_lodi($l) {
  if (!is_array($l)) return 0; $dni = max(1, (int) kk_n($l['dni'] ?? 1)); $o = 0;
  foreach ((array) ($l['kusy'] ?? []) as $k => $n) $o += kk_n($n) * kk_c_lod($k, $dni) * $dni;
  return $o;
}
/* slevy – port KKC.slevaPobyt: nejvyšší jedna sleva + všechny, které se smí sčítat; nikdy víc než cena */
function kk_sleva($o) {
  $C = kk_cenik(); $q = $o['q']; $sk = $o['sumK']; $n = $o['noci'];
  $c = function ($k) use ($q) { return kk_n($q[$k] ?? 0); };
  $tot = 0; foreach ($sk as $v) $tot += kk_n($v);
  $sk['_uby'] = $tot; $sk['_lode'] = max(0, kk_n($o['lode'])); $sk['_dop'] = max(0, kk_n($o['dop'])); $vse = $tot + $sk['_lode'] + $sk['_dop'];
  $osob = 0; $mist = 0;
  foreach ($q as $k => $v) { $p = $C['_mapa'][$k] ?? null; if (!$p) continue; if ($p['kat'] === 'osoby') $osob += $c($k); if ($p['kat'] === 'ubytovani') $mist += $c($k); }
  $hl = $o['od'] ? kk_c_hlavni((int) substr($o['od'], 5, 2) - 1) : false;
  $M = ['noci' => $n, 'osob' => $osob, 'mist' => $mist, 'lodi' => kk_n($o['lodi'])];
  $V = [];
  foreach ($C['slevy'] as $x) {
    if (!is_array($x) || (array_key_exists('zap', $x) && $x['zap'] === 0)) continue;
    $ok = true;
    foreach ((array) ($x['pod'] ?? []) as $k => $min) { $min = kk_n($min); if ($min && (array_key_exists($k, $M) ? $M[$k] : $c($k)) < $min) $ok = false; }
    $sez = $x['sez'] ?? '';
    if (($sez === 'hlavni' && !$hl) || ($sez === 'mimo' && $hl)) $ok = false;
    if ($o['od'] && ((!empty($x['od']) && $o['od'] < $x['od']) || (!empty($x['do']) && $o['od'] > $x['do']))) $ok = false;
    if (!$ok) continue;
    $na = !empty($x['na']) ? (array) $x['na'] : ['_uby']; $cel = in_array('_uby', $na, true); $base = 0;
    foreach ($na as $k) $base += ($cel && substr($k, 0, 1) !== '_') ? 0 : kk_n($sk[$k] ?? 0);
    if (!$base) continue;
    $h = kk_n($x['h'] ?? 0); $typ = $x['typ'] ?? 'proc';
    $kc = $typ === 'kc' ? $h : ($typ === 'noc' ? $h * $n : $base * $h / 100);
    $kc = min($base, max(0, round($kc)));
    if ($kc) $V[] = ['kc' => $kc, 'komb' => ($x['komb'] ?? 0) === 1];
  }
  $best = null; foreach ($V as $v) if (!$v['komb'] && (!$best || $v['kc'] > $best['kc'])) $best = $v;
  $s = $best ? $best['kc'] : 0; foreach ($V as $v) if ($v['komb']) $s += $v['kc'];
  return min($vse, $s);
}
function kk_lode_pocet2($l) { $n = 0; foreach ((array) (is_array($l) ? ($l['kusy'] ?? []) : []) as $v) $n += kk_n($v); return $n; }
/* cena rezervace (Kč, zaokrouhleno) */
function kk_cena_rez($r) {
  $noci = [];
  $casti = !empty($r['casti']) && is_array($r['casti']) ? $r['casti'] : [[$r['od'] ?? '', $r['do'] ?? '']];
  foreach ($casti as $u) if (is_array($u) && count($u) >= 2) $noci = array_merge($noci, kk_noci($u[0], $u[1]));
  $q = []; $dl = (array) ($r['dalsi'] ?? []); $sk = []; $qk = []; $sum = 0;
  foreach ((array) ($r['mista'] ?? []) as $m) { $t = explode('-', (string) $m)[0]; $q[$t] = ($q[$t] ?? 0) + 1; }
  foreach (['stan', 'karavan'] as $t) if (kk_n($dl[$t] ?? 0) > 0) $q[$t] = ($q[$t] ?? 0) + kk_n($dl[$t]);
  $add = function ($k, $n) use (&$sk, &$qk, &$sum, $noci) {
    $n = kk_n($n); if (!$n || !kk_c_p($k)) return; $v = 0;
    foreach ($noci as $d) $v += (kk_c_hlavni((int) substr($d, 5, 2) - 1) ? kk_c_v($k, 'a') : kk_c_v($k, 'b')) * $n;
    $qk[$k] = ($qk[$k] ?? 0) + $n; if ($v) { $sum += $v; $sk[$k] = ($sk[$k] ?? 0) + $v; }
  };
  $typy = [];
  foreach (kk_c_kat('ubytovani') as $p) if (($q[$p['k']] ?? 0) > 0) $typy[] = $p['k'];
  foreach ($typy as $k) $add($k, $q[$k]);
  $o = (array) ($r['osoby'] ?? []);
  $vl = array_values(array_filter(kk_c_kat('osoby'), function ($p) { return !in_array($p['k'], ['os', 'dite', 'zak'], true) && ($p['skryt'] ?? 0) !== 1; }));
  $ok = function ($k) use ($typy) { return kk_c_osoba_plati($k, $typy); };
  $ad = kk_n($o['dosp'] ?? 0) + ($ok('dite') ? 0 : kk_n($o['dite'] ?? 0)) + ($ok('zak') ? 0 : kk_n($o['zak'] ?? 0));
  foreach ($vl as $p) $ad += $ok($p['k']) ? 0 : kk_n($o[$p['k']] ?? 0);
  if ($ok('os')) $add('os', $ad);
  if ($ok('dite')) $add('dite', $o['dite'] ?? 0);
  if ($ok('zak')) $add('zak', $o['zak'] ?? 0);
  foreach ($vl as $p) if ($ok($p['k'])) $add($p['k'], $o[$p['k']] ?? 0);
  $nast = kk_kv('rez.nast', []);
  if (($nast['doplnky'] ?? null) === true) foreach (kk_c_kat('doplnky') as $p) {
    if (($p['rez'] ?? 1) === 0 || ($p['skryt'] ?? 0) === 1) continue;
    $n = kk_n(((array) ($r['doplnky'] ?? []))[$p['k']] ?? 0); if (!$n) continue;
    $pro = (array) ($p['pro'] ?? []); if ($pro && !array_intersect($typy, $pro)) continue;
    $add($p['k'], $n);
  }
  $lo = !empty($r['lode']) && kk_lode_pocet2($r['lode']) ? $r['lode'] : null;
  $cl = $lo ? kk_cena_lodi($lo) : 0;
  $cd = kk_cena_dopravy($r['doprava'] ?? null) + kk_cena_dopravy($r['vyzved'] ?? null);
  $sl = kk_sleva(['noci' => count($noci), 'q' => $qk, 'sumK' => $sk, 'od' => $noci ? $noci[0] : ($lo ? ($lo['den'] ?? '') : ''), 'lodi' => $lo ? kk_lode_pocet2($lo) : 0, 'lode' => $cl, 'dop' => $cd]);
  return (int) round($sum - $sl + $cl + $cd);
}
/* záloha podle Nastavení → Zálohy (KKR.novaPlatba) */
function kk_nova_platba($cena, $od) {
  $z = array_merge(['zap' => true, 'typ' => 'proc', 'hodnota' => 30, 'lhuta' => 5], (array) (kk_kv('rez.nast', [])['zaloha'] ?? []));
  $dnes = date('Y-m-d');
  if ($od && $od <= $dnes) return null;
  if (!$z['zap'] || !$cena) return null;
  $zal = $z['typ'] === 'vse' ? $cena : ($z['typ'] === 'castka' ? min($cena, max(0, kk_n($z['hodnota']))) : (int) round($cena * min(100, max(0, kk_n($z['hodnota']))) / 100));
  if (!$zal) return null;
  $s = date('Y-m-d', strtotime($dnes . ' +' . max(0, (int) kk_n($z['lhuta'])) . ' days'));
  if ($od && $s > $od) $s = $od < $dnes ? $dnes : $od;
  return ['zaloha' => $zal, 'splatnost' => $s, 'stav' => 'ceka'];
}
/* rezervace z webu je hned potvrzená jen když všechny vybrané typy mají okamžitou rezervaci (KKR.stavWeb) */
function kk_stav_web($r) {
  $z = kk_kv('rez.nast', [])['rezim'] ?? []; $k = [];
  foreach ((array) ($r['mista'] ?? []) as $m) $k[] = explode('-', (string) $m)[0];
  foreach ((array) ($r['dalsi'] ?? []) as $t => $n) if (kk_n($n) > 0) $k[] = $t;
  if (!$k) return 'pop';
  foreach ($k as $t) if ((is_string($z) ? $z : (is_array($z) ? ($z[$t] ?? '') : '')) !== 'ihned') return 'pop';
  return 'pot';
}
