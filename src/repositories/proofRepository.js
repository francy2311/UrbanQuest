const db = require('../db/connection');

function create({ participationId, text, imagePath }) {
  const result = db.prepare(`
    INSERT INTO proofs (participation_id, text, image_path, status)
    VALUES (?, ?, ?, 'pending')
  `).run(participationId, text, imagePath || null);

  return findById(result.lastInsertRowid);
}

function findById(id) {
  return db.prepare(`
    SELECT *
    FROM proofs
    WHERE id = ?
  `).get(id);
}

function findByParticipationId(participationId) {
  return db.prepare(`
    SELECT *
    FROM proofs
    WHERE participation_id = ?
    ORDER BY created_at DESC
  `).get(participationId);
}

function findPendingByCreatorId(creatorId) {
  return db.prepare(`
    SELECT
      proofs.id,
      proofs.text,
      proofs.image_path,
      proofs.status,
      proofs.created_at,
      mission_participations.id AS participation_id,
      mission_participations.user_id AS participant_id,
      missions.id AS mission_id,
      missions.title AS mission_title,
      missions.points,
      users.name AS participant_name,
      users.email AS participant_email
    FROM proofs
    JOIN mission_participations
      ON mission_participations.id = proofs.participation_id
    JOIN missions
      ON missions.id = mission_participations.mission_id
    JOIN users
      ON users.id = mission_participations.user_id
    WHERE missions.creator_id = ?
      AND proofs.status = 'pending'
      AND mission_participations.status = 'submitted'
    ORDER BY proofs.created_at DESC
  `).all(creatorId);
}

function updateStatus(id, status, reviewerNote = null) {
  return db.prepare(`
    UPDATE proofs
    SET status = ?, reviewer_note = ?
    WHERE id = ?
  `).run(status, reviewerNote, id);
}

module.exports = {
  create,
  findById,
  findByParticipationId,
  findPendingByCreatorId,
  updateStatus,
  findReviewedByCreatorId
};
function findReviewedByCreatorId(creatorId) {
  return db.prepare(`
    SELECT
      proofs.id,
      proofs.text,
      proofs.image_path,
      proofs.status,
      proofs.reviewer_note,
      proofs.created_at,
      mission_participations.id AS participation_id,
      mission_participations.user_id AS participant_id,
      mission_participations.status AS participation_status,
      missions.id AS mission_id,
      missions.title AS mission_title,
      missions.points,
      users.name AS participant_name,
      users.email AS participant_email
    FROM proofs
    JOIN mission_participations
      ON mission_participations.id = proofs.participation_id
    JOIN missions
      ON missions.id = mission_participations.mission_id
    JOIN users
      ON users.id = mission_participations.user_id
    WHERE missions.creator_id = ?
      AND proofs.status IN ('approved', 'rejected')
    ORDER BY proofs.created_at DESC
  `).all(creatorId);
}
