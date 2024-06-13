// external imports
const express = require("express");
const router = express.Router();

// controllers
const folderController = require("./controllers/folderController");

// schemas
const folderSchema = require("./schemas/folderSchema");

// middlewares
const validateSchema = require("../middlewares/validateSchema");

// routes
router.get("/", folderController.getAll);
router.post("/create", [validateSchema(folderSchema)], folderController.create);
router.get("/:folderId", folderController.getFolderById);
router.delete("/delete/:folderId", folderController.delete);
router.patch("/:folderId/add-destination", folderController.addDestination);
router.patch("/:folderId/delete-destination/:destinationId", folderController.deleteDestination);
router.patch("/:folderId/upvote-destination", folderController.upvoteDestination);

module.exports = router;
