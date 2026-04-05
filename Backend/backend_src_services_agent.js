const Anthropic = require('@anthropic-ai/sdk');
const config = require('../config/config');
const ragEngine = require('./ragEngine');
const { query } = require('./database');

const client = new Anthropic();

class Agent {
  constructor() {
    this.conversationHistory = [];
  }

  /**
   * Main agent orchestration logic
   */
  async processQuery(userQuery, domainId, userId) {
    try {
      console.log(`Processing query: "${userQuery}" for domain ${domainId}`);

      // Step 1: Retrieve relevant documents via RAG
      const relevantDocs = await ragEngine.retrieveRelevantDocuments(
        userQuery,
        domainId,
        5
      );
      
      const context = ragEngine.formatContext(relevantDocs);
      const sources = ragEngine.extractSources(relevantDocs);

      // Step 2: Prepare system prompt
      const systemPrompt = `You are an intelligent enterprise knowledge assistant specializing in multi-domain documentation.

Your responsibilities:
1. Answer user queries based on the provided context
2. Be concise and clear
3. Always cite sources from the provided documents
4. If you're unsure or information isn't in the context, say so explicitly
5. Maintain a professional tone

Context from enterprise documentation:
${context}`;

      // Step 3: Call Anthropic Claude
      const response = await client.messages.create({
        model: config.anthropic.model,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: 'user',
            content: userQuery,
          },
        ],
      });

      const assistantResponse = response.content[0].text;

      // Step 4: Calculate confidence score
      const confidenceScore =
        relevantDocs.length > 0 ? relevantDocs[0].similarity_score : 0;

      // Step 5: Log the query
      await query(
        `
        INSERT INTO queries (user_id, domain_id, query_text, response, sources, confidence_score)
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          userId,
          domainId,
          userQuery,
          assistantResponse,
          JSON.stringify(sources),
          confidenceScore,
        ]
      );

      return {
        response: assistantResponse,
        sources: sources,
        confidenceScore: confidenceScore,
        retrievedDocuments: relevantDocs.length,
      };
    } catch (error) {
      console.error('Agent processing error:', error);
      throw error;
    }
  }

  /**
   * Multi-turn conversation (optional, for future enhancement)
   */
  async chat(userMessage, domainId, userId) {
    this.conversationHistory.push({
      role: 'user',
      content: userMessage,
    });

    // Add more sophisticated multi-turn logic here if needed
    const result = await this.processQuery(userMessage, domainId, userId);

    this.conversationHistory.push({
      role: 'assistant',
      content: result.response,
    });

    return result;
  }
}

module.exports = new Agent();