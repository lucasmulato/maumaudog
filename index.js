require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
const logger = require('./backend/logger'); // Assuming logger is in backend
const orderRoutes = require('./routes/orders');
const webhookRoutes = require('./routes/webhooks');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Set up WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  logger.info('Client connected to WebSocket');
  ws.on('close', () => {
    logger.info('Client disconnected');
  });
});

app.set('wss', wss); // Make wss available to routes

// Middlewares
app.use(cors()); // Allow cross-origin requests
// We need the raw body to verify webhook signatures.
// The 'verify' option lets us capture the raw body buffer.
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/webhooks', webhookRoutes);

app.get('/', (req, res) => {
  res.send('MauMauDog Backend is running!');
});

// Start the server only if this file is run directly
if (require.main === module) {
  server.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = {
  app,
  server,
};