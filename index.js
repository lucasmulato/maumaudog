require('dotenv').config();
const axios = require('axios');
const { ThermalPrinter, PrinterTypes } = require('node-thermal-printer');

const BACKEND_URL = process.env.BACKEND_API_URL;
const POLL_INTERVAL = process.env.POLL_INTERVAL_MS || 5000;

async function printReceipt(order) {
  // Most thermal printers use the EPSON print type
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON,
    interface: 'usb', // Specify the interface type
    // For USB, you might need to specify the device path, e.g., on Linux: '/dev/usb/lp0'
    // You can often leave this blank and the library will try to auto-detect.
  });

  try {
    console.log(`Printing order: ${order.source_order_id}`);

    printer.alignCenter();
    printer.bold(true);
    printer.println("Maumaudog");
    printer.bold(false);
    printer.println(new Date(order.received_at).toLocaleString());
    printer.newLine();

    printer.alignLeft();
    printer.println(`Order: ${order.source_order_id} (${order.source})`);
    printer.println(`Type: ${order.order_type}`);
    if (order.customer_name) {
      printer.println(`Customer: ${order.customer_name}`);
    }
    printer.drawLine();

    // Print items
    order.items.forEach(item => {
      printer.tableCustom([
        { text: `${item.quantity}x ${item.name}`, align: "LEFT", width: 0.7 },
        { text: parseFloat(item.total_price).toFixed(2), align: "RIGHT", width: 0.3 }
      ]);
      if (item.notes) {
        printer.println(`  -> ${item.notes}`);
      }
    });

    printer.drawLine();

    // Print totals
    printer.alignRight();
    printer.println(`Subtotal: ${parseFloat(order.subtotal_price).toFixed(2)}`);
    printer.println(`Delivery: ${parseFloat(order.delivery_fee).toFixed(2)}`);
    printer.bold(true);
    printer.println(`Total: ${parseFloat(order.total_price).toFixed(2)}`);
    printer.bold(false);
    printer.newLine();

    printer.cut();
    await printer.execute();
    console.log("Print job sent successfully.");
  } catch (error) {
    console.error("Printing failed:", error);
  }
}

async function fetchAndPrintOrders() {
  console.log('Checking for new orders...');
  // TODO: Fetch new orders from the backend API
  // e.g., const response = await axios.get(`${BACKEND_URL}/orders/new`);

  // For now, we'll just print a sample order to test the logic.
  // Replace this with the actual fetched order later.
  await printReceipt(sampleOrder);

  // TODO: Mark orders as printed
}

console.log('🖨️  Printer bridge started.');
console.log(`Checking for new orders at ${BACKEND_URL} every ${POLL_INTERVAL / 1000} seconds.`);

setInterval(fetchAndPrintOrders, POLL_INTERVAL);

// --- Sample Data for Testing ---
const sampleOrder = {
  id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
  source: 'IFOOD',
  source_order_id: 'XYZ-12345',
  status: 'RECEIVED',
  order_type: 'DELIVERY',
  total_price: '35.50',
  subtotal_price: '30.00',
  delivery_fee: '5.50',
  customer_name: 'Lucas Mulato',
  received_at: new Date().toISOString(),
  items: [
    { name: 'X-Burger', quantity: 1, total_price: '15.00', notes: 'No onions' },
    { name: 'Fries', quantity: 1, total_price: '10.00', notes: null },
    { name: 'Soda', quantity: 1, total_price: '5.00', notes: null }
  ]
};