const db = require('../db/connection');

function findByMissionAndUser(missionId, userId) {
  return db.prepare(`
    SELECT *
    FROM mission_participations
    WHERE mission_id = ? AND user_id = ?
  `).get(missionId, userId);
}

function create({ missionId, userId }) {
  const result = db.prepare(`
    INSERT INTO mission_participations (mission_id, user_id, status)
    VALUES (?, ?, 'accepted')
  `).run(missionId, userId);

  return findById(result.lastInsertRowid);
}

function findById(id) {
  return db.prepare(`
    SELECT *
    FROM mission_participations
    WHERE id = ?
  `).get(id);
}

function findByUserId(userId) {
  return db.prepare(`
    SELECT
      mission_participations.id,
      mission_participations.status,
      mission_participations.created_at,
      mission_participations.updated_at,
      missions.id AS mission_id,
      missions.title,
      missions.description,
      missions.zone,
      missions.difficulty,
      missions.points,
      categories.name AS category_name
    FROM mission_participations
    JOIN missions ON missions.id = mission_participations.mission_id
    LEFT JOIN categories ON categories.id = missions.category_id
    WHERE mission_participations.user_id = ?
    ORDER BY mission_participations.created_at DESC
  `).all(userId);
}

function updateStatus(id, status) {
  return db.prepare(`
    UPDATE mission_participations
    SET status = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(status, id);
}

module.exports = {
  findByMissionAndUser,
  create,
  findById,
  findByUserId,
  updateStatus
};
