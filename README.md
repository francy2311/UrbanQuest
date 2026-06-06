# 🌆 UrbanQuest

> **Progetto TIW — Tecnologie Informatiche per il Web**
> Piattaforma web per creare, scoprire e completare missioni urbane, con prove fotografiche, punti, badge, classifica, mappa interattiva e missioni segrete sbloccabili tramite QR code.

---

## 📌 Introduzione

**UrbanQuest** è una web application che trasforma la città in un ambiente di gioco e scoperta.

Gli utenti possono creare missioni urbane, accettare missioni pubbliche, inviare prove di completamento e guadagnare punti dopo la verifica da parte del creatore della missione.

Il progetto include anche funzionalità avanzate come:

- mappa interattiva delle missioni;
- upload immagini come prova;
- foto profilo utente;
- badge automatici;
- classifica utenti;
- missioni segrete sbloccabili tramite QR code.

---

## 🎯 Obiettivo del progetto

L’obiettivo è realizzare una piattaforma completa per la gestione di missioni urbane, in cui gli utenti possano:

- registrarsi e autenticarsi;
- creare missioni pubbliche o segrete;
- visualizzare missioni disponibili;
- accettare missioni;
- inviare prove testuali e fotografiche;
- verificare le prove ricevute;
- ottenere punti;
- sbloccare badge;
- scalare la classifica;
- visualizzare missioni su mappa;
- sbloccare missioni speciali tramite QR code.

---

## ✅ Livelli implementati

### Livello 1 — Funzionalità base

Il progetto implementa tutte le funzionalità principali richieste:

- registrazione utente;
- login e logout;
- gestione sessione;
- creazione missioni;
- lista missioni disponibili;
- dettaglio missione;
- accettazione missione;
- invio prova testuale;
- dashboard utente;
- punteggio utente.

---

### Livello 2 — Workflow applicativo e gamification

UrbanQuest include un workflow completo per la gestione delle missioni:

- categorie missioni;
- difficoltà missione;
- punti associati;
- filtri per categoria, difficoltà e zona;
- stati della partecipazione:
  - `accepted`;
  - `submitted`;
  - `approved`;
  - `rejected`;
- verifica della prova da parte del creatore;
- approvazione o rifiuto della prova;
- assegnazione automatica dei punti;
- badge automatici;
- classifica utenti;
- storico prove verificate;
- lista partecipanti per ogni missione creata.

---

### Livello 3 — Estensioni avanzate

Il progetto include più funzionalità avanzate:

- upload immagine come prova di completamento;
- mappa interattiva con Leaflet;
- foto profilo utente;
- missioni segrete;
- QR code dinamico;
- sblocco automatico missioni segrete tramite QR code.

Le missioni segrete non compaiono nella lista pubblica e non vengono mostrate sulla mappa.

Il creatore può generare un QR code; quando un utente autenticato apre il link del QR, la missione viene aggiunta automaticamente alle sue partecipazioni.

---

## 🚀 Funzionalità principali

| Funzionalità | Descrizione |
|---|---|
| 👤 Autenticazione | Registrazione, login, logout e sessioni |
| 🧑‍💼 Profilo utente | Upload foto profilo personale |
| 🗺️ Missioni pubbliche | Missioni visibili nella lista e sulla mappa |
| 🔒 Missioni segrete | Missioni nascoste accessibili solo tramite QR code |
| 📍 Mappa | Visualizzazione missioni pubbliche geolocalizzate |
| ✅ Partecipazioni | Un utente può accettare missioni create da altri |
| 📸 Prove | Invio prova testuale e immagine |
| 🔍 Verifica | Il creatore approva o rifiuta le prove ricevute |
| 👥 Partecipanti | Il creatore può vedere gli utenti che partecipano alla missione |
| ⭐ Punti | Punti assegnati dopo approvazione della prova |
| 🏅 Badge | Badge automatici in base ai punti |
| 🏆 Classifica | Utenti ordinati per punteggio |
| 📱 QR code | Generazione QR code per sbloccare missioni segrete |

---

## 🛠️ Tecnologie utilizzate

### Backend

- Node.js
- Express.js
- better-sqlite3
- express-session
- bcrypt
- multer
- qrcode

### Frontend

- Handlebars
- HTML
- CSS
- JavaScript

### Database

- SQLite

### Librerie esterne

- Leaflet per la mappa interattiva;
- Multer per upload immagini;
- QRCode per la generazione dei QR code.

---

## 📁 Struttura del progetto

```text
UrbanQuest_TIW/
│
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── map.js
│   └── uploads/
│       ├── proofs/
│       └── profiles/
│
├── src/
│   ├── db/
│   │   ├── connection.js
│   │   ├── schema.sql
│   │   ├── init.js
│   │   └── seed.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── upload.js
│   │
│   ├── repositories/
│   │   ├── userRepository.js
│   │   ├── missionRepository.js
│   │   ├── categoryRepository.js
│   │   ├── participationRepository.js
│   │   ├── proofRepository.js
│   │   └── badgeRepository.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── missionRoutes.js
│   │   ├── proofRoutes.js
│   │   ├── leaderboardRoutes.js
│   │   ├── profileRoutes.js
│   │   └── qrRoutes.js
│   │
│   └── server.js
│
├── views/
│   ├── layouts/
│   ├── partials/
│   ├── dashboard/
│   ├── missions/
│   ├── proofs/
│   ├── errors/
│   ├── home.hbs
│   ├── login.hbs
│   ├── register.hbs
│   └── leaderboard.hbs
│
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

---

## ⚙️ Installazione e avvio

### 1. Entrare nella cartella del progetto

```bash
cd UrbanQuest_TIW
```

### 2. Installare le dipendenze

```bash
npm install
```

### 3. Inizializzare il database

```bash
npm run db:init
```

### 4. Inserire i dati iniziali

```bash
npm run db:seed
```

### 5. Avviare il server

```bash
npm run dev
```

L’applicazione sarà disponibile su:

```text
http://localhost:3000
```

---

## 🔑 Credenziali di test

Dopo aver eseguito `npm run db:seed`, sono disponibili questi utenti:

### Utente admin / creatore missioni

```text
Email: admin@urbanquest.it
Password: password123
```

### Utente standard

```text
Email: mario@urbanquest.it
Password: password123
```

---

## 🧪 Flusso demo consigliato

### 1. Login con admin

Accedere con:

```text
admin@urbanquest.it
password123
```

Mostrare:

- dashboard;
- creazione missione;
- missioni create;
- mappa;
- classifica.

---

### 2. Creazione missione pubblica

Creare una missione normale compilando:

- titolo;
- descrizione;
- categoria;
- difficoltà;
- zona;
- indirizzo;
- coordinate;
- punti.

La missione pubblica compare:

- nella lista missioni;
- nella mappa.

---

### 3. Creazione missione segreta

Creare una missione spuntando:

```text
Missione segreta accessibile solo tramite QR code
```

La missione segreta:

- non compare nella lista pubblica;
- non compare nella mappa;
- rimane visibile al creatore nella dashboard;
- ha un QR code dedicato.

---

### 4. QR code missione segreta

Dalla missione segreta:

```text
Dettagli → Mostra QR code
```

Il QR code genera un link del tipo:

```text
/missions/unlock/:code
```

Un utente autenticato che apre quel link sblocca automaticamente la missione.

---

### 5. Login con Mario

Fare logout e accedere con:

```text
mario@urbanquest.it
password123
```

Poi aprire il link QR della missione segreta.

Risultato:

```text
La missione viene aggiunta automaticamente alle missioni accettate di Mario.
```

---

### 6. Invio prova

Da:

```text
Dashboard → Missioni accettate
```

Mario può:

- inviare una prova testuale;
- caricare un’immagine;
- mettere la missione in stato `submitted`.

---

### 7. Verifica prova

Il creatore della missione può andare in:

```text
Dashboard → Missioni create → Partecipanti
```

Da qui può vedere:

- utente partecipante;
- email;
- punti;
- stato partecipazione;
- testo della prova;
- immagine caricata.

Può poi approvare o rifiutare la prova.

---

### 8. Punti, badge e classifica

Se la prova viene approvata:

- l’utente riceve punti;
- può ottenere badge automatici;
- la classifica viene aggiornata.

---

## 🗺️ Mappa interattiva

UrbanQuest usa **Leaflet** per visualizzare le missioni pubbliche su una mappa.

La pagina è disponibile su:

```text
/missions/map
```

Le missioni segrete non vengono mostrate sulla mappa.

---

## 🔒 Missioni segrete e QR code

Le missioni segrete sono missioni accessibili solo tramite QR code.

Quando una missione viene creata come segreta:

- viene salvata con `is_hidden = 1`;
- viene generato un `unlock_code`;
- non viene restituita nella lista pubblica;
- non viene mostrata nella mappa;
- il QR code punta alla rotta:

```text
/missions/unlock/:code
```

Se un utente autenticato apre il link:

- il sistema verifica il codice;
- controlla che la missione esista;
- controlla che l’utente non sia il creatore;
- controlla che l’utente non l’abbia già sbloccata;
- crea automaticamente una partecipazione;
- reindirizza l’utente alle sue missioni accettate.

---

## 👥 Lista partecipanti

Il creatore di una missione può visualizzare tutti gli utenti che hanno accettato quella missione.

Per ogni partecipante vengono mostrati:

- foto profilo o iniziale;
- nome;
- email;
- punti totali;
- stato partecipazione;
- prova testuale;
- eventuale immagine caricata.

Questa funzionalità permette al creatore di seguire il ciclo di vita della missione.

---

## 🧑‍💼 Foto profilo

Ogni utente può caricare una foto profilo dalla dashboard.

La foto viene mostrata in:

- dashboard;
- classifica;
- lista partecipanti.

Il caricamento è gestito tramite `multer`.

Sono ammessi i formati:

```text
JPG, JPEG, PNG, WEBP
```

---

## 🏅 Sistema badge

I badge vengono assegnati automaticamente quando un utente raggiunge determinate soglie di punti.

Esempio:

| Badge | Punti richiesti |
|---|---:|
| Esploratore Principiante | 50 |
| Cacciatore Urbano | 100 |
| Leggenda Urbana | 200 |

---

## 🏆 Classifica

La classifica mostra gli utenti ordinati per punteggio decrescente.

La pagina è disponibile su:

```text
/leaderboard
```

---

## 🔐 Controlli di autorizzazione

Il progetto include diversi controlli lato server:

- solo utenti autenticati possono creare missioni;
- solo utenti autenticati possono accettare missioni;
- un utente non può accettare una missione creata da sé;
- un utente non può inviare prove per partecipazioni altrui;
- solo il creatore può vedere i partecipanti della propria missione;
- solo il creatore può approvare o rifiutare una prova;
- una missione segreta può essere sbloccata solo tramite codice valido;
- una missione segreta non può essere sbloccata dal suo creatore;
- una prova già verificata non può essere verificata di nuovo.

---

## 🗃️ Database

Le principali tabelle sono:

| Tabella | Scopo |
|---|---|
| `users` | utenti registrati |
| `categories` | categorie missioni |
| `missions` | missioni pubbliche e segrete |
| `mission_participations` | partecipazioni degli utenti |
| `proofs` | prove inviate |
| `badges` | badge disponibili |
| `user_badges` | badge ottenuti dagli utenti |

La tabella `missions` contiene anche:

| Campo | Descrizione |
|---|---|
| `is_hidden` | indica se la missione è segreta |
| `unlock_code` | codice univoco per sblocco tramite QR |

---

## 📦 Script disponibili

### Avvio server

```bash
npm run dev
```

### Inizializzazione database

```bash
npm run db:init
```

### Inserimento dati di test

```bash
npm run db:seed
```

---

## 🧹 Note per la consegna
Il docente può ricreare l’ambiente eseguendo:

```bash
npm install
npm run db:init
npm run db:seed
npm run dev
```

---

## 🧠 Scelte progettuali

### Pattern Repository

L’accesso ai dati è separato dalle rotte Express tramite repository dedicati.

Esempi:

- `userRepository`;
- `missionRepository`;
- `participationRepository`;
- `proofRepository`;
- `badgeRepository`.

Questa scelta separa la logica di accesso al database dalla gestione delle richieste HTTP.

---

### Validazione lato server

Le operazioni principali vengono validate lato server:

- campi obbligatori;
- lunghezza titolo e descrizione;
- difficoltà ammessa solo tra valori predefiniti;
- punti entro limiti validi;
- formato immagine controllato;
- missioni non accettabili dal creatore;
- prove non modificabili dopo l’invio.

---

### Gestione stati

Le partecipazioni seguono questo workflow:

```text
accepted → submitted → approved / rejected
```

Questo permette di rappresentare chiaramente il ciclo di vita di una missione accettata.

---

### Missioni segrete

Le missioni segrete sono gestite tramite:

```text
is_hidden
unlock_code
```

Il QR code non punta semplicemente al dettaglio, ma alla rotta di sblocco.

---

## ✅ Stato finale

UrbanQuest implementa:

```text
Livello 1: completo
Livello 2: completo
Livello 3: completo
```

Funzionalità avanzate incluse:

```text
- mappa interattiva
- upload immagini
- foto profilo
- missioni segrete
- QR code di sblocco
```

---

## 👨‍💻 Autore

Progetto realizzato per il corso di:

```text
Tecnologie Informatiche per il Web
```
