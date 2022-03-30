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
    if (!rows[0]) return null;
    return rows.map(row => new Secret(row));
  }

  static async create({ title, description }) {
    const { rows } = await pool.query(
      `
      INSERT INTO
        secrets (title, description)
      VALUES
        ($1, $2)
      RETURNING
        *
      `, [title, description]
    );
    if (!rows[0]) return null;
    return new Secret(rows[0]);
  }

};
