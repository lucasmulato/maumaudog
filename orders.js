const express = require('express');
const db = require('../db');

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
    console.error('Error fetching new orders:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/**
 * PATCH /api/orders/:id/mark-as-printed
 * Updates the status of a specific order to 'PRINTED'.
 * This is called by the printer bridge after an order has been successfully printed.
 */
router.patch('/:id/mark-as-printed', async (req, res) => {
  const { id } = req.params;

  try {
    const query = `
      UPDATE orders
      SET status = 'PRINTED'
      WHERE id = $1 AND status = 'RECEIVED'
      RETURNING *;
    `;
    const { rows, rowCount } = await db.query(query, [id]);

    if (rowCount === 0) {
      return res.status(404).json({ error: 'Order not found or already processed.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(`Error marking order ${id} as printed:`, err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;