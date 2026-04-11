const { GoogleGenerativeAI } = require("@google/generative-ai");
const { URGENCY_LEVELS, DEPARTMENTS } = require("../config/constants");
const env = require("../config/env");
const { z } = require("zod");

// Initialize Gemini (Using Gemini as the key was provided in .env)
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Schema for strict validation
const triageResponseSchema = z.object({
  urgency: z.enum(Object.values(URGENCY_LEVELS)),
  department: z.enum(Object.values(DEPARTMENTS)),
  reasoning: z.string().max(250),
});

/**
 * Local rule-based fallback if AI fails
 */
const getLocalFallback = (data) => {
  let urgency = URGENCY_LEVELS.ROUTINE;
  let department = DEPARTMENTS.GENERAL_MEDICINE;
  let reasoning = "Determined via local safety rules.";

  const symptoms = (data.symptoms || "").toLowerCase();
  const age = parseInt(data.age);
  const painLevel = parseInt(data.painLevel) || 0;
  const fever = parseFloat(data.fever) || 37;

  // 1. Urgency Logic
  if (
    symptoms.includes("chest pain") ||
    symptoms.includes("breathing") ||
    symptoms.includes("unconscious") ||
    symptoms.includes("stroke") ||
    symptoms.includes("trauma") ||
    symptoms.includes("bleeding")
  ) {
    urgency = URGENCY_LEVELS.EMERGENCY;
    reasoning = "Critical symptoms detected (emergency protocols).";
  } else if (fever > 39 || painLevel >= 8 || age < 5 || age > 70) {
    urgency = URGENCY_LEVELS.PRIORITY;
    reasoning = "High-risk factors (vitals/age) detected.";
  }

  // 2. Routing Logic
  if (age < 12) {
    department = DEPARTMENTS.PAEDIATRICS;
  } else if (
    symptoms.includes("bone") ||
    symptoms.includes("joint") ||
    symptoms.includes("fracture") ||
    symptoms.includes("spine") ||
    symptoms.includes("ortho") ||
    symptoms.includes("back pain")
  ) {
    department = DEPARTMENTS.ORTHOPAEDICS;
  }

  return { urgency, department, reasoning };
};

/**
 * AI Triage Service
 */
const runTriage = async (data) => {
  const prompt = `
    You are a medical triage assistant for an Indian public hospital.
    Classify the patient into urgency: routine, priority, or emergency.
    Route to department: General Medicine, Paediatrics, or Orthopaedics.

    Rules:
    - EMERGENCY: chest pain, difficulty breathing, loss of consciousness, suspected stroke, severe trauma.
    - PRIORITY: fever > 39C, severe pain (8+/10), children under 5, elderly over 70.
    - ROUTINE: Everything else.

    Routing:
    - Paediatrics: Any patient under 12 years old.
    - Orthopaedics: Bone, joint, fracture, spine, limb trauma.
    - General Medicine: All others.

    Patient Data:
    - Age: ${data.age}
    - Symptoms: ${data.symptoms}
    - Pain Level: ${data.painLevel}/10
    - Fever: ${data.fever}C
    - Duration: ${data.duration}
    - Conditions: ${data.conditions || "None"}

    Return ONLY a JSON object:
    {
      "urgency": "routine" | "priority" | "emergency",
      "department": "General Medicine" | "Paediatrics" | "Orthopaedics",
      "reasoning": "One short sentence for the doctor."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from potential markdown blocks
    const jsonStr = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(jsonStr);
    
    return triageResponseSchema.parse(parsed);
  } catch (error) {
    console.warn("AI Triage failed, falling back to local rules:", error.message);
    return getLocalFallback(data);
  }
};

module.exports = {
  runTriage,
  getLocalFallback,
};
