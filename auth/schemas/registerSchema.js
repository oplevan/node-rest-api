const { z } = require("zod");

const registerSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email format" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .min(1, { message: "Password is required" }),
});

module.exports = registerSchema;
