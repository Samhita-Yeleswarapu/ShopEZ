const Order = require('../models/Order');
const Product = require('../models/Product');

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cannot place an order with no items' });
    }

    // recalculate prices server-side from the DB instead of trusting the client
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      const unitPrice = product.discountPercentage
        ? Math.round(product.price * (1 - product.discountPercentage / 100))
        : product.price;

      subtotal += unitPrice * item.quantity;

      orderItems.push({
        product: product._id,
        title: product.title,
        image: product.images?.[0] || '',
        price: unitPrice,
        quantity: item.quantity,
        selectedSize: item.selectedSize || null
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: 'None of the items in your cart could be found' });
    }

    const shipping = subtotal > 999 ? 0 : 79;
    const tax = Math.round(subtotal * 0.05); // 5% GST, kept simple
    const total = subtotal + shipping + tax;

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'cod',
      subtotal,
      shipping,
      tax,
      total
    });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('createOrder error:', err.message);
    res.status(500).json({ message: 'Could not place order' });
  }
};

// GET /api/orders/my-orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch your orders' });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    // a user can only view their own order, unless they're an admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    res.json(order);
  } catch (err) {
    res.status(404).json({ message: 'Order not found' });
  }
};

// GET /api/orders  (admin only - all orders)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Could not fetch orders' });
  }
};

// PUT /api/orders/:id/status  (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Could not update order status' });
  }
};
