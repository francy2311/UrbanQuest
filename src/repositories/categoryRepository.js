const db = require('../db/connection');

function findAll() {
  return db.prepare(`
    SELECT id, name
    FROM categories
    ORDER BY name ASC
  `).all();
}

module.exports = {
  findAll
};
