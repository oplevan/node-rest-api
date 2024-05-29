const { ZodError } = require("zod");

const validateSchema = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: error.errors.map((e) => e.message).join(", ") });
      }
      next(error);
    }
  };
};

module.exports = validateSchema;
