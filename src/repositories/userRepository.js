const db = require('../db/connection');

function findByEmail(email) {
  return db.prepare(`
    SELECT *
    FROM users
    WHERE email = ?
  `).get(email);
}

function findById(id) {
  return db.prepare(`
    SELECT id, name, email, role, points, created_at
    FROM users
    WHERE id = ?
  `).get(id);
}

function createUser({ name, email, passwordHash }) {
  const result = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, points)
    VALUES (?, ?, ?, 'user', 0)
  `).run(name, email, passwordHash);

  return findById(result.lastInsertRowid);
}

function addPoints(userId, points) {
  return db.prepare(`
    UPDATE users
    SET points = points + ?
    WHERE id = ?
  `).run(points, userId);
}

function findLeaderboard() {
  return db.prepare(`
    SELECT
      id,
      name,
      email,
      role,
      points
    FROM users
    WHERE role = 'user'
    ORDER BY points DESC, name ASC
  `).all();
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  addPoints,
  findLeaderboard
};
