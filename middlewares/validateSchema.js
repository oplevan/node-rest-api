/**
 * Generic schema validation middleware
 * @param {ZodSchema} schema - The Zod schema to validate against
 * @param {string} [target='body'] - The target to validate (default is 'body')
 * @returns Middleware function to validate the schema
 */
const validateSchema = (schema, target = "body") => {
  return (req, res, next) => {
    try {
      schema.parse(req[target]);
      next();
    } catch (error) {
      return res.status(400).json({
        status: false,
        error: error.errors || "Invalid request data",
      });
    }
  };
};

module.exports = validateSchema;
