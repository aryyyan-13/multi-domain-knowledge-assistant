const axios = require('axios');

/**
 * Get embedding for text using OpenAI API (for now)
 * You can replace this with Anthropic embeddings if they provide an API
 */
async function getEmbedding(text) {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        input: text,
        model: 'text-embedding-3-small',
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data[0].embedding;
  } catch (error) {
    console.error('Embedding service error:', error);
    throw error;
  }
}

module.exports = { getEmbedding };