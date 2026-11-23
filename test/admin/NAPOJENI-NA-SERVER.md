# Napojení administrace na server

Administrace i web teď běží bez serveru – data se ukládají v prohlížeči
(`localStorage` + `IndexedDB`). Veškerá práce s daty jde přes jediný soubor
`js/kk-data.js`. Při přechodu na server (Laravel + MySQL) se změní jen on:

```js
KK.MODE = 'server';
KK.API_URL = '/api';
```

## Co musí server umět

| Funkce v `kk-data.js`      | Požadavek na API                         | Poznámka |
|----------------------------|------------------------------------------|----------|
| `KK.auth.login`            | `POST /api/login` `{email, heslo}`       | session cookie |
| `KK.auth.logout`           | `POST /api/logout`                       | |
| `KK.auth.me`               | `GET /api/me`                            | 401 = nepřihlášen |
| `KK.texty.vse`             | `GET /api/texty`                         | `{ "o-kempu.3": "<em>…</em>", … }` – jen změněné |
| `KK.texty.uloz`            | `PUT /api/texty`                         | hodnota `null` = vrátit původní |
| `KK.seo.nacti / uloz`      | `GET` / `PUT /api/seo`                   | objekt jako `KK.SEO_VYCHOZI` |
| `KK.cenik.nacti / uloz`   | `GET` / `PUT /api/cenik`                 | celý ceník (formát `KKC.vychozi` v `js/cenik.js`) |
| `KK.cenik.obnov`           | `DELETE /api/cenik`                      | návrat k výchozímu |
| `KK.galerie.seznam`        | `GET /api/fotky`                         | seřazené podle `poradi` |
| `KK.galerie.pridej`        | `POST /api/fotky` (multipart `fotky[]`, `kat`) | server zmenší na 1920 px + náhled 640 px, WebP |
| `KK.galerie.uprav`         | `PATCH /api/fotky/{id}`                  | `popis`, `kat`, `viditelna` |
| `KK.galerie.smaz`          | `DELETE /api/fotky/{id}`                 | |
| `KK.galerie.poradi`        | `PUT /api/fotky/poradi` `[id, …]`        | |

## Databáze (návrh)

- `texty` – `klic` (PK, např. `o-kempu.3`), `html`, `upraveno_kdy`, `upravil`
- `seo` – jeden řádek s JSON hodnotou (nebo sloupce podle `KK.SEO_VYCHOZI`)
- `fotky` – `id`, `soubor`, `nahled`, `popis`, `kat`, `poradi`, `viditelna`, `sirka`, `vyska`, `velikost`, `pridano`
- `uzivatele` – správci webu (heslo hash, role)
- `historie` – kdo, kdy, co změnil

## Texty webu

Každý upravitelný text v `index.html` má atribut `data-t="sekce.cislo"`.
Na serveru šablona vypíše uložený text, pokud existuje, jinak původní:

```blade
<h2 data-t="ubytovani.2">{!! $texty['ubytovani.2'] ?? 'Vyberte si, jak chcete spát' !!}</h2>
```

Texty s cenou mají navíc `data-cena` – ty se v editoru nemění, budou se brát z ceníku.
HTML z editoru je vždy vyčištěné (`KK.cisti`) – povolené jen `em, strong, b, i, br, sup, small, u`.
Na serveru je nutné totéž čištění zopakovat (nikdy nevěřit datům z prohlížeče).

## Ceník

Všechny ceny na webu jdou z `js/cenik.js`. Prvky s cenou mají atribut
`data-c="klic:sloupec"` (`a` = sezóna / 1 den, `b` = mimo sezónu / vícedenní,
`od` = nižší z obou s „od“). Server vypíše uložený ceník do stránky:

```html
<script>window.KK_CENIK_DATA = {{ Js::from($cenik) }};</script>
```

a `cenik.js` už se postará o úvod, karty ubytování, tabulku ceníku, mapu,
dopravu, lodě i výpočet rezervace. Cenu poptávky musí server při přijetí
spočítat znovu sám (nikdy nevěřit ceně poslané z prohlížeče).

## Nastavení serveru (.env)

Hesla a přístupy (databáze, e-mail, klíč aplikace) patří do `.env` – vzor je
v `.env.example` v kořeni projektu. Obsah webu (texty, ceny, fotky, rezervace)
do `.env` nepatří, je v databázi, aby ho šlo měnit v administraci.

## SEO

Server vypíše `<title>`, `meta description`, `robots`, `canonical`, `og:*`
a strukturovaná data `#ld-kemp` přímo do HTML. Soubor `js/obsah.js`, který je
teď nastavuje v prohlížeči, pak na webu nebude potřeba.

## Přenos dat z náhledu

Administrace → Nastavení a záloha → **Stáhnout zálohu** vytvoří JSON
(`texty`, `seo`, `fotky` včetně obrázků). Na serveru ho jde jednorázově naimportovat.

## Doplněno: překlady, texty ze skriptů, fotky, ikony, měna

| Data | Náhled (localStorage / IndexedDB) | Server |
|---|---|---|
| Texty s klíčem `data-t` | `kk.texty` (cs), `kk.texty.en`, `kk.texty.de` | `GET/PUT /api/texty?lang=cs\|en\|de` – tabulka `texty(klic, jazyk, html)` |
| Texty ze skriptů, map, animací, Okolí | `kk.dtexty`, `kk.dtexty.en`, `kk.dtexty.de` – `{"původní český text":"nový"}` | `GET/PUT /api/prepisy/texty?lang=` – tabulka `prepisy_texty(puvodni, jazyk, text)` |
| Nahrazené fotky v sekcích | `kk.obrazky` `{"img/x.webp":{id,v}}` + IndexedDB `kk-obrazky` | `POST /api/prepisy/fotky` (cesta + soubor) – server může rovnou vypsat novou cestu do HTML |
| Ikony | `kk.ikony` `{"klíč":{n:"tent",s:"<path…>"}}` | `GET/PUT /api/prepisy/ikony` |
| Ceny lodí PE-LA, čísla statistik | `kk.texty` klíče `pela.ceny.N` = `"1den|vícedenní"`, `pela.cislo.N` | součást textů (jazyk cs) |
| Sezóna | `cenik.sezona.hlavniZap`, `cenik.sezona.celorocne` | součást ceníku |
| Měna | `cenik.mena = {eur, kurz, zaokr}`; volba hosta `kk.mena` | součást ceníku; volba hosta zůstává v prohlížeči |
| Služby (text) | `cenik.sluzby = [{n, t}]` | součást ceníku |

Jazyk webu: `?lang=en|de` (na serveru adresy `/en/`, `/de/`). `js/start.js` se načítá v `<head>`
a použije překlady, fotky, ikony a převod na eura i na obsah, který vytvoří skripty později.
Texty, ve kterých se mění čísla (počty nocí a osob, názvy měsíců v kalendáři), se pro EN/DE musí doplnit
přímo do skriptů – překlad podle celého textu je nezachytí.

## Uživatelé, role a práva

- Role: `admin` (Správce – smí vše, spravuje uživatele) a `obsluha` (Obsluha – jen sekce povolené v právech).
- Práva obsluhy podle sekcí administrace: `upravit`, `galerie`, `seo`, `rezervace`, `cenik`, `nastaveni` (Přehled a Můj účet vidí každý).
- Náhled: účty v `kk.uzivatele` (heslo jen jako SHA-256 se solí), práva v `kk.prava`, přihlášení v `kk.session` – chrání jen před omylem.
- Server (Laravel): tabulka `users` (jmeno, login, email, role, aktivni, password = bcrypt, posledni_prihlaseni), tabulka/nastavení `prava`;
  přihlášení přes session (Sanctum/Breeze), každé API ověřuje roli a právo (middleware / Policy). Editační režim webu i ukládání
  textů, fotek a ikon jen s právem `upravit`; ceník jen s `cenik` atd.
- Endpointy: `POST /api/login {login, heslo}`, `POST /api/logout`, `GET /api/me`, `PUT /api/me` (jméno, e-mail), `PUT /api/me/heslo`,
  `GET/POST /api/uzivatele`, `PUT/DELETE /api/uzivatele/{id}`, `PUT /api/uzivatele/{id}/heslo`, `GET/PUT /api/prava`.
- Pravidla: aspoň jeden aktivní správce musí zůstat; sám sebe nelze smazat ani si změnit roli; heslo aspoň 8 znaků.

## Rezervace (chatky, podsadové stany, teepee)

V náhledu drží rezervace objekt `KKR` na konci `js/cenik.js` (localStorage `kk.rezervace`, `kk.rez.nast`, `kk.rez.cislo`). Na serveru stačí jeho funkce přepsat na volání API, web (`js/pobyt.js`) i administrace (`rezervace()` v `admin/admin.js`) používají jen je.

- Místa: `chatka-1` … `chatka-20`, `podsad-1` … `podsad-11`, `teepee-1`. Skupiny pro kalendář jsou v `KKR.SKUPINY`.
- Rezervace: `id, cislo, stav, od, do, mista[], dalsi{stan,karavan}, osoby{dosp,dite,zak}, jmeno, telefon, email, zprava, cena, zdroj(web|rucne), jazyk, kdo, vytvoreno`.
- Zálohy se neplatí, stav „zaplaceno“ není.
- Stavy: `pop` poptávka, `pot` rezervace (potvrzená), `uby` ubytovaný, `odj` odjel, `zru` zrušená (místo neblokuje), `blk` blokace místa.
- Obsazené jsou noci `od ≤ noc < do`; den odjezdu je volný pro dalšího hosta.
- Nastavení `rezim` je pro každý typ zvlášť: `{chatka,podsad,teepee,stan,karavan}` = `poptavka` nebo `ihned`. Web zakládá `pot`, jen když všechny vybrané typy (místa i vlastní stany/karavany v `dalsi`) mají `ihned`; jinak `pop` (`KKR.stavWeb(mista,dalsi)`). Typ s `rez:0` v ceníku se nerezervuje vůbec (web píše „stačí přijet“), `vyp:[…]` v nastavení = jednotlivá vypnutá místa.

| Funkce v náhledu | API |
|---|---|
| `KKR.obsazeno()` | `GET /api/obsazenost?od=&do=` – veřejné, vrací jen `{misto:[noci]}`, žádné osobní údaje |
| `KKR.pridej(r)` z webu | `POST /api/rezervace` – veřejné, omezit počet požadavků |
| `KKR.vse()`, `uprav`, `smaz`, `pridej` z administrace | `GET/POST/PATCH/DELETE /api/admin/rezervace` – jen přihlášení, právo `rezervace` |
| `KKR.nast()`, `ulozNast` | `GET/PUT /api/admin/rezervace/nastaveni` – ukládat smí jen správce |

Kontrolu kolize (`KKR.kolize`) musí server dělat znovu při zápisu, v jedné transakci se zámkem na dotčená místa (`SELECT … FOR UPDATE`), jinak si dva hosté ve stejnou chvíli zarezervují stejnou chatku. Po uložení poslat e-mail hostovi a kempu.

## Šablony e-mailů

Upravují se v Rezervace → Nastavení → Šablony e-mailů a ukládají se do nastavení rezervací (`nast.sablony[druh][jazyk] = {predmet, text}`, chybějící = výchozí znění z `KKR.SABL_VYCH`). Adresa kempu pro upozornění je v `nast.emailKemp`.

| Druh | Komu | Kdy odeslat |
|---|---|---|
| `poptavka` | host (jazyk z `r.jazyk`) | nová rezervace z webu ve stavu `pop` |
| `rezervace` | host | nová rezervace z webu ve stavu `pot`, nebo změna stavu `pop` → `pot` |
| `zruseno` | host | změna stavu na `zru` |
| `kemp` | `emailKemp` (jen česky) | každá nová rezervace z webu |

Zástupné údaje: `{jmeno} {cislo} {od} {do} {noci} {mista} {osoby} {cena} {telefon} {email} {zprava} {stav}`. Dosazení dělá `KKR.dosad(text, rezervace, jazyk)` – server musí dělat totéž (formát data `d. m. rrrr`, názvy míst a množná čísla podle jazyka). E-mail hostovi se posílá jen když vyplnil e-mail.

E-mail se posílá jako HTML (a text šablony zároveň jako textová verze). Grafický rám dělá `KKR.emailHtml(druh, jazyk, predmet, text, rezervace)`: hlavička kempu, barevný pruh podle druhu, nadpis, odstavce, bloky řádků „Popisek: hodnota“ se vykreslí jako tabulka, dole kontakty z `KKR.KONTAKT`. Server může tuto funkci převzít 1:1 (např. jako Blade šablonu).

## Vrátit zpět

Po změně stavu, přesunu, prohození nebo smazání nabízí administrace několik sekund „Vrátit zpět“. V náhledu se vrací celý stav rezervací (`KKR.obnov`). Na serveru stačí endpoint, který vrátí poslední změnu daného uživatele (např. `POST /api/rezervace/zpet` nad tabulkou historie změn).

## Doplněk jen k určitému ubytování

Položka doplňku v ceníku může mít `pro: ['stan','karavan']` (chybí = ke všemu). Na webu je doplněk zašedlý, když host vybral jen ubytování mimo `pro`. Server má při uložení rezervace doplněk mimo `pro` odmítnout nebo vynechat.

## Půjčovna lodí, doprava osob a zálohy

Jedna rezervace může obsahovat ubytování, lodě i dopravu (nebo jen lodě – pak má prázdná `mista` a `od`…`do` je první a poslední den půjčení).

```
rezervace.lode    = { den:"2027-07-13", dni:2, kusy:{kanoe:2,raft4:1}, odkud:"dop1", kam:"kemp" }
rezervace.doprava = { misto:"dop1", osob:6, cas:"9:00" }        // doprava osob na místo vyplutí
rezervace.platba  = { zaloha:1716, splatnost:"2027-06-20", stav:"ceka"|"zal"|"vse", kdy:čas }
```

- **Ceník**: kategorie `lode` (sloupec `a` = cena za loď a den při 1–2 dnech, `b` = od 3 dnů, `osob`) a `navoz` (`nav1`–`nav4`: jeden den / více dní × do 10 / 10 a více lodí; připočte se jednou). Doprava osob = cena místa × počet aut (8 osob na auto).
- **Sklad** (`nastaveni.sklad`): `lode.<typ> = {ks, padla, vesty, barely}` a `vyb = {padla, vesty, barely}` (celkové počty). Výchozí hodnoty jsou v `KKR.SKLAD0`.
- **Dostupnost**: vybavení blokuje každá nezrušená rezervace ve dnech `den … den+dni-1`. Server musí při vytvoření i úpravě ověřit totéž co `KKR.lodeChybi()` (typy lodí i pádla, vesty a barely) a při nedostatku vrátit chybu.
- **Zálohy** (`nastaveni.zaloha = {zap, typ:"proc"|"castka"|"vse", hodnota, lhuta, ucet}`): rezervace z webu vznikne ve stavu `pop` s `platba.stav="ceka"` a splatností `dnes + lhuta` (nejpozději den příjezdu). Server hned pošle e-mail `zaloha`. Variabilní symbol = číslice z čísla rezervace.
- **Záloha zaplacena** (tlačítko obsluhy): `platba.stav="zal"`, `stav="pot"`, server pošle e-mail `zaplaceno`. „Doplaceno celé“ = `platba.stav="vse"`.
- **Propadnutí**: noční úloha zruší (`stav="zru"`) rezervace se `stav="pop"`, `platba.stav="ceka"` a `splatnost < dnes` a pošle e-mail `propadla`. V náhledu to dělá `KKR.auto()` při otevření administrace.
- **Šablony**: nové typy `zaloha`, `zaplaceno`, `propadla` a pole `{lode} {doprava} {zaloha} {splatnost} {doplatek} {ucet} {vs}`. Řádek „Popisek: {pole}“ se vynechá, když je pole prázdné.
- **QR platba** zatím není; až bude známé číslo účtu, stačí do e-mailu `zaloha` vložit obrázek s kódem SPD (účet, částka, VS).

### Výdej a vracení lodí
```
rezervace.lode.vydano  = { kdy:čas, kdo:"Jméno", kusy:{kanoe:2, padla:4, vesty:6, barely:2} }
rezervace.lode.vraceno = [ { kdy:čas, kdo:"Jméno", kusy:{kanoe:1, padla:2} }, … ]   // vracení i po částech
```
- Stav lodí se odvozuje (`KKR.lodeStav`): `res` rezervované → `vyd` vydané → `cast` část vrácena → `vra` vše vrácené. Co je ještě venku: `KKR.lodeVen` (vydáno minus součet vráceného).
- Dostupnost (`KKR.lodeObs`): u vydaných rezervací se dnes počítá jen to, co je skutečně venku, a nevrácené kusy po termínu blokují sklad až do dneška.
- Rezervace jen s loděmi se po vrácení všeho přepne na `odj`. Vydané rezervace se automaticky neruší jako „host nepřijel“.

### Doprava bez lodí
`rezervace.doprava = { misto, osob, cas, den }` – `den` je den jízdy. Bez lodí si host vybere místo i den (z dní pobytu); s loděmi je místo = start plavby a den = den vyplutí.

## Vyzvednutí v cíli (doprava zpět do kempu)

Rezervace může mít kromě `doprava` (odvoz z kempu na start) i `vyzved` – vyzvednutí lidí v cíli plavby a odvoz zpět do kempu:

```json
"vyzved": { "misto": "dop9", "osob": 6, "cas": "16:30", "den": "2027-07-12" }
```

Cena je stejná jako doprava na totéž místo (`cena místa × počet aut`, auto = 8 osob) a je součástí `cena` rezervace.
Na webu se nabízí, když host končí mimo kemp (s loděmi), nebo když bez lodí zvolí místo pod kempem (Zlatá Koruna, Boršov).

## Uzavření sezóny

- `POST /api/me/over {heslo}` – ověří heslo přihlášeného (204 = OK, 403 = špatně). Používá se před citlivými akcemi.
- `POST /api/sezony/{rok}/uzavrit {heslo}` – jen Správce. Rezervace s příjezdem v daném roce přesune do archivní tabulky
  (nebo jim nastaví `archiv = rok`), číslování nových rezervací začne od `R{rok+1}-0001`. Rezervace na další roky zůstanou.
- `GET /api/sezony` – seznam archivovaných sezón se souhrnem (rezervací, nocí, hostů, lodí, tržby, zrušených).
- `POST /api/sezony/{rok}/obnovit {heslo}` – vrátí sezónu z archivu mezi rezervace.
- Před uzavřením si administrace sama stáhne zálohu (`KK.export()`); na serveru navíc doporučujeme zálohu databáze.

## Dva weby: Kemp Krumlov a PE-LA (jedna administrace)

Administrace má nahoře v menu přepínač **Kemp Krumlov | PE-LA**. Po přepnutí se změní barvy,
logo a sekce **Upravit web, Galerie a SEO** pracují s webem PE-LA. Ostatní je společné.

| Data | Kemp | PE-LA | Poznámka |
|------|------|-------|----------|
| texty, překlady, přepisy textů, ikony, fotky na webu | `texty`, `dtexty`, … | `pela.texty`, `pela.dtexty`, … | každý web vlastní |
| galerie, SEO | `galerie`, `seo` (IndexedDB `kkt-admin`) | `pela.galerie`, `pela.seo` (IndexedDB `kkt-pela-admin`) | každý web vlastní |
| ceník, rezervace, sklad lodí, doprava, uživatelé, práva, historie | společné | společné | jedna databáze |

V náhledu to řeší `KK.WEB` v `js/kk-data.js` (klíče s předponou `pela.`). Na serveru (Laravel):

- tabulky `texty`, `fotky`, `seo`, `prepisy` dostanou sloupec `web` (`kemp` | `pela`),
  API přijímá `?web=kemp|pela` (administrace ho pošle podle přepínače, web PE-LA vždy `pela`);
- obě domény (kemp-krumlov.cz, pe-la.cz) běží z jedné Laravel aplikace na stejném hostingu,
  doménu pozná podle `Host` a vybere šablony a `web`;
- **ceník je jeden** – web PE-LA bere ceny lodí, návozu, dopravy a „ubytování od“ ze stejné tabulky.
  Mapa klíčů PE-LA → položky ceníku je v repozitáři PE-LA v `inc/cenik-sdileny.php`
  (stejná je v `js/pela-web.js`).

Náhled webu PE-LA je v `test/pela/` – vygenerovaný z repozitáře `pavlat11/pela`:

```
cd pela && php nastroje/nahled.php ../kemp-krumlov/test/pela
```

Každý text PE-LA má `data-t="klic"` (stejný klíč jako v `lang/cs.php`), každá cena `data-pc="klic"`.
Upravený text s cenou se ukládá se značkou `{price:klic}`, takže se cena dál bere z ceníku.

## Aplikace pro obsluhu (admin/obsluha.js)
- Uživatel má navíc `vzhled` (`'aplikace'` | `'plna'`) a `platby` (bool – smí potvrzovat zálohy a doplatky) a `souhrny` (bool – smí vidět finanční souhrny: Sezóna v číslech na Přehledu, Kalkulace, souhrny tržeb; správce vždy; výchozí true). Server musí `souhrny` hlídat i v API (nevracet tržby a kalkulace uživateli bez práva). Správce má vždy plnou administraci.
- S `vzhled='aplikace'` smí účet jen sekce `ubytovani`, `pujcovna`, `doprava` (+ vlastní účet) – na serveru to musí hlídat i middleware/Policy, ne jen vzhled.
- Akce z aplikace jsou stejné úpravy rezervace jako v plné administraci (stav `uby`/`odj`, `platba.stav`, `lode.vydano`/`lode.vraceno`) se zápisem do `hist`.
- Nově: `doprava.hotovo` a `vyzved.hotovo` = `{kdy, kdo}` – obsluha označila odvoz na start / vyzvednutí v cíli jako hotové.

## Kontrola obsazenosti při odeslání
- Web už teď těsně před uložením znovu kontroluje volná místa a vybavení (`KKR.pridej` vyhodí chybu „obsazeno“ / „vybavení“ a host dostane hlášku). Na serveru se to musí udělat znovu **v transakci se zámkem** (např. `SELECT … FOR UPDATE` nad dny/místy), jinak dva hosté odeslaní ve stejnou chvíli mohou zabrat totéž.

## Návoz lodí
- Není v ceně rezervace (`cena` ho neobsahuje), platí se na místě. Cena = `cenaLodi(l).navoz` – dražší ze zastávky startu a cíle (`polozky` kat. `doprava`: `n1`, `n10`, `d1`, `d10`), vždy jen jeden.
- Obecné `nav1`–`nav4` se dopočítávají ze zastávek (nejnižší / nejvyšší) jen kvůli webu PE-LA.

## QR platba
- Po odeslání rezervace se zálohou web ukáže QR kód (formát SPAYD, české bankovní aplikace): `SPD*1.0*ACC:<IBAN>*AM:<záloha>*CC:CZK*X-VS:<číslice z čísla rezervace>*DT:<splatnost>*MSG:…`. IBAN se počítá z čísla účtu v Nastavení → Zálohy. Stejný QR kód (jako obrázek PNG) dejte i do e-mailu „Výzva k zaplacení zálohy“.

## Čas příjezdu
- Rezervace má nové pole `prijezd` (text, např. `14–16`, `po 20:00`) – vyplní host na webu nebo obsluha v administraci. Použije ho e-mail „Den před příjezdem“ (`{prijezd}`) a aplikace obsluhy.

## Automatické e-maily (cron)
- Nové šablony `predPrijezdem`, `plavba`, `recenze` (Rezervace → Nastavení → E-maily). Server je posílá plánovačem (Laravel scheduler):
  - `predPrijezdem` – den před `od` v 10:00, rezervace ve stavu `pot` s ubytováním a e-mailem,
  - `plavba` – v den `lode.den` v 7:00, jen rezervace s loděmi,
  - `recenze` – den po `do` v 11:00, stav `odj` (nebo `pot` po termínu), jen jednou.
- Každý typ jde vypnout (`nastaveni.autoMail[typ] === false`). Odkaz na recenze je `nastaveni.recenzeUrl` (`{recenze}`). Odeslání si zapište do rezervace (např. `maily.predPrijezdem = čas`), ať se nepošle dvakrát.
- Nová pole v šablonách: `{prijezd}`, `{odvoz}`, `{navoz}`, `{recenze}`.

## Poškozené vybavení
- `nastaveni.poskozeno = [{id, k, ks, typ: "poskozeno"|"ztraceno", popis, kdy, kdo, rez, cislo, jmeno}]` (rez = id rezervace, kopie i v `rezervace.poskozeno` + záznam v `hist`) – kusy se odečítají ze skladu (`lodeCelkem`) a nenabízí se k půjčení, dokud je někdo neoznačí jako opravené. Nahlásit jde v administraci (Nastavení → Půjčovna) i z aplikace obsluhy (Lodě → Poškození).

## Spuštění naostro (SEO)
- Ve všech stránkách v `/test/` je `<meta name="robots" content="noindex, nofollow">` – **při spuštění smazat**.
- `test/sitemap.xml` zkopírovat do kořene a do `robots.txt` přidat `Sitemap: https://www.kemp-krumlov.cz/sitemap.xml`.
- Ukázková data (generátor v `cenik.js`) na ostrém webu nesmí běžet – při prvním načtení zabírají asi 1 s. Bez nich vychází web v Lighthouse kolem 80 bodů výkonu.

## Stav vody na Vltavě (KKV v js/cenik.js)
- Testovací verze ukazuje **ukázková data**. Naostro: cron každou hodinu stáhne aktuální data ČHMÚ (opendata.chmi.cz, adresář hydrology /now/) pro stanice **Vyšší Brod** (objekt 307036) a **Český Krumlov**: stav [cm], průtok [m³/s], teplota vody; uloží poslední hodnotu a denní hodnoty za 7 dní.
- Endpoint `GET /api/voda` → `{cas:"10:00", st:[{n,q,h,t,tr}], hist:[{d,q}]}` (tr = -1 klesá / 0 / 1 stoupá). Frontend ho jen vloží do `kkt.voda.data` (stejný tvar), zbytek už je hotový.
- Hranice semaforu `kkt.voda.prahy` {nizky, vysoky, nebezp} v m³/s (výchozí 5 / 30 / 60) – nastaví správce.
- Vždy zobrazit „Zdroj: ČHMÚ, operativní neověřená data“.
- Zapnutí/vypnutí a hranice jsou v Rezervace → Nastavení → „Stav vody na Vltavě“ (`nast.voda` = {web, app, nizky, vysoky, nebezp}).

## Zrušení rezervace hostem (storno.html)
- E-maily hostům (poptávka, potvrzení, záloha, záloha přijata, den před příjezdem) mají dole tlačítko „Zrušit rezervaci“ → `storno.html?r=<id>&k=<klíč>&lang=`; pole `{storno}` vloží stejný odkaz do textu.
- Klíč `stok` je náhodný, uložený u rezervace; po zrušení se smaže (odkaz už nejde použít znovu).
- Server: `GET /api/storno?r&k` → shrnutí rezervace + stav (`ok | zrusena | odjel | pozde | vydano | vypnuto`), `POST /api/storno {r,k,duvod}` → ověří klíč, lhůtu (`nast.storno.dni` dní před příjezdem) a stav, nastaví `stav='zru'`, `stornoHost`, `stornoDuvod`, zapíše historii, uvolní místa/vybavení, pošle hostovi šablonu `zruseno` a kempu `stornoKemp`.
- Ochrana: limit pokusů na IP, klíč porovnávat v konstantním čase, stránka `noindex`.
- Nastavení: Rezervace → Nastavení → Rezervování → „Zrušení rezervace hostem“ (`nast.storno` = {zap, dni, pod}).
