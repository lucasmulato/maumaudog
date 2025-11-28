const crypto = require('crypto');

/**
 * Middleware to verify the signature of iFood webhooks.
 * iFood typically sends the signature in a header like 'X-iFood-Signature'.
 * This is a hypothetical implementation, you must check iFood's documentation
 * for the exact header name and signature format (e.g., 'sha1=...').
 */
const verifyIFoodSignature = (req, res, next) => {
  const secret = process.env.IFOOD_WEBHOOK_SECRET;
  if (!secret) {
    console.error('IFOOD_WEBHOOK_SECRET is not set.');
    return res.status(500).send('Webhook secret not configured.');
  }

  // IMPORTANT: Check iFood's documentation for the correct header name.
  const signatureHeader = req.get('X-iFood-Signature');

  if (!signatureHeader) {
    return res.status(401).send('Unauthorized: No signature provided.');
  }

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(req.rawBody);
  const expectedSignature = hmac.digest('hex');

  if (expectedSignature !== signatureHeader) {
    return res.status(403).send('Forbidden: Invalid signature.');
  }

  next();
};

/**
 * Middleware to verify the signature of 99Food webhooks.
 * This is a hypothetical implementation, you must check 99Food's documentation
 * for the exact header name and signature format.
 */
const verify99FoodSignature = (req, res, next) => {
  const secret = process.env.NINETYNINEFOOD_WEBHOOK_SECRET;
  if (!secret) {
    console.error('NINETYNINEFOOD_WEBHOOK_SECRET is not set.');
    return res.status(500).send('Webhook secret not configured.');
  }

  // IMPORTANT: Check 99Food's documentation for the correct header name.
  const signatureHeader = req.get('X-99Food-Signature');

  if (!signatureHeader) {
    return res.status(401).send('Unauthorized: No signature provided.');
  }

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(req.rawBody);
  const expectedSignature = hmac.digest('hex');

  if (expectedSignature !== signatureHeader) {
    return res.status(403).send('Forbidden: Invalid signature.');
  }

  next();
};

module.exports = { verifyIFoodSignature, verify99FoodSignature };