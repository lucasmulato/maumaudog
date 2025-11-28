const request = require('supertest');
const { app, server } = require('../index'); // Import the app and server
const db = require('../db');

// Mock the database module
jest.mock('../db', () => ({
  query: jest.fn(),
}));

// Mock the auth middleware so we don't have to deal with signature verification
jest.mock('../middleware/auth', () => ({
  verifyIFoodSignature: (req, res, next) => next(),
  verify99FoodSignature: (req, res, next) => next(),
}));

describe('API Integration Tests', () => {
  // Close the server after all tests are done
  afterAll((done) => {
    server.close(done);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/orders', () => {
    it('should fetch active orders successfully', async () => {
      const mockOrders = [
        { id: '1', customerName: 'Test User', status: 'PREPARING' },
      ];
      db.query.mockResolvedValue({ rows: mockOrders });

      const response = await request(app).get('/api/orders');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockOrders);
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining("o.status NOT IN ('COMPLETED', 'CANCELLED')"));
    });

    it('should handle database errors gracefully', async () => {
      db.query.mockRejectedValue(new Error('DB Error'));

      const response = await request(app).get('/api/orders');

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Internal Server Error' });
    });
  });

  describe('PATCH /api/orders/:id/status', () => {
    it('should update an order status successfully', async () => {
      const orderId = 'some-uuid';
      const newStatus = 'COMPLETED';
      const mockUpdatedOrder = { id: orderId, status: newStatus };

      db.query.mockResolvedValue({ rows: [mockUpdatedOrder], rowCount: 1 });

      const response = await request(app)
        .patch(`/api/orders/${orderId}/status`)
        .send({ status: newStatus });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUpdatedOrder);
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *;',
        [newStatus, orderId]
      );
    });

    it('should return 400 for an invalid status', async () => {
      const response = await request(app)
        .patch('/api/orders/some-id/status')
        .send({ status: 'INVALID_STATUS' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Invalid status provided.' });
    });
  });

  describe('POST /api/webhooks/ifood', () => {
    it('should process an iFood webhook and save the order', async () => {
      const ifoodPayload = { id: 'ifood-123', customer: { name: 'iFood Customer' }, items: [], total: { value: 100 }, payments: [] };
      
      // Mock the order saving part
      db.query.mockResolvedValue({ rows: [{ id: 'new-db-id', source_order_id: 'ifood-123' }], rowCount: 1 });

      const response = await request(app)
        .post('/api/webhooks/ifood')
        .send(ifoodPayload);

      expect(response.status).toBe(201);
      expect(response.body.message).toContain('Order received and saved successfully');
      
      // Check that the database transaction was initiated
      expect(db.query).toHaveBeenCalledWith('BEGIN');
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO orders'));
      expect(db.query).toHaveBeenCalledWith('COMMIT');
    });
  });
});