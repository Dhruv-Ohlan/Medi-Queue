const twilio = require('twilio');
const env = require('../config/env');
const Token = require('../models/Token');

// Initialize Twilio client only if credentials are provided
let client;
if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
  client = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
}

/**
 * Helper to send SMS via Twilio
 * @param {string} to - Phone number in E.164 format
 * @param {string} body - SMS content
 * @returns {Promise<boolean>} - Success status
 */
const _sendSms = async (to, body, type) => {
  // 1. Check if SMS is enabled
  if (!env.ENABLE_SMS) {
    console.log(`[SMS DISABLED] To: ${to} | Type: ${type} | Body: ${body}`);
    return true;
  }


  // 2. Validate client
  if (!client || !env.TWILIO_PHONE_NUMBER) {
    console.error(`[SMS ERROR] Twilio client not initialized. Missing SID/Token/Phone.`);
    return false;
  }

  try {
    // 3. Send SMS
    const message = await client.messages.create({
      body,
      from: env.TWILIO_PHONE_NUMBER,
      to,
    });
    console.log(`[SMS SENT] SID: ${message.sid} | Type: ${type}`);
    return true;
  } catch (error) {
    console.error(`[SMS FAILED] Type: ${type} | Error: ${error.message}`);
    return false;
  }
};

/**
 * Registration Confirmation SMS
 */
const sendRegistrationSms = async (token, patient, departmentName, etaMinutes) => {
  if (token.notifiedRegistration) return;

  const trackingLink = `${env.FRONTEND_URL}/track/${token.trackingId}`;

  const body = `MediQueue: Registered!
Token: ${token.tokenNumber}
Dept: ${departmentName}
ETA: ~${etaMinutes} mins.
Track Live: ${trackingLink}`;

  const success = await _sendSms(patient.phoneNumber, body, 'REGISTRATION');
  if (success) {
    await Token.findByIdAndUpdate(token._id, { notifiedRegistration: true });
  }
};

/**
 * Almost-Up SMS (Position ~5)
 */
const sendAlmostUpSms = async (token, patient) => {
  if (token.notifiedAlmostUp) return;

  const body = `MediQueue: You are almost up! 
You are approximately 5 positions away in the queue. 
Please return to the ${token.departmentId?.name || 'department'} waiting area.`;

  const success = await _sendSms(patient.phoneNumber, body, 'ALMOST_UP');
  if (success) {
    await Token.findByIdAndUpdate(token._id, { notifiedAlmostUp: true });
  }
};

/**
 * Token Called SMS
 */
const sendTokenCalledSms = async (token, patient) => {
  if (token.notifiedCalled) return;

  const body = `MediQueue: IT IS YOUR TURN!
Token ${token.tokenNumber}, please proceed to the doctor's cabin now.`;

  const success = await _sendSms(patient.phoneNumber, body, 'TOKEN_CALLED');
  if (success) {
    await Token.findByIdAndUpdate(token._id, { notifiedCalled: true });
  }
};

module.exports = {
  sendRegistrationSms,
  sendAlmostUpSms,
  sendTokenCalledSms,
};
