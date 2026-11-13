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
