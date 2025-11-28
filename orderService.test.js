const { parseIFoodOrder, parse99FoodOrder, saveOrder } = require('./orderService');
const db = require('../db');

// Mock the database module
jest.mock('../db', () => ({
  query: jest.fn(),
}));

describe('Order Service', () => {
  afterEach(() => {
    // Clear all mocks after each test
    jest.clearAllMocks();
  });

  describe('parseIFoodOrder', () => {
    it('should parse an iFood order payload into the standard format', () => {
      const ifoodPayload = {
        id: 'ifood-order-123',
        createdAt: '2023-10-27T10:00:00.000Z',
        customer: { name: 'John Doe' },
        items: [
          { name: 'X-Burger', quantity: 1, unitPrice: 1500 },
          { name: 'Fries', quantity: 2, unitPrice: 500 },
        ],
        total: { value: 2500 },
        payments: [{ method: 'CREDIT_CARD', value: 2500 }],
      };

      const expected = {
        source: 'IFOOD',
        source_order_id: 'ifood-order-123',
        customer_name: 'John Doe',
        status: 'RECEIVED',
        total_amount: 2500,
        received_at: expect.any(Date),
        created_at: new Date('2023-10-27T10:00:00.000Z'),
        items: [
          { name: 'X-Burger', quantity: 1, price: 1500 },
          { name: 'Fries', quantity: 2, price: 500 },
        ],
        payments: [{ method: 'CREDIT_CARD', amount: 2500 }],
      };

      const result = parseIFoodOrder(ifoodPayload);
      expect(result).toEqual(expected);
    });
  });

  describe('parse99FoodOrder', () => {
    it('should parse a 99Food order payload into the standard format', () => {
      const ninetyNineFoodPayload = {
        order_id: '99food-order-456',
        create_time: 1698397200, // Unix timestamp
        user: { name: 'Jane Smith' },
        products: [
          { item_name: 'Pizza', quantity: 1, actual_price: 3000 },
        ],
        payment_info: {
          total_pay_amount: 3000,
          pay_method: 'ONLINE',
        },
      };

      const expected = {
        source: '99FOOD',
        source_order_id: '99food-order-456',
        customer_name: 'Jane Smith',
        status: 'RECEIVED',
        total_amount: 3000,
        received_at: expect.any(Date),
        created_at: new Date(1698397200 * 1000),
        items: [
          { name: 'Pizza', quantity: 1, price: 3000 },
        ],
        payments: [{ method: 'ONLINE', amount: 3000 }],
      };

      const result = parse99FoodOrder(ninetyNineFoodPayload);
      expect(result).toEqual(expected);
    });
  });

  describe('saveOrder', () => {
    it('should save a standardized order and its items to the database', async () => {
      const standardizedOrder = {
        source: 'IFOOD',
        source_order_id: 'test-order-id',
        customer_name: 'Test Customer',
        status: 'RECEIVED',
        total_amount: 3550,
        received_at: new Date(),
        created_at: new Date(),
        items: [
          { name: 'Item 1', quantity: 1, price: 2000 },
          { name: 'Item 2', quantity: 2, price: 775 },
        ],
        payments: [{ method: 'CASH', amount: 3550 }],
      };

      const mockOrderResult = {
        rows: [{ id: 'db-order-uuid', source_order_id: 'test-order-id' }],
        rowCount: 1,
      };

      // Mock the return value for the database queries
      db.query.mockResolvedValueOnce(mockOrderResult); // For inserting into 'orders'
      db.query.mockResolvedValue({ rows: [], rowCount: 1 }); // For inserting into 'order_items' and 'order_payments'

      const result = await saveOrder(standardizedOrder);

      // Expect the order to be returned
      expect(result).toEqual(mockOrderResult.rows[0]);

      // Check that the transaction was started and committed
      expect(db.query).toHaveBeenCalledWith('BEGIN');
      expect(db.query).toHaveBeenCalledWith('COMMIT');

      // Check the main order insertion
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO orders'),
        [
          standardizedOrder.source,
          standardizedOrder.source_order_id,
          standardizedOrder.customer_name,
          standardizedOrder.status,
          standardizedOrder.total_amount,
          standardizedOrder.received_at,
          standardizedOrder.created_at,
        ]
      );

      // Check the order items insertion
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO order_items'),
        ['db-order-uuid', 'Item 1', 1, 2000]
      );
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO order_items'),
        ['db-order-uuid', 'Item 2', 2, 775]
      );

      // Check the order payments insertion
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO order_payments'),
        ['db-order-uuid', 'CASH', 3550]
      );
    });
  });
});