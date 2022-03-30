const pool = require('../utils/pool');

module.exports = class Secret {
  id;
  title;
  description;
  createdAt;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.description = row.description;
    this.createdAt = row.created_at;
  }

  static async getAll() {
    const { rows } = await pool.query(
      `
    SELECT
      title, description, created_at
    FROM
      secrets
    `
    );
    return rows.map(row => new Secret(row));
  }

};
