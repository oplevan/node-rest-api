const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const { generateOTP, sendOTP, verifyOTP, isOtpExpired } = require("./otpController");

// models
const User = require("../../models/userModel");

const generateVerificationToken = () => {
  return jwt.sign({}, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
        result: {
          email: result.email,
        },
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

  getOTP: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Provide an email.",
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
      user.otp.hash = await bcrypt.hash(otp.toString(), 10);
      user.otp.expiry = Date.now() + 10 * 60 * 1000;
      user.otp.isVerified = false;
      await user.save();

      // Send OTP to email
      await sendOTP(email, otp);

      res.status(200).json({
        success: true,
        user: user.email,
        message: `OTP sent to ${email}`,
      });
    } catch (error) {
      console.error("Error during forgot password:", error); // Add detailed logging
      res.status(500).json({
        message: "Error getting OTP",
        error: error.message,
      });
    }
  },

  verifyOTP: async (req, res) => {
    const { email, otp } = req.body;

    if (!otp) {
      return res.status(400).json({
        status: false,
        error: {
          message: "OTP not provided",
        },
      });
    }

    if (!email) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Email not provided",
        },
      });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // check if otp is expired
      const isExpired = isOtpExpired(user.otp.expiry);
      if (isExpired) {
        return res.status(400).json({
          message: "OTP is expired",
        });
      }

      // check if OTP is valid
      const isOtpValid = await verifyOTP(otp, user.otp.hash);
      if (!isOtpValid) {
        return res.status(400).json({
          message: "Invalid OTP",
        });
      }

      user.otp.isVerified = true;

      // reset OTP token and expiry time in the db
      user.otp.hash = undefined;
      user.otp.expiry = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        user: user.email,
        message: "OTP verified successfully",
      });
    } catch (error) {
      console.error("Error during OTP verification:", error); // Add detailed logging
      res.status(500).json({
        message: "An error occurred during OTP verification",
        error: error.message,
      });
    }
  },

  resetPassword: async (req, res) => {
    const { email, password, repeatPassword } = req.body;

    if (!email) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Email not provided",
        },
      });
    }

    if (!password || !repeatPassword) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Password and repeat password are required",
        },
      });
    }

    if (password !== repeatPassword) {
      return res.status(400).json({
        status: false,
        error: {
          message: "Passwords do not match",
        },
      });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Check if user has requested a password reset and and verified the OTP
      if (!user.otp || !user.otp.isVerified) {
        return res.status(400).json({
          message: "User either hasn't requested a password reset or verified the OTP",
        });
      }

      // Hash the new password
      const newHashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password in the database
      user.password = newHashedPassword;
      // delete otp from the database
      user.otp = undefined;
      await user.save();

      res.status(200).json({
        success: true,
        user: user.email,
        message: "Password reset successfully",
      });
    } catch (error) {
      console.error("Error during reset password:", error); // Add detailed logging
      res.status(500).json({
        message: "An error occurred during reset password",
        error: error.message,
      });
    }
  },

  logout: (req, res) => {
    // TODO: Implement logout functionality
    res.status(200).json({ message: "Logout successful" });
  },
};
