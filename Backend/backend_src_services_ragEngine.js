const { query } = require('./database');
const { getEmbedding } = require('./embeddingService');

class RAGEngine {
  /**
   * Retrieve relevant documents using vector similarity search
   */
  async retrieveRelevantDocuments(queryText, domainId, topK = 5) {
    try {
      // Get embedding for the query
      const queryEmbedding = await getEmbedding(queryText);

      // Vector similarity search
      const result = await query(
        `
        SELECT 
          dc.id,
          dc.chunk_text,
          d.title,
          d.id as document_id,
          dom.name as domain,
          1 - (dc.embedding <=> $1::vector) as similarity_score,
          dc.metadata
        FROM document_chunks dc
        JOIN documents d ON dc.document_id = d.id
        JOIN domains dom ON d.domain_id = dom.id
        WHERE d.domain_id = $2
        ORDER BY dc.embedding <=> $1::vector
        LIMIT $3
        `,
        [queryEmbedding, domainId, topK]
      );

      return result.rows;
    } catch (error) {
      console.error('RAG retrieval error:', error);
      throw error;
    }
  }

  /**
   * Format retrieved documents for LLM context
   */
  formatContext(documents) {
    if (!documents || documents.length === 0) {
      return 'No relevant documents found.';
    }

    return documents
      .map(
        (doc, idx) =>
          `[Source ${idx + 1}] ${doc.title} (Domain: ${doc.domain})\nSimilarity: ${(
            doc.similarity_score * 100
          ).toFixed(2)}%\n\n${doc.chunk_text}`
      )
      .join('\n\n---\n\n');
  }

  /**
   * Extract sources from retrieved documents
   */
  extractSources(documents) {
    return documents.map((doc) => ({
      documentId: doc.document_id,
      title: doc.title,
      domain: doc.domain,
      similarity: doc.similarity_score,
      chunkId: doc.id,
    }));
  }
}

module.exports = new RAGEngine();