const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// import model
const User = require("../models/userModel");

module.exports = {
  register: (req, res) => {
    const { email, password } = req.body;

    bcrypt
      .hash(password, 10)
      .then((hashedPassword) => {
        const user = new User({
          email,
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
  },
  login: (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email })
      .then((user) => {
        bcrypt
          .compare(password, user.password)
          .then((result) => {
            if (result === false) {
              res.status(400).json({
                message: "Incorrect Password",
                error,
              });
            }

            const token = jwt.sign(
              {
                userId: user._id,
                userEmail: user.email,
              },
              "JWT-TOKEN",
              { expiresIn: "24h" }
            );

            res.status(200).json({
              message: "Login Successful",
              email: user.email,
              token,
            });
          })
          .catch((error) => {
            res.status(400).json({
              message: "Incorrect Password",
              error,
            });
          });
      })
      .catch((error) => {
        res.status(404).json({
          message: "User not found",
          error,
        });
      });
  },
  logout: (req, res) => {},
};
