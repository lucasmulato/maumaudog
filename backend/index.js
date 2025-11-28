require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./logger');
const orderRoutes = require('./routes/orders');
const webhookRoutes = require('./routes/webhooks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // for parsing application/json
app.use(express.json({
  // We need the raw body to verify webhook signatures.
  // The 'verify' option lets us capture the raw body buffer.
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

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
});