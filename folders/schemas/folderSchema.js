const { z } = require("zod");

const folderSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});

module.exports = folderSchema;
