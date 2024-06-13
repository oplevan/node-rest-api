const Folder = require("../../models/folderModel");

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
const fetchFolderById = async (folderId) => {
  try {
    const user = await Folder.findById(folderId);
    return user;
  } catch (error) {
    throw new Error("Error fetching user");
  }
};

module.exports = {
  getAll: async (req, res) => {
    try {
      const folders = await Folder.find();
      return res.status(200).json({
        status: true,
        folders,
      });
    } catch (error) {
      return handleError(res, error, "Error fetching folder");
    }
  },
  create: async (req, res) => {
    const { name } = req.body;

    try {
      const folder = new Folder({ name });
      const result = await folder.save();

      // Respond with success message
      res.status(201).json({
        message: "Folder created Successfully!",
        newFolder: result,
      });
    } catch (error) {
      console.error("Error during registration:", error); // Add detailed logging
      res.status(500).json({
        message: "Error creating folder",
        error: error.message,
      });
    }
  },
  delete: async (req, res) => {
    const { folderId } = req.params;

    try {
      const folder = await Folder.findByIdAndDelete(folderId);

      if (!folder) {
        return res.status(404).json({
          status: false,
          message: "Folder not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Folder deleted successfully",
      });
    } catch (error) {
      return handleError(res, error, "Error deleting folder");
    }
  },
  getFolderById: async (req, res) => {
    const { folderId } = req.params;
    const folder = await fetchFolderById(folderId);

    if (!folder) {
      return res.status(404).json({
        status: false,
        message: "Folder not found",
      });
    }

    return res.status(200).json({
      status: true,
      data: folder,
    });
  },
  addDestination: async (req, res) => {
    try {
      const { folderId } = req.params;

      const folder = await fetchFolderById(folderId);

      if (!folder) {
        return res.status(404).json({
          status: false,
          message: "Folder not found",
        });
      }

      folder.destinations.push(req.body);
      await folder.save();

      return res.status(200).json({
        status: true,
        message: "Destination added successfully",
        data: folder.destinations,
      });
    } catch (error) {
      return handleError(res, error, "Error adding destination to folder");
    }
  },
  deleteDestination: async (req, res) => {
    try {
      const { folderId, destinationId } = req.params;

      let folder = await fetchFolderById(folderId);

      if (!folder) {
        return res.status(404).json({
          status: false,
          message: "Folder not found",
        });
      }

      folder.destinations = folder.destinations.filter(
        (destination) => destination.id !== destinationId
      );
      await folder.save();

      return res.status(200).json({
        status: true,
        message: "Destination deleted successfully",
        data: folder.destinations,
      });
    } catch (error) {
      console.log(error);
      // return handleError(res, error, "Error deleting destination");
    }
  },
  upvoteDestination: async (req, res) => {
    try {
      const { folderId } = req.params;
      const { destinationId } = req.body;

      let folder = await fetchFolderById(folderId);

      if (!folder) {
        return res.status(404).json({
          status: false,
          message: "Folder not found",
        });
      }

      folder.destinations = folder.destinations.map((destination) =>
        destination.id === destinationId
          ? { ...destination, votes: destination.votes + 1 }
          : destination
      );

      await folder.save();

      return res.status(200).json({
        status: true,
        message: "Destination upvoted successfully",
        data: folder,
      });
    } catch (error) {
      return handleError(res, error, "Error upvoting destination");
    }
  },
};
