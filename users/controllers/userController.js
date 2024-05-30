const bcrypt = require("bcrypt");

// models
const User = require("../../models/userModel");

module.exports = {
  update: async (req, res) => {
    const {
      user: { userId },
      body: payload,
    } = req;

    // IF the payload does not have any keys,
    // THEN return an error, as nothing can be updated
    if (!Object.keys(payload).length) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Body is empty, there's nothing to update.",
        },
      });
    }

    // Check if the password is being updated and hash it if present
    if (payload.password) {
      try {
        payload.password = await bcrypt.hash(payload.password, 10);
      } catch (err) {
        return res.status(500).json({
          status: false,
          error: {
            message: "Error hashing password",
            details: err,
          },
        });
      }
    }

    // Update the user document in the database
    try {
      await User.findOneAndUpdate({ _id: userId }, payload);
      const updatedUser = await User.findOne({ _id: userId });

      return res.status(200).json({
        status: true,
        data: updatedUser.toJSON(),
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        error: err,
      });
    }
  },
  delete: (req, res) => {
    console.log("test");
  },
};
