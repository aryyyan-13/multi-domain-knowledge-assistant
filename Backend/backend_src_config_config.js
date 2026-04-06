module.exports = {
  database: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'rag_assistant',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
  },
  anthropic: {
    apiKey: process.env.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,
    model: process.env.ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
  },
  jwt: {
    secret: process.env.JWT_SECRET || '^aAY)hY[3FU}f_*uzV?mwWru!TJ]cw_(Ver<1A#y<DK8vIWL}L2p=5?wastr&r9@OfB+T|&JbjI-LzyJL@F+[N',
    expiresIn: '7d',
  },
  embedding: {
    dimension: 1536, // For text-embedding-3-small via OpenAI (or similar)
    model: 'text-embedding-3-small',
  },
};
