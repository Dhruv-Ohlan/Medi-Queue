const { z } = require("zod");

// Validator for ID parameters to ensure they are valid MongoDB ObjectIds
const idParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"),
});

module.exports = {
  idParamSchema,
};
