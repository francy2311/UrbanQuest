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
function findByMissionIdForCreator(missionId) {
  return db.prepare(`
    SELECT
      mission_participations.id,
      mission_participations.status,
      mission_participations.created_at,
      mission_participations.updated_at,

      users.id AS user_id,
      users.name AS user_name,
      users.email AS user_email,
      users.points AS user_points,
      users.profile_image_path AS user_profile_image_path,

      proofs.id AS proof_id,
      proofs.text AS proof_text,
      proofs.image_path AS proof_image_path,
      proofs.status AS proof_status,
      proofs.created_at AS proof_created_at
    FROM mission_participations
    JOIN users ON users.id = mission_participations.user_id
    LEFT JOIN proofs ON proofs.participation_id = mission_participations.id
    WHERE mission_participations.mission_id = ?
    ORDER BY mission_participations.created_at DESC
  `).all(missionId);
}
module.exports = {
  findByMissionAndUser,
  create,
  findById,
  findByUserId,
  updateStatus,
  findByMissionIdForCreator
};
