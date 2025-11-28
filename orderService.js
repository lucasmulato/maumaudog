const db = require('../db');

/**
 * Parses a raw order payload from iFood into a standardized format.
 * NOTE: This is a placeholder. You must adapt this function to the actual
 * iFood payload structure.
 * @param {object} payload The raw payload from iFood.
 * @returns {object} A standardized order object.
 */
function parseIFoodOrder(payload) {
  // TODO: Implement the actual parsing logic for an iFood order.
  return {
    source: 'IFOOD',
    source_order_id: payload.id,
    status: 'RECEIVED',
    order_type: payload.orderType === 'INDOOR' ? 'PICKUP' : 'DELIVERY',
    total_price: payload.total.value,
    subtotal_price: payload.total.subTotal,
    delivery_fee: payload.total.deliveryFee,
    customer_name: payload.customer.name,
    delivery_address: `${payload.delivery.deliveryAddress.streetName}, ${payload.delivery.deliveryAddress.streetNumber}`,
    payment_method: payload.payments.methods[0].method,
    is_paid: payload.payments.methods[0].prepaid,
    created_at: payload.createdAt,
    raw_payload: payload,
    items: payload.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
      notes: item.observations,
    })),
  };
}

/**
 * Parses a raw order payload from 99Food into a standardized format.
 * NOTE: This is a placeholder. You must adapt this function to the actual
 * 99Food payload structure.
 * @param {object} payload The raw payload from 99Food.
 * @returns {object} A standardized order object.
 */
function parse99FoodOrder(payload) {
  // TODO: Implement the actual parsing logic for a 99Food order.
  // This is a hypothetical structure.
  return {
    source: '99FOOD',
    source_order_id: payload.order_id,
    status: 'RECEIVED',
    order_type: payload.order_type.toUpperCase(),
    total_price: payload.prices.total,
    subtotal_price: payload.prices.sub_total,
    delivery_fee: payload.prices.delivery_fee,
    customer_name: payload.user.name,
    delivery_address: payload.delivery_info.address,
    payment_method: payload.payment.method,
    is_paid: payload.payment.status === 'PAID',
    created_at: new Date(payload.timestamp * 1000).toISOString(),
    raw_payload: payload,
    items: payload.items.map(item => ({
      name: item.item_name,
      quantity: item.count,
      unit_price: item.price,
      total_price: item.price * item.count,
      notes: item.customizations,
    })),
  };
}

/**
 * Saves a parsed order and its items to the database within a transaction.
 * @param {object} orderData The standardized order object.
 * @returns {object} The newly created order from the database.
 */
async function saveOrder(orderData) {
  const client = await db.pool.connect();

  try {
    await client.query('BEGIN');

    const orderQuery = `
      INSERT INTO orders (source, source_order_id, status, order_type, total_price, subtotal_price, delivery_fee, customer_name, delivery_address, payment_method, is_paid, created_at, raw_payload)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id;
    `;
    const orderValues = [
      orderData.source, orderData.source_order_id, orderData.status, orderData.order_type,
      orderData.total_price, orderData.subtotal_price, orderData.delivery_fee, orderData.customer_name,
      orderData.delivery_address, orderData.payment_method, orderData.is_paid, orderData.created_at,
      orderData.raw_payload
    ];
    const orderResult = await client.query(orderQuery, orderValues);
    const orderId = orderResult.rows[0].id;

    const itemQuery = `
      INSERT INTO order_items (order_id, name, quantity, unit_price, total_price, notes)
      VALUES ($1, $2, $3, $4, $5, $6);
    `;
    for (const item of orderData.items) {
      const itemValues = [orderId, item.name, item.quantity, item.unit_price, item.total_price, item.notes];
      await client.query(itemQuery, itemValues);
    }

    await client.query('COMMIT');

    // Return the full order with items for confirmation
    const newOrder = await client.query('SELECT * FROM orders WHERE id = $1', [orderId]);
    return newOrder.rows[0];
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error saving order to database:', e);
    throw e; // Re-throw the error to be handled by the caller
  } finally {
    client.release();
  }
}

module.exports = { parseIFoodOrder, parse99FoodOrder, saveOrder };