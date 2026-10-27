const { Cashfree } = require('cashfree-pg');

module.exports = async (req, res) => {
  // Handle both GET (redirect return) and POST (JS verification)
  const orderId = req.method === 'GET' ? req.query.order_id : req.body?.order_id;

  // If GET request (redirect from Cashfree), redirect to site with order_id
  if (req.method === 'GET' && orderId) {
    // Verify order status then redirect to main site with result
    try {
      const env = process.env.CASHFREE_ENV === 'PRODUCTION'
        ? Cashfree.PRODUCTION
        : Cashfree.SANDBOX;

      const cashfree = new Cashfree(env, process.env.CASHFREE_APP_ID, process.env.CASHFREE_SECRET_KEY);
      const response = await cashfree.PGFetchOrder(orderId);
      const order = response.data;

      if (order.order_status === 'PAID') {
        return res.redirect(`/?payment=success&order_id=${orderId}&amount=${order.order_amount}`);
      } else {
        return res.redirect(`/?payment=failed&order_id=${orderId}`);
      }
    } catch (err) {
      console.error('verify redirect error:', err?.response?.data || err);
      return res.redirect(`/?payment=failed&order_id=${orderId || 'unknown'}`);
    }
  }

  // POST request — JS-based verification
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    if (!orderId) {
      return res.status(400).json({ error: 'Missing order_id' });
    }

    const env = process.env.CASHFREE_ENV === 'PRODUCTION'
      ? Cashfree.PRODUCTION
      : Cashfree.SANDBOX;

    const cashfree = new Cashfree(env, process.env.CASHFREE_APP_ID, process.env.CASHFREE_SECRET_KEY);
    const response = await cashfree.PGFetchOrder(orderId);
    const order = response.data;

    if (order.order_status === 'PAID') {
      return res.status(200).json({
        verified: true,
        orderId: order.order_id,
        amount: order.order_amount,
        paymentId: order.cf_order_id,
      });
    } else {
      return res.status(200).json({
        verified: false,
        orderId: order.order_id,
        status: order.order_status,
      });
    }
  } catch (err) {
    console.error('verify-payment error:', err?.response?.data || err);
    return res.status(500).json({ error: 'Verification failed' });
  }
};
