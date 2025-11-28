const express = require('express');
const db = require('../db');
const logger = require('../logger');

const router = express.Router();

/**
 * GET /api/orders/new
 * Fetches all orders that are in the 'RECEIVED' state, ready to be printed.
 * It returns a list of orders, each with its associated items.
 */
router.get('/new', async (req, res) => {
  try {
    // This query fetches orders and aggregates their items into a JSON array.
    const query = `
      SELECT
        o.*,
        (
          SELECT COALESCE(json_agg(oi.*), '[]'::json)
          FROM order_items AS oi
          WHERE oi.order_id = o.id
        ) AS items
      FROM orders AS o
      WHERE o.status = 'RECEIVED'
      ORDER BY o.received_at ASC;
    `;

    const { rows } = await db.query(query);
    res.json(rows);
  } catch (err) {
    logger.error('Error fetching new orders:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;