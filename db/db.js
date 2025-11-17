const { Pool } = require('pg');

// The Pool will automatically use the environment variables
const pool = new Pool();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
