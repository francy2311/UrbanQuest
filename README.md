# 🌆 UrbanQuest

> **Tecnologie Informatiche per il Web — Progetto TIW**
> Piattaforma web per creare, accettare e completare missioni urbane con prove, punti, badge, classifica e mappa interattiva.

---

## 📌 Introduzione

**UrbanQuest** è una web application pensata per trasformare la città in uno spazio di esplorazione e sfida.

Gli utenti possono creare missioni urbane, accettare missioni pubblicate da altri utenti, completarle nel mondo reale e inviare una prova testuale o fotografica.
Il creatore della missione può poi verificare la prova e decidere se approvarla o rifiutarla.

Quando una prova viene approvata, il partecipante riceve punti, può sbloccare badge e avanzare nella classifica generale.

---

## 🎯 Obiettivo del progetto

L’obiettivo è realizzare una piattaforma completa per la gestione di missioni urbane, con:

- autenticazione degli utenti;
- persistenza dei dati su database;
- gestione di missioni, partecipazioni e prove;
- verifica lato server delle azioni;
- assegnazione punti;
- classifica;
- badge automatici;
- upload immagini;
- mappa interattiva.

Il progetto è stato sviluppato come applicazione web full-stack per il corso di **Tecnologie Informatiche per il Web**.

---

## 🧩 Livelli implementati

### ✅ Livello 1 — Funzionalità base

UrbanQuest implementa il nucleo principale dell’applicazione:

- registrazione utente;
- login e logout;
- creazione missioni;
- visualizzazione lista missioni;
- visualizzazione dettaglio missione;
- accettazione missione;
- invio prova di completamento;
- dashboard utente.

---

### ✅ Livello 2 — Workflow, stati e logiche applicative

Il progetto introduce una gestione più articolata delle missioni:

- categorie missioni;
- difficoltà missione;
- punti associati alla missione;
- stati della partecipazione:
  - `accepted`;
  - `submitted`;
  - `approved`;
  - `rejected`;
- verifica della prova da parte del creatore;
- approvazione o rifiuto della prova;
- assegnazione automatica dei punti;
- badge automatici in base ai punti;
- classifica utenti;
- filtri per categoria, difficoltà e zona;
- storico delle prove verificate.

---

### ✅ Livello 3 — Estensioni avanzate

UrbanQuest include anche funzionalità avanzate:

- upload immagine come prova tramite `multer`;
- salvataggio file in `public/uploads/proofs`;
- visualizzazione immagine al creatore della missione;
- mappa interattiva delle missioni tramite Leaflet;
- coordinate geografiche associate alle missioni.

---

## 🚀 Funzionalità principali

| Funzionalità | Descrizione |
|---|---|
| 👤 Autenticazione | Registrazione, login, logout e sessioni utente |
| 🗺️ Missioni | Creazione, lista, dettaglio e filtro delle missioni |
| ✅ Partecipazioni | Un utente può accettare missioni create da altri |
| 📸 Prove | Invio di prova testuale e immagine |
| 🔍 Verifica | Il creatore approva o rifiuta le prove ricevute |
| ⭐ Punti | I punti vengono assegnati dopo approvazione |
| 🏅 Badge | Badge automatici in base alle soglie raggiunte |
| 🏆 Classifica | Utenti ordinati per punteggio |
| 🌍 Mappa | Visualizzazione missioni su mappa interattiva |
| 📜 Storico | Prove approvate/rifiutate consultabili dal creatore |

---

## 🛠️ Tecnologie utilizzate

### Backend

- **Node.js**
- **Express.js**
- **better-sqlite3**
- **express-session**
- **bcrypt**
- **multer**

### Frontend

- **Handlebars**
- **HTML**
- **CSS**
- **JavaScript**

### Database

- **SQLite**

### Librerie esterne

- **Leaflet** per la mappa interattiva
- **Multer** per upload immagini

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
│       └── proofs/
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
│   │   └── leaderboardRoutes.js
│   │
│   └── server.js
│
├── views/
│   ├── layouts/
│   ├── partials/
│   ├── dashboard/
│   ├── missions/
│   ├── proofs/
│   ├── home.hbs
│   ├── login.hbs
│   ├── register.hbs
│   └── leaderboard.hbs
│
├── package.json
├── package-lock.json
└── README.md
