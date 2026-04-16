const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product");
const razorpay = require("../config/razorpay");
const asyncHandler = require("../utils/asyncHandler");

const SHIPPING_FEE = 99;

const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress } = req.body;

  if (!items?.length) {
    const error = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  const productIds = items.map((item) => item.productId);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((product) => [product._id.toString(), product]));

  const normalizedItems = items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) {
      const error = new Error("One or more products were not found");
      error.statusCode = 404;
      throw error;
    }

    if (product.stock < item.quantity) {
      const error = new Error(`Insufficient stock for ${product.name}`);
      error.statusCode = 400;
      throw error;
    }

    return {
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: item.quantity,
    };
  });

  const subtotal = normalizedItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const total = subtotal + SHIPPING_FEE;

  const order = await Order.create({
    user: req.user._id,
    items: normalizedItems,
    shippingAddress,
    subtotal,
    shippingFee: SHIPPING_FEE,
    total,
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: total * 100,
    currency: "INR",
    receipt: `sp_order_${order._id}`,
  });

  order.razorpayOrderId = razorpayOrder.id;
  await order.save();

  res.status(201).json({
    message: "Order created",
    order,
    razorpay: {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key: process.env.RAZORPAY_KEY_ID,
    },
  });
});

const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
  const order = await Order.findById(orderId).populate("items.product");

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  const digest = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpayOrderId}|${razorpayPaymentId}`)
    .digest("hex");

  if (digest !== razorpaySignature) {
    order.paymentStatus = "failed";
    await order.save();
    const error = new Error("Payment verification failed");
    error.statusCode = 400;
    throw error;
  }

  order.paymentStatus = "paid";
  order.orderStatus = "confirmed";
  order.razorpayPaymentId = razorpayPaymentId;
  order.paidAt = new Date();
  await order.save();

  for (const item of order.items) {
    const product = await Product.findById(item.product._id);
    if (product) {
      product.stock = Math.max(0, product.stock - item.quantity);
      await product.save();
    }
  }

  res.json({ message: "Payment verified successfully", order });
});

const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ orders });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.product", "name slug");

  if (!order) {
    const error = new Error("Order not found");
    error.statusCode = 404;
    throw error;
  }

  if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
    const error = new Error("Not authorized to access this order");
    error.statusCode = 403;
    throw error;
  }

  res.json({ order });
});

module.exports = {
  createOrder,
  verifyPayment,
  getMyOrders,
  getOrderById,
};
