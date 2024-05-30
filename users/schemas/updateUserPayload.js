const { z } = require("zod");

const updateUserPayload = z.object({
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .optional(),
  address: z
    .object({
      country: z.string().optional(),
      line1: z.string().optional(),
      line2: z.string().optional(),
      city: z.string().optional(),
      zip: z.string().optional(),
    })
    .optional(),
});

module.exports = updateUserPayload;
