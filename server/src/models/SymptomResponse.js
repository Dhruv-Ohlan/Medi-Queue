const mongoose = require("mongoose");

const symptomResponseSchema = new mongoose.Schema({
  tokenId: { type: mongoose.Schema.Types.ObjectId, ref: "Token", required: true },
  responses: { type: Object, required: true },
  rawAiOutput: { type: Object },
}, { timestamps: true });

module.exports = mongoose.model("SymptomResponse", symptomResponseSchema);
