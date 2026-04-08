const Order = require('../models/Order');
const Item = require('../models/Item');

// @desc  Create new order
// @route POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { customerName, customerPhone, customerEmail, items, paymentMethod, orderNote, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No items in order' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const cartItem of items) {
      const item = await Item.findById(cartItem._id);
      if (!item) {
        return res.status(404).json({ success: false, message: `Item not found: ${cartItem.name}` });
      }
      if (item.stock < cartItem.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${item.name}` });
      }

      orderItems.push({
        item: item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: cartItem.quantity
      });

      totalAmount += item.price * cartItem.quantity;

      // Reduce stock
      const newStock = item.stock - cartItem.quantity;
      await Item.findByIdAndUpdate(item._id, {
        stock: newStock,
        isAvailable: newStock > 0
      });
    }

    const order = new Order({
      customerName,
      customerPhone,
      customerEmail,
      items: orderItems,
      totalAmount,
      paymentMethod,
      orderNote,
      address
    });

    await order.save();
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Get all orders (admin)
// @route GET /api/orders
const getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = status ? { orderStatus: status } : {};
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Order.countDocuments(query);
    res.json({ success: true, orders, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc  Update order status (admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const update = {};
    if (orderStatus) update.orderStatus = orderStatus;
    if (paymentStatus) update.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc  Get dashboard stats (admin)
// @route GET /api/orders/stats
const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayOrders = await Order.countDocuments({ createdAt: { $gte: todayStart } });
    const revenue = await Order.aggregate([
      { $match: { paymentStatus: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const pendingOrders = await Order.countDocuments({ orderStatus: 'Placed' });
    const totalItems = await require('../models/Item').countDocuments();
    const lowStockItems = await require('../models/Item').countDocuments({ stock: { $lt: 5 } });

    res.json({
      success: true,
      stats: {
        totalOrders,
        todayOrders,
        totalRevenue: revenue[0]?.total || 0,
        pendingOrders,
        totalItems,
        lowStockItems
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus, getDashboardStats };
