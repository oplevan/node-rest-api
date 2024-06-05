// external imports
const express = require("express");
const router = express.Router();

// controllers
const authController = require("./controllers/authController");

// schemas
const registerSchema = require("./schemas/registerSchema");
const loginSchema = require("./schemas/loginSchema");

// middlewares
const validateSchema = require("../middlewares/validateSchema");

// routes
router.post("/register", [validateSchema(registerSchema)], authController.register);
router.post("/login", [validateSchema(loginSchema)], authController.login);
router.get("/verify-email", authController.verifyEmail);

module.exports = router;
