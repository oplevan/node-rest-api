// TODO
// 1. fetch all users (admin only)

const router = require("express").Router();

// controllers
const user = require("./controllers/userController");

// middlewares
const isAuthenticated = require("../middlewares/isAuthenticated");
const validateSchema = require("../middlewares/validateSchema");

// schemas
const updateUserPayload = require("./schemas/updateUserPayload");

router.get("/:userId", [isAuthenticated], user.getById); // fetch user with given ID

router.patch("/:userId", [isAuthenticated, validateSchema(updateUserPayload)], user.update); // update user with given ID

router.delete("/:userId", [isAuthenticated], user.delete); // delete user with given ID

module.exports = router;
