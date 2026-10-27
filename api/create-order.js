const { Cashfree } = require('cashfree-pg');

// Product catalog — single source of truth for server-side price validation
const PRODUCTS = {
  'mini-100g': { name: 'Makhana Mini Pack', weight: '100g', price: 10 },  // TODO: restore to 149 after testing
  'gold-250g': { name: 'Gold Makhana', weight: '250g', price: 349 },
  'handle-250g': { name: 'Makhana Handle Pack', weight: '250g', price: 299 },
  'premium-250g': { name: 'Premium Makhana', weight: '250g', price: 399 },
};

const SHIPPING_FREE_THRESHOLD = 0;  // TODO: restore to 500 after testing (free shipping for all during test)
const SHIPPING_CHARGE = 0;

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

    // Initialize Cashfree
    const env = process.env.CASHFREE_ENV === 'PRODUCTION'
      ? Cashfree.PRODUCTION
      : Cashfree.SANDBOX;

    const cashfree = new Cashfree(env, process.env.CASHFREE_APP_ID, process.env.CASHFREE_SECRET_KEY);

    // Generate unique order ID
    const orderId = `ZIBBO_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // Create Cashfree order
    const request = {
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

    const response = await cashfree.PGCreateOrder(request);
    const orderData = response.data;

    return res.status(200).json({
      orderId: orderData.order_id,
      paymentSessionId: orderData.payment_session_id,
      amount: total,
      subtotal,
      shipping,
      currency: 'INR',
      cfMode: process.env.CASHFREE_ENV === 'PRODUCTION' ? 'production' : 'sandbox',
    });
  } catch (err) {
    console.error('create-order error:', err?.response?.data || err);
    return res.status(500).json({ error: 'Failed to create order' });
  }
};
