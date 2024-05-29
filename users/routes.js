const router = require("express").Router();

router.get("/", (req, res) => {
  res.send({ status: "Fetch all users" });
});

module.exports = router;
