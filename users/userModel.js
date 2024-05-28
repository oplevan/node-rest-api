const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: [true, "Email already in use."],
  },
  password: {
    type: String,
    required: [true, "Provide a password."],
    unique: false,
  },
});

module.exports = mongoose.model.Users || mongoose.model("users", UserSchema);
