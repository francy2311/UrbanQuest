const path = require('path');
const express = require('express');
const session = require('express-session');
const { engine } = require('express-handlebars');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const missionRoutes = require('./routes/missionRoutes');
const proofRoutes = require('./routes/proofRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const qrRoutes = require('./routes/qrRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   CONFIGURAZIONE VIEW ENGINE
========================= */

app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: path.join(__dirname, '../views/partials'),
    helpers: {
      eq: function (a, b) {
        return a === b;
      },
      inc: function (value) {
        return Number(value) + 1;
      },
      initial: function (name) {
        if (!name) {
          return '?';
        }

        return String(name).trim().charAt(0).toUpperCase();
      }
    }
  })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));

/* =========================
   FILE STATICI
========================= */

app.use(express.static(path.join(__dirname, '../public')));

/* =========================
   BODY PARSER
========================= */

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* =========================
   SESSIONI
========================= */

app.use(
  session({
    secret: 'urbanquest-secret-key',
    resave: false,
    saveUninitialized: false
  })
);

/* =========================
   VARIABILI GLOBALI PER LE VIEW
========================= */

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.success = req.session.success || null;
  res.locals.error = req.session.error || null;

  delete req.session.success;
  delete req.session.error;

  next();
});

/* =========================
   ROTTE PRINCIPALI
========================= */

app.get('/', (req, res) => {
  res.render('home', {
    title: 'UrbanQuest'
  });
});

/* =========================
   ROTTE APPLICATIVE
========================= */

app.use(authRoutes);
app.use(dashboardRoutes);
app.use(missionRoutes);
app.use(proofRoutes);
app.use(leaderboardRoutes);
app.use(qrRoutes);


/* =========================
   ERRORE 404
========================= */

app.use((req, res) => {
  res.status(404).render('errors/404', {
    title: 'Pagina non trovata'
  });
});

/* =========================
   ERRORE 500
========================= */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).render('errors/500', {
    title: 'Errore interno'
  });
});

/* =========================
   AVVIO SERVER
========================= */

app.listen(PORT, () => {
  console.log(`UrbanQuest avviato su http://localhost:${PORT}`);
});

