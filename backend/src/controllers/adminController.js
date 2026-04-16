const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardStats = asyncHandler(async (_req, res) => {
  const [usersCount, productsCount, orders, recentOrders] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Order.find().sort({ createdAt: -1 }),
    Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  const revenue = orders.reduce(
    (acc, order) => (order.paymentStatus === "paid" ? acc + order.total : acc),
    0
  );

  res.json({
    stats: {
      usersCount,
      productsCount,
      ordersCount: orders.length,
      revenue,
    },
    recentOrders,
  });
});

const getOrders = asyncHandler(async (_req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json({ orders });
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  order.orderStatus = req.body.orderStatus || order.orderStatus;
  order.paymentStatus = req.body.paymentStatus || order.paymentStatus;
  await order.save();

  res.json({ message: "Order updated", order });
});

const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json({ users });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.role = req.body.role || user.role;
  await user.save();

  res.json({ message: "User updated", user });
});

module.exports = {
  getDashboardStats,
  getOrders,
  updateOrderStatus,
  getUsers,
  updateUserRole,
};
