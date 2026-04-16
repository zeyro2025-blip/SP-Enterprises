const express = require("express");
const { getRazorpayConfig } = require("../controllers/paymentController");

const router = express.Router();

router.get("/config", getRazorpayConfig);

module.exports = router;
