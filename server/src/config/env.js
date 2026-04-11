const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/medi-queue',
  JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d',
  NODE_ENV: process.env.NODE_ENV || 'development',
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  ENABLE_SMS: process.env.ENABLE_SMS === 'true',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
};

module.exports = env;
