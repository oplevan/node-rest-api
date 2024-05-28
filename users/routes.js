const bcrypt = require("bcrypt");
const User = require("./userModel");

const router = require("express").Router();

router.get("/", (req, res) => {
  res.send({ status: "Fetch all users" });
});

router.post("/register", (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
      });
      user
        .save()
        .then((result) => {
          res.status(201).json({
            message: "User Created Successfully!",
            result,
          });
        })
        .catch((error) => {
          res.status(500).json({
            message: "Error creating user",
            error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        message: "Error hashing the password",
        error,
      });
    });
});

router.post("/login", (req, res) => {});

module.exports = router;
