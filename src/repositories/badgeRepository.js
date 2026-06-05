const db = require('../db/connection');

function findUnlockedByUserId(userId) {
  return db.prepare(`
    SELECT
      badges.id,
      badges.name,
      badges.description,
      badges.required_points,
      user_badges.assigned_at
    FROM user_badges
    JOIN badges ON badges.id = user_badges.badge_id
    WHERE user_badges.user_id = ?
    ORDER BY badges.required_points ASC
  `).all(userId);
}

function findEligibleBadges(userId) {
  return db.prepare(`
    SELECT badges.*
    FROM badges
    JOIN users ON users.points >= badges.required_points
    WHERE users.id = ?
      AND badges.id NOT IN (
        SELECT badge_id
        FROM user_badges
        WHERE user_id = ?
      )
    ORDER BY badges.required_points ASC
  `).all(userId, userId);
}

function assignBadge(userId, badgeId) {
  return db.prepare(`
    INSERT OR IGNORE INTO user_badges (user_id, badge_id)
    VALUES (?, ?)
  `).run(userId, badgeId);
}

function assignEligibleBadges(userId) {
  const eligibleBadges = findEligibleBadges(userId);

  const transaction = db.transaction(() => {
    for (const badge of eligibleBadges) {
      assignBadge(userId, badge.id);
    }
  });

  transaction();

  return eligibleBadges;
}

module.exports = {
  findUnlockedByUserId,
  findEligibleBadges,
  assignBadge,
  assignEligibleBadges
};
