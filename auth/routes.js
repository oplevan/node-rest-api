const router = require("express").Router();
const auth = require("./authController");

// schemas
const registerSchema = require("./schemas/registerSchema");
const loginSchema = require("./schemas/loginSchema");

// middlewares
const validateSchema = require("../middlewares/validateSchema");

// routes
router.post("/register", [validateSchema(registerSchema)], auth.register);
router.post("/login", [validateSchema(loginSchema)], auth.login);

module.exports = router;
