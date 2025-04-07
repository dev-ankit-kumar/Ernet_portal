// src/app/lib/db.ts
import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ernet_india_users_portal'
};

// Create a connection pool instead of a single connection
const pool = mysql.createPool(dbConfig);

export default {
  async execute(query: string, params: any[] = []) {
    try {
      const [results] = await pool.execute(query, params);
      return [results];
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    }
  }
};