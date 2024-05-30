const router = require("express").Router();

// controllers
const user = require("./controllers/userController");

// middlewares
const isAuthenticated = require("../middlewares/isAuthenticated");
const validateSchema = require("../middlewares/validateSchema");

// schemas
const updateUserPayload = require("./schemas/updateUserPayload");

router.get("/", (req, res) => {
  res.send({ status: "Fetch all users" });
});

router.patch("/:userId", [isAuthenticated, validateSchema(updateUserPayload)], user.update);

router.delete("/:userId", [isAuthenticated], user.delete);

module.exports = router;
