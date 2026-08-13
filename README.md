# ReplyMind — Landing page multilingua

Landing page a pagina singola con rilevamento automatico della lingua, prezzi
localizzati per valuta e nessuna dipendenza da immagini contenenti testo.

## Lingue supportate

| Lingua   | Codice | `<html lang>` | Valuta piani |
|----------|--------|---------------|--------------|
| Italiano | `it`   | `it`          | EUR (€)      |
| English  | `en`   | `en`          | USD ($)      |
| Русский  | `ru`   | `ru`          | RUB (₽)      |
| 中文      | `cn`   | `zh-CN`       | CNY (¥)      |

Il fallback per qualsiasi altra lingua del browser è **inglese**.

## Come viene scelta la lingua

1. Preferenza salvata in `localStorage` (`replymind-lang`) da una scelta precedente.
2. Prima corrispondenza in `navigator.languages` (rispetta l'ordine di preferenza
   dell'utente, non solo la lingua primaria).
3. Inglese.

La scelta manuale dal selettore in header (o dal selettore mobile sotto l'header)
sovrascrive il rilevamento e viene salvata.

## Struttura

```
landing/
├── index.html              # versione autorevole: quella da modificare
├── images/
│   ├── brain-glow.png         # sfondo hero
│   ├── brain-network.png      # sfondo sezione Tinker Mode
│   └── dashboard-mockup.png   # sfondo sezione Analytics
├── replymind-landing.html  # file singolo generato, immagini incorporate
└── build-standalone.py     # rigenera il file singolo
```

## Aprire la pagina per vederla

`index.html` carica le immagini da `images/` con percorsi relativi. Scaricando
**solo** `index.html` — per esempio cliccando "Download raw file" su GitHub — i
riquadri delle immagini restano vuoti, perché la cartella `images/` non è
accanto al file.

Due modi per vederla correttamente:

- **File singolo:** aprire `replymind-landing.html`, che ha le immagini
  incorporate e funziona ovunque, anche da solo in una cartella qualsiasi.
- **Cartella completa:** scaricare l'intera cartella `landing/` mantenendo
  `images/` accanto a `index.html`.

Su GitHub, cliccare un file `.html` mostra il codice sorgente, non la pagina
renderizzata: per vederla serve aprire il file nel browser.

### Rigenerare il file singolo

Dopo ogni modifica a `index.html`:

```bash
pip install Pillow
python3 build-standalone.py
```

Lo script comprime le immagini in JPEG e le incorpora come data URI (da ~3,6 MB
complessivi a ~184 KB). `replymind-landing.html` è **generato**: modificarlo a
mano significa perdere le modifiche alla rigenerazione successiva.

## Aggiungere o modificare una traduzione

Tutte le stringhe vivono nei quattro oggetti `translations.it` / `.en` / `.ru` /
`.cn` dentro `index.html`. Le regole:

- **Ogni chiave deve esistere in tutte e quattro le lingue.** Una chiave presente
  solo in alcune lascia il testo della lingua precedente al cambio.
- Una chiave il cui nome corrisponde a un `id` nell'HTML viene applicata
  automaticamente a quell'elemento.
- Le chiavi di supporto che non corrispondono a un elemento (prezzi, testi delle
  animazioni, messaggi toast) vanno elencate in `NON_DOM_KEYS`.
- Una chiave il cui valore contiene markup (`<em>`, `<strong>`, `<i>`) va elencata
  in `HTML_KEYS`; tutto il resto viene inserito con `textContent`, così una stringa
  tradotta non può iniettare markup nella pagina.

### Prezzi

I prezzi non stanno nell'HTML ma nelle traduzioni, in due varianti per piano:

```js
plan2pm: '€19',  plan2py: '€179',   // Plus mensile / annuale
plan3pm: '€79',  plan3py: '€749',   // Pro mensile / annuale
perM: '/mese',   perY: '/anno',
```

`applyLanguage()` riscrive i `data-m`/`data-y` letti dal toggle mensile/annuale, così
il toggle resta nella valuta corretta anche dopo un cambio lingua. Lo sconto annuale
applicato è **−21%**: cambiando un prezzo mensile, ricalcolare l'annuale coerentemente
(`mensile × 12 × 0,79`, arrotondato).

## Verifica prima di pubblicare

Con un server locale sulla cartella `landing/`:

```bash
python3 -m http.server 8899
```

Controllare per ciascuna lingua che:

- la pagina non contenga caratteri di un altro alfabeto (cirillico su pagina
  italiana, CJK su pagina inglese…), **eccetto** i pulsanti del selettore lingua,
  dove ogni lingua è scritta nel proprio alfabeto di proposito;
- il prezzo mostri la valuta attesa, sia in mensile sia in annuale;
- la console non riporti errori JavaScript.

## Note tecniche

- **Nessuna immagine contiene testo.** I contenuti testuali sopra le immagini
  (recensione di esempio, etichette di tono, statistiche dashboard) sono elementi
  HTML tradotti: le immagini restano solo come sfondo decorativo. Reintrodurre
  un'immagine con testo incorporato romperebbe la localizzazione, perché
  resterebbe nella lingua originale in tutte le altre versioni.
- Le immagini sono servite dal repository, non da un CDN esterno.
- I font arrivano da jsDelivr con fallback di sistema (inclusi cirillico e CJK):
  se il CDN non è raggiungibile la pagina resta leggibile.
- Il testo generato da JavaScript (marquee, demo emozionale, scramble, toast)
  viene rigenerato a ogni cambio lingua.
