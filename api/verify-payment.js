module.exports = async (req, res) => {
  const orderId = req.method === 'GET' ? req.query.order_id : req.body?.order_id;

  const isProd = process.env.CASHFREE_ENV === 'PRODUCTION';
  const baseUrl = isProd
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

  // GET request — redirect return from Cashfree checkout
  if (req.method === 'GET' && orderId) {
    try {
      const response = await fetch(`${baseUrl}/orders/${orderId}`, {
        headers: {
          'x-client-id': process.env.CASHFREE_APP_ID,
          'x-client-secret': process.env.CASHFREE_SECRET_KEY,
          'x-api-version': '2023-08-01',
        },
      });

      const order = await response.json();

      if (response.ok && order.order_status === 'PAID') {
        return res.redirect(`/?payment=success&order_id=${orderId}&amount=${order.order_amount}`);
      } else {
        return res.redirect(`/?payment=failed&order_id=${orderId}`);
      }
    } catch (err) {
      console.error('verify redirect error:', err);
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

    const response = await fetch(`${baseUrl}/orders/${orderId}`, {
      headers: {
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
      },
    });

    const order = await response.json();

    if (response.ok && order.order_status === 'PAID') {
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
    console.error('verify-payment error:', err);
    return res.status(500).json({ error: 'Verification failed' });
  }
};
