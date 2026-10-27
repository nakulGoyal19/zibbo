const { Cashfree } = require('cashfree-pg');

// Product catalog — single source of truth for server-side price validation
const PRODUCTS = {
  'mini-100g': { name: 'Makhana Mini Pack', weight: '100g', price: 149 },
  'gold-250g': { name: 'Gold Makhana', weight: '250g', price: 349 },
  'handle-250g': { name: 'Makhana Handle Pack', weight: '250g', price: 299 },
  'premium-250g': { name: 'Premium Makhana', weight: '250g', price: 399 },
};

const SHIPPING_FREE_THRESHOLD = 500;
const SHIPPING_CHARGE = 50;

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { items, customer } = req.body;

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items in order' });
    }

    // Validate customer
    if (!customer || !customer.name || !customer.phone || !customer.address ||
        !customer.city || !customer.state || !customer.pincode) {
      return res.status(400).json({ error: 'Missing customer details' });
    }

    // Calculate total server-side (never trust client amounts)
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = PRODUCTS[item.id];
      if (!product) return res.status(400).json({ error: `Unknown product: ${item.id}` });
      if (!item.qty || item.qty < 1 || item.qty > 100) {
        return res.status(400).json({ error: `Invalid qty for ${item.id}` });
      }
      const lineTotal = product.price * item.qty;
      subtotal += lineTotal;
      orderItems.push({ ...product, qty: item.qty, lineTotal });
    }

    const shipping = subtotal >= SHIPPING_FREE_THRESHOLD ? 0 : SHIPPING_CHARGE;
    const total = subtotal + shipping;

    // Generate unique order ID
    const orderId = `ZIBBO_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Determine environment
    const isProd = process.env.CASHFREE_ENV === 'PRODUCTION';
    const baseUrl = isProd
      ? 'https://api.cashfree.com/pg'
      : 'https://sandbox.cashfree.com/pg';

    // Create order via REST API directly (more reliable than SDK version mismatches)
    const orderRequest = {
      order_amount: total,
      order_currency: 'INR',
      order_id: orderId,
      customer_details: {
        customer_id: `cust_${customer.phone}`,
        customer_phone: customer.phone,
        customer_name: customer.name,
      },
      order_meta: {
        return_url: `${req.headers.origin || 'https://zibbofoods.com'}/api/verify-payment?order_id={order_id}`,
      },
      order_note: `${orderItems.map(i => `${i.name} x${i.qty}`).join(', ')} | ${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
      order_tags: {
        delivery_address: `${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
        customer_phone: customer.phone,
      },
    };

    const response = await fetch(`${baseUrl}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': process.env.CASHFREE_APP_ID,
        'x-client-secret': process.env.CASHFREE_SECRET_KEY,
        'x-api-version': '2023-08-01',
      },
      body: JSON.stringify(orderRequest),
    });

    const orderData = await response.json();

    if (!response.ok) {
      console.error('Cashfree API error:', JSON.stringify(orderData));
      return res.status(500).json({ error: orderData.message || 'Failed to create order' });
    }

    return res.status(200).json({
      orderId: orderData.order_id,
      paymentSessionId: orderData.payment_session_id,
      amount: total,
      subtotal,
      shipping,
      currency: 'INR',
      cfMode: isProd ? 'production' : 'sandbox',
    });
  } catch (err) {
    console.error('create-order error:', err);
    return res.status(500).json({ error: 'Failed to create order: ' + (err.message || 'Unknown error') });
  }
};
