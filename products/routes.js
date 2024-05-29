const router = require("express").Router();

const isAuthenticated = require("../middlewares/isAuthenticated");

router.get("/", (req, res) => {
  res.send({ status: "Fetch all products" });
});

router.post("/add", isAuthenticated, (req, res) => {
  res.send({ status: "You're authorized. You can add a new product." });
});

module.exports = router;
