const db = require('../db/connection');

function findAllOpen(filters = {}) {
  let query = `
    SELECT
      missions.id,
      missions.title,
      missions.description,
      missions.zone,
      missions.address,
      missions.latitude,
      missions.longitude,
      missions.difficulty,
      missions.points,
      missions.status,
      missions.is_hidden,
      missions.unlock_code,
      missions.created_at,
      categories.name AS category_name,
      users.name AS creator_name
    FROM missions
    LEFT JOIN categories ON categories.id = missions.category_id
    JOIN users ON users.id = missions.creator_id
    WHERE missions.status = 'open'
      AND missions.is_hidden = 0
  `;

  const params = [];

  if (filters.categoryId) {
    query += ` AND missions.category_id = ?`;
    params.push(Number(filters.categoryId));
  }

  if (filters.difficulty) {
    query += ` AND missions.difficulty = ?`;
    params.push(filters.difficulty);
  }

  if (filters.zone) {
    query += ` AND missions.zone LIKE ?`;
    params.push(`%${filters.zone}%`);
  }

  query += ` ORDER BY missions.id DESC`;

  return db.prepare(query).all(...params);
}

function findAllWithCoordinates() {
  return db.prepare(`
    SELECT
      missions.id,
      missions.title,
      missions.zone,
      missions.address,
      missions.latitude,
      missions.longitude,
      missions.points,
      missions.difficulty,
      missions.is_hidden,
      categories.name AS category_name
    FROM missions
    LEFT JOIN categories ON categories.id = missions.category_id
    WHERE missions.status = 'open'
      AND missions.is_hidden = 0
      AND missions.latitude IS NOT NULL
      AND missions.longitude IS NOT NULL
    ORDER BY missions.id DESC
  `).all();
}

function findById(id) {
  return db.prepare(`
    SELECT
      missions.id,
      missions.title,
      missions.description,
      missions.zone,
      missions.address,
      missions.latitude,
      missions.longitude,
      missions.difficulty,
      missions.points,
      missions.status,
      missions.is_hidden,
      missions.unlock_code,
      missions.created_at,
      categories.name AS category_name,
      users.name AS creator_name,
      users.id AS creator_id
    FROM missions
    LEFT JOIN categories ON categories.id = missions.category_id
    JOIN users ON users.id = missions.creator_id
    WHERE missions.id = ?
  `).get(id);
}

function findByUnlockCode(unlockCode) {
  return db.prepare(`
    SELECT
      missions.id,
      missions.title,
      missions.description,
      missions.zone,
      missions.address,
      missions.latitude,
      missions.longitude,
      missions.difficulty,
      missions.points,
      missions.status,
      missions.is_hidden,
      missions.unlock_code,
      missions.created_at,
      categories.name AS category_name,
      users.name AS creator_name,
      users.id AS creator_id
    FROM missions
    LEFT JOIN categories ON categories.id = missions.category_id
    JOIN users ON users.id = missions.creator_id
    WHERE missions.unlock_code = ?
  `).get(unlockCode);
}

function create({
  title,
  description,
  zone,
  address,
  latitude,
  longitude,
  difficulty,
  points,
  isHidden,
  unlockCode,
  categoryId,
  creatorId
}) {
  const result = db.prepare(`
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
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'open', ?, ?, ?, ?)
  `).run(
    title,
    description,
    zone,
    address || null,
    latitude || null,
    longitude || null,
    difficulty,
    points,
    isHidden ? 1 : 0,
    unlockCode || null,
    categoryId || null,
    creatorId
  );

  return findById(result.lastInsertRowid);
}

function findByCreatorId(creatorId) {
  return db.prepare(`
    SELECT
      missions.id,
      missions.title,
      missions.description,
      missions.zone,
      missions.address,
      missions.latitude,
      missions.longitude,
      missions.difficulty,
      missions.points,
      missions.status,
      missions.is_hidden,
      missions.unlock_code,
      missions.created_at,
      categories.name AS category_name
    FROM missions
    LEFT JOIN categories ON categories.id = missions.category_id
    WHERE missions.creator_id = ?
    ORDER BY missions.id DESC
  `).all(creatorId);
}

module.exports = {
  findAllOpen,
  findAllWithCoordinates,
  findById,
  findByUnlockCode,
  create,
  findByCreatorId
};
