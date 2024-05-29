const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: [true, "Email already in use."],
  },
  password: { type: String, required: [true, "Password is required."], unique: false },
  address: {
    country: { type: String, default: "" },
    line1: { type: String, default: "" },
    line2: { type: String, default: "" },
    city: { type: String, default: "" },
    zip: { type: String, default: "" },
  },
});

module.exports = mongoose.model.Users || mongoose.model("users", UserSchema);
