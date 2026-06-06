const bcrypt = require('bcrypt');
const db = require('./connection');

const passwordHash = bcrypt.hashSync('password123', 10);

const insertUser = db.prepare(`
  INSERT INTO users (name, email, password_hash, role, points)
  VALUES (?, ?, ?, ?, ?)
`);

const insertCategory = db.prepare(`
  INSERT INTO categories (name)
  VALUES (?)
`);

const insertBadge = db.prepare(`
  INSERT INTO badges (name, description, required_points)
  VALUES (?, ?, ?)
`);

const insertMission = db.prepare(`
  INSERT INTO missions (
    title,
    description,
    zone,
    address,
    latitude,
    longitude,
    difficulty,
    points,
    status,
    is_hidden,
    unlock_code,
    category_id,
    creator_id
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const transaction = db.transaction(() => {
  const adminResult = insertUser.run(
    'Admin UrbanQuest',
    'admin@urbanquest.it',
    passwordHash,
    'admin',
    0
  );

  const userResult = insertUser.run(
    'Mario Rossi',
    'mario@urbanquest.it',
    passwordHash,
    'user',
    40
  );

  const campusCategory = insertCategory.run('Campus');
  const photoCategory = insertCategory.run('Fotografia');
  const cultureCategory = insertCategory.run('Cultura');

  insertBadge.run(
    'Esploratore Principiante',
    'Assegnato agli utenti che raggiungono almeno 50 punti.',
    50
  );

  insertBadge.run(
    'Cacciatore Urbano',
    'Assegnato agli utenti che raggiungono almeno 100 punti.',
    100
  );

  insertBadge.run(
    'Leggenda Urbana',
    'Assegnato agli utenti che raggiungono almeno 200 punti.',
    200
  );

  insertMission.run(
    'Trova una fontanella vicino al campus',
    'Individua una fontanella vicino al campus e descrivi dove si trova.',
    'Campus Bovisa',
    'Via La Masa, Milano',
    45.5039,
    9.1566,
    'easy',
    20,
    'open',
    0,
    null,
    campusCategory.lastInsertRowid,
    adminResult.lastInsertRowid
  );

  insertMission.run(
    'Fotografa un murales urbano',
    'Trova un murales interessante e invia una breve descrizione del luogo.',
    'Milano',
    'Zona Isola, Milano',
    45.4840,
    9.1897,
    'medium',
    40,
    'open',
    0,
    null,
    photoCategory.lastInsertRowid,
    adminResult.lastInsertRowid
  );

  insertMission.run(
    'Scopri un luogo storico nascosto',
    'Trova un luogo storico poco conosciuto e racconta perché è interessante.',
    'Centro',
    'Milano Centro',
    45.4642,
    9.1900,
    'hard',
    70,
    'open',
    0,
    null,
    cultureCategory.lastInsertRowid,
    userResult.lastInsertRowid
  );
});

transaction();

console.log('Seed inserito correttamente.');
console.log('Credenziali test:');
console.log('admin@urbanquest.it / password123');
console.log('mario@urbanquest.it / password123');
