/**
 * Isolation Test for Triage Service
 * Run with: node src/scratch/testTriage.js
 */
const { runTriage, getLocalFallback } = require("../services/triage.service");

const testCases = [
  {
    name: "Scenario 1: AI Path Verification (Emergency)",
    data: {
      age: 45,
      symptoms: "Severe chest pain and sweating",
      painLevel: 9,
      fever: 37,
      duration: "30 mins",
      conditions: "Hypertension"
    }
  },
  {
    name: "Scenario 2: AI Path Verification (Priority - Child)",
    data: {
      age: 4,
      symptoms: "High fever and persistent crying",
      painLevel: 5,
      fever: 40,
      duration: "1 day",
      conditions: "None"
    }
  },
  {
    name: "Scenario 3: AI Path Verification (Routine - Joint Pain)",
    data: {
      age: 30,
      symptoms: "Chronic knee pain when walking",
      painLevel: 4,
      fever: 36.5,
      duration: "2 weeks",
      conditions: "None"
    }
  }
];

async function runTests() {
  console.log("--- STARTING LIVE TRIAGE SERVICE TESTS ---\n");

  for (const test of testCases) {
    console.log(`Testing: ${test.name}`);
    console.log(`Input: ${JSON.stringify(test.data)}`);

    try {
      const result = await runTriage(test.data);
      console.log(`Live AI Result: ${JSON.stringify(result, null, 2)}`);
    } catch (err) {
      console.error(`Unexpected failure: ${err.message}`);
    }

    console.log("------------------------------------\n");
  }
}

runTests();
