const validateSchema = (schema) => {
  if (!schema) {
    throw new Error("Schema not provided");
  }
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };
};

module.exports = validateSchema;
