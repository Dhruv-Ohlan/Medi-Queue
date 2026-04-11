const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const env = require("../config/env");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

const login = async (email, password) => {
  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);

  // Return user without sensitive data
  const userObj = user.toObject();
  delete userObj.passwordHash;

  return { user: userObj, token };
};

const getUserById = async (userId) => {
  const user = await User.findById(userId).populate("departmentId");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

module.exports = {
  login,
  getUserById,
  generateToken,
};
