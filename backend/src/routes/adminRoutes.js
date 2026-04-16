const express = require("express");
const {
  getDashboardStats,
  getOrders,
  updateOrderStatus,
  getUsers,
  updateUserRole,
} = require("../controllers/adminController");
const { getProducts } = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/dashboard", getDashboardStats);
router.get("/orders", getOrders);
router.put("/orders/:id", updateOrderStatus);
router.get("/products", getProducts);
router.get("/users", getUsers);
router.put("/users/:id", updateUserRole);

module.exports = router;
