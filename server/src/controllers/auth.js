const authService = require("../services/auth");
const { asyncHandler } = require("../utils/asyncHandler");

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email and password",
    });
  }

  const result = await authService.login(email, password);

  res.status(200).json({
    success: true,
    data: result,
  });
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = {
  login,
  getMe,
};
