const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../../utils/transporter");

const { generateOTP, sendOTP, verifyOTP } = require("./otpController");

// models
const User = require("../../models/userModel");

const generateVerificationToken = () => {
  return jwt.sign({}, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports = {
  register: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Generate verification token
      const verificationToken = generateVerificationToken();

      // Create new user with hashed password and verification token
      const user = new User({
        email,
        password: hashedPassword,
        verificationToken,
      });

      // Save the user to the database
      const result = await user.save();

      // Send verification email
      const verificationUrl = `${process.env.BASE_URL}/auth/verify-email?token=${verificationToken}`;
      await transporter.sendMail({
        to: email,
        subject: "Email Verification",
        html: `<p>Please confirm your email by clicking link below: <br/><br/><a href="${verificationUrl}">Confirm my email</a></p>`,
      });

      // Respond with success message
      res.status(201).json({
        message: "User Created Successfully! Please verify your email.",
        result,
      });
    } catch (error) {
      console.error("Error during registration:", error); // Add detailed logging
      if (error.errorResponse.code === 11000) {
        return res.status(409).json({
          message: "Email already exists",
        });
      } else {
        res.status(500).json({
          message: "Error creating user",
          error: error.message,
        });
      }
    }
  },

  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          message: "Incorrect Password",
        });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          message: "Email not verified",
          email: user.email,
        });
      }

      const token = jwt.sign({ userId: user._id, userEmail: user.email }, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });

      res.status(200).json({
        message: "Login Successful",
        email: user.email,
        token,
      });
    } catch (error) {
      console.error("Error during login:", error); // Add detailed logging
      res.status(500).json({
        message: "An error occurred during login",
        error: error.message,
      });
    }
  },

  verifyEmail: async (req, res) => {
    const { token } = req.query;

    try {
      jwt.verify(token, process.env.JWT_SECRET); // verify the token
      const user = await User.findOne({ verificationToken: token }); // find user in the database by token
      if (!user) {
        return res.status(400).json({ message: "Invalid token" });
      }

      user.isVerified = true;
      user.verificationToken = undefined; // Clear the token once verified
      await user.save();

      // Redirect to the "Email Verified" page
      res.redirect("/email-verified.html");
    } catch (error) {
      console.error("Error during email verification:", error); // Add detailed logging
      res.status(400).json({ message: "Invalid or expired token", error: error.message });
      // TODO: Add a user friendly 'Email verification failed' page
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Body is empty. Provide an email.",
        },
      });
    }

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Generate OTP
      const otp = generateOTP();

      // Store hashed OTP and expiration time in the database
      user.otp.token = await bcrypt.hash(otp.password.toString(), 10);
      user.otp.expires = otp.expires;
      user.otp.isVerified = false;
      await user.save();

      // Send OTP to email
      await sendOTP(email, otp.password);

      res.status(200).json({
        success: true,
        message: `OTP sent to ${email}`,
      });
    } catch (error) {
      console.error("Error during forgot password:", error); // Add detailed logging
      res.status(500).json({
        message: "An error occurred during password reset",
        error: error.message,
      });
    }
  },

  logout: (req, res) => {
    // TODO: Implement logout functionality
    res.status(200).json({ message: "Logout successful" });
  },
};
