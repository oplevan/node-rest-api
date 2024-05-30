const bcrypt = require("bcrypt");
const User = require("../../models/userModel");

// Helper function to handle errors
const handleError = (res, error, message = "Server Error") => {
  return res.status(500).json({
    status: false,
    error: {
      message,
      details: error.message || error,
    },
  });
};

// Helper function to fetch user by ID
const fetchUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error("Error fetching user");
  }
};

module.exports = {
  getById: async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await fetchUserById(userId);

      if (!user) {
        return res.status(404).json({
          status: false,
          error: {
            message: "User not found",
          },
        });
      }

      return res.status(200).json({
        status: true,
        data: user,
      });
    } catch (error) {
      return handleError(res, error, "Error fetching user");
    }
  },

  update: async (req, res) => {
    const { userId } = req.user;
    const payload = req.body;

    if (!Object.keys(payload).length) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Body is empty, there's nothing to update.",
        },
      });
    }

    if (payload.password) {
      try {
        payload.password = await bcrypt.hash(payload.password, 10);
      } catch (error) {
        return handleError(res, error, "Error hashing password");
      }
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(userId, payload, { new: true });

      if (!updatedUser) {
        return res.status(404).json({
          status: false,
          error: {
            message: "User not found",
          },
        });
      }

      return res.status(200).json({
        status: true,
        data: updatedUser.toJSON(),
      });
    } catch (error) {
      return handleError(res, error, "Error updating user");
    }
  },

  delete: async (req, res) => {
    const { userId } = req.user;

    try {
      const user = await User.findByIdAndDelete(userId);

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      return handleError(res, error, "Error deleting user");
    }
  },
};
