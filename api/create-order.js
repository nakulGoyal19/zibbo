const Razorpay = require('razorpay');

// Product catalog — single source of truth for server-side price validation
const PRODUCTS = {
  'mini-100g': { name: 'Makhana Mini Pack', weight: '100g', price: 12000 },       // paise
  'gold-250g': { name: 'Gold Makhana', weight: '250g', price: 32500 },
  'handle-250g': { name: 'Makhana Handle Pack', weight: '250g', price: 27500 },
  'premium-250g': { name: 'Premium Makhana', weight: '250g', price: 40000 },
};

const SHIPPING_FREE_THRESHOLD = 50000; // ₹500 in paise
const SHIPPING_CHARGE = 5000;          // ₹50 in paise

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

    // Create Razorpay order
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: total,
      currency: 'INR',
      notes: {
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_address: `${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
        items: orderItems.map(i => `${i.name} x${i.qty}`).join(', '),
      },
    });

    return res.status(200).json({
      orderId: order.id,
      amount: total,
      subtotal,
      shipping,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    console.error('create-order error:', err);
    return res.status(500).json({ error: 'Failed to create order' });
  }
};
