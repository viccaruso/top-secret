const pool = require('../utils/pool');

module.exports = class User {
  id;
  email;
  #hashedPassword;

  constructor(row) {
    this.id = row.id;
    this.email = row.email;
    this.#hashedPassword = row.password_hash;
  }

  static async insert({ email, hashedPassword }) {
    const { rows } = await pool.query(
      `
      INSERT INTO
        users (email, password_hash)
      VALUES
        ($1, $2)
      RETURNING
        *
      `, [email, hashedPassword]
    );
    if (!rows[0]) return null;
    return new User(rows[0]);
  }
};
