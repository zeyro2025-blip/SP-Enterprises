const asyncHandler = require("../utils/asyncHandler");

const getRazorpayConfig = asyncHandler(async (_req, res) => {
  res.json({
    key: process.env.RAZORPAY_KEY_ID,
  });
});

module.exports = {
  getRazorpayConfig,
};
