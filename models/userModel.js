const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: [true, "Email already in use."],
  },
  password: { type: String, required: [true, "Password is required."], unique: false },
  phone: { type: String },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String },
  otp: {
    hash: { type: String },
    expiry: { type: Date },
    isVerified: { type: Boolean },
  },
});

module.exports = mongoose.model.Users || mongoose.model("users", UserSchema);
