const { z } = require("zod");

const registerPatientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  age: z.number().int().min(0).max(120),
  gender: z.string().min(1, "Gender is required"),
  phoneNumber: z.string().min(10, "Valid phone number is required"),
  symptoms: z.string().min(5, "Please describe the symptoms"),
  painLevel: z.number().int().min(0).max(10).optional(),
  fever: z.number().optional(),
  duration: z.string().optional(),
  conditions: z.string().optional(),
});

module.exports = {
  registerPatientSchema,
};
