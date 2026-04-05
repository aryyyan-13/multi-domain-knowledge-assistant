const express = require('express');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../services/database');
const { verifyToken } = require('../middleware/auth');
const { getEmbedding } = require('../services/embeddingService');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Upload and process document
 */
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    const { domainId, title } = req.body;
    const fileContent = req.file.buffer.toString('utf-8');

    // Insert document
    const docResult = await query(
      'INSERT INTO documents (title, content, domain_id, file_path, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [title || req.file.originalname, fileContent, domainId, req.file.originalname, JSON.stringify({ fileSize: req.file.size })]
    );

    const documentId = docResult.rows[0].id;

    // Chunk document (simple chunking by paragraphs)
    const chunks = chunkDocument(fileContent);

    // Create embeddings for each chunk
    for (let i = 0; i < chunks.length; i++) {
      const embedding = await getEmbedding(chunks[i]);
      await query(
        'INSERT INTO document_chunks (document_id, chunk_text, chunk_index, embedding, metadata) VALUES ($1, $2, $3, $4, $5)',
        [documentId, chunks[i], i, JSON.stringify(embedding), JSON.stringify({ chunkIndex: i })]
      );
    }

    res.json({
      message: 'Document uploaded successfully',
      documentId,
      chunksCreated: chunks.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Document upload failed' });
  }
});

/**
 * Get documents for a domain
 */
router.get('/domain/:domainId', verifyToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, title, created_at FROM documents WHERE domain_id = $1 ORDER BY created_at DESC',
      [req.params.domainId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
});

/**
 * Delete document
 */
router.delete('/:documentId', verifyToken, async (req, res) => {
  try {
    await query('DELETE FROM documents WHERE id = $1', [
      req.params.documentId,
    ]);
    res.json({ message: 'Document deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

/**
 * Simple document chunking
 */
function chunkDocument(text, chunkSize = 500) {
  const chunks = [];
  const paragraphs = text.split('\n\n');

  let currentChunk = '';
  for (const paragraph of paragraphs) {
    if ((currentChunk + paragraph).length > chunkSize) {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = paragraph;
    } else {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    }
  }
  if (currentChunk) chunks.push(currentChunk.trim());

  return chunks;
}

module.exports = router;