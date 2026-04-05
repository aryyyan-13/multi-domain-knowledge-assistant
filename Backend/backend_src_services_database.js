const { Pool } = require('pg');
const config = require('../config/config');

const pool = new Pool(config.database);

// Initialize database schema
async function initializeDatabase() {
  const client = await pool.connect();
  try {
    // Enable vector extension
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Domains table
    await client.query(`
      CREATE TABLE IF NOT EXISTS domains (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description TEXT,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Documents table
    await client.query(`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        domain_id INTEGER REFERENCES domains(id) ON DELETE CASCADE,
        file_path VARCHAR(255),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Document chunks table (for RAG)
    await client.query(`
      CREATE TABLE IF NOT EXISTS document_chunks (
        id SERIAL PRIMARY KEY,
        document_id INTEGER REFERENCES documents(id) ON DELETE CASCADE,
        chunk_text TEXT NOT NULL,
        chunk_index INTEGER,
        embedding vector(1536),
        metadata JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index on embeddings for fast similarity search
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_embedding_search 
      ON document_chunks USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100)
    `);

    // Queries table (for logging)
    await client.query(`
      CREATE TABLE IF NOT EXISTS queries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        domain_id INTEGER REFERENCES domains(id),
        query_text TEXT NOT NULL,
        response TEXT,
        sources JSONB,
        confidence_score FLOAT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Query helper
async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

module.exports = {
  pool,
  query,
  initializeDatabase,
};