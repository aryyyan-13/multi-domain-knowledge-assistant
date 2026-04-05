const express = require('express');
const agent = require('../services/agent');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Send query and get response
 */
router.post('/query', verifyToken, async (req, res) => {
  try {
    const { query: userQuery, domainId } = req.body;
    const userId = req.userId;

    if (!userQuery || !domainId) {
      return res
        .status(400)
        .json({ error: 'Query and domainId are required' });
    }

    const result = await agent.processQuery(userQuery, domainId, userId);

    res.json(result);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

/**
 * Get query history
 */
router.get('/history/:domainId', verifyToken, async (req, res) => {
  try {
    const { query } = require('../services/database');
    const result = await query(
      'SELECT * FROM queries WHERE domain_id = $1 ORDER BY created_at DESC LIMIT 50',
      [req.params.domainId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

module.exports = router;