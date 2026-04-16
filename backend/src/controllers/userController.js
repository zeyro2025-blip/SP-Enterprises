const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  user.name = req.body.name || user.name;

  if (req.body.password) {
    user.password = req.body.password;
  }

  await user.save();

  res.json({
    message: "Profile updated",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

module.exports = {
  updateProfile,
};
