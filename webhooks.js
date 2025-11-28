const express = require('express');
const { parseIFoodOrder, parse99FoodOrder, saveOrder } = require('../services/orderService');
const { verifyIFoodSignature, verify99FoodSignature } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/webhooks/ifood
 * Webhook endpoint to receive new order notifications from iFood.
 */
router.post('/ifood', verifyIFoodSignature, async (req, res) => {
  const payload = req.body;
  console.log('Received iFood webhook payload:', JSON.stringify(payload, null, 2));

  try {
    // 1. Parse the raw payload into our standard format
    const standardizedOrder = parseIFoodOrder(payload);

    // 2. Save the order to the database
    const newOrder = await saveOrder(standardizedOrder);

    logger.info(`Successfully saved iFood order ${newOrder.source_order_id}`, { dbId: newOrder.id });

    // Broadcast the new order to all connected WebSocket clients
    const wss = req.app.get('wss');
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({
          type: 'NEW_ORDER',
          // We need to fetch the full order details with items for the frontend
          // For simplicity, we'll just send what we have. A better approach
          // would be to re-fetch the order with items before broadcasting.
          payload: { ...standardizedOrder, id: newOrder.id, customerName: standardizedOrder.customer_name, createdAt: standardizedOrder.created_at },
        }));
      }
    });

    res.status(201).json({ message: 'Order received and saved successfully.', orderId: newOrder.id });
  } catch (err) {
    // The saveOrder service handles logging. We just need to send the response.
    // A UNIQUE constraint violation will likely be the cause of errors here.
    res.status(409).json({ error: 'Failed to save order. It may already exist.' });
  }
});

/**
 * POST /api/webhooks/99food
 * Webhook endpoint to receive new order notifications from 99Food.
 */
router.post('/99food', verify99FoodSignature, async (req, res) => {
  const payload = req.body;
  console.log('Received 99Food webhook payload:', JSON.stringify(payload, null, 2));

  try {
    // 1. Parse the raw payload into our standard format
    const standardizedOrder = parse99FoodOrder(payload);

    // 2. Save the order to the database
    const newOrder = await saveOrder(standardizedOrder);

    logger.info(`Successfully saved 99Food order ${newOrder.source_order_id}`, { dbId: newOrder.id });

    // Broadcast the new order to all connected WebSocket clients
    const wss = req.app.get('wss');
    wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(JSON.stringify({
          type: 'NEW_ORDER',
          // We need to fetch the full order details with items for the frontend
          // For simplicity, we'll just send what we have. A better approach
          // would be to re-fetch the order with items before broadcasting.
          payload: { ...standardizedOrder, id: newOrder.id, customerName: standardizedOrder.customer_name, createdAt: standardizedOrder.created_at },
        }));
      }
    });
    res.status(201).json({ message: 'Order received and saved successfully.', orderId: newOrder.id });
  } catch (err) {
    // The saveOrder service handles logging. We just need to send the response.
    // A UNIQUE constraint violation will likely be the cause of errors here.
    res.status(409).json({ error: 'Failed to save order. It may already exist.' });
  }
});

module.exports = router;