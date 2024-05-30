const router = require("express").Router();

// controllers
const user = require("./controllers/userController");

// middlewares
const isAuthenticated = require("../middlewares/isAuthenticated");
const validateSchema = require("../middlewares/validateSchema");

router.get("/", (req, res) => {
  res.send({ status: "Fetch all users" });
});

router.patch("/:userId", isAuthenticated, user.update);

module.exports = router;
