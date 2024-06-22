const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// generate 4-digit OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const sendOTP = async (email, otp) => {
  await transporter.sendMail({
    to: email,
    subject: "Password Reset",
    html: `<p> 
							Hi Oleg,
							<br/><br/>
							Just one more step before you get started.
							<br/><br/>
							If you could please confirm your identity using the one-time pass code: <strong>${otp}</strong>
							<br/><br/>
							Please note that this code will expire in 10 minutes. 
							<br/><br/>
							If you did not request a password reset, please ignore this email.
					</p>`,
  });
};

const verifyOTP = async (otpHash, userOtp) => {
  return await bcrypt.compare(otpHash.toString(), userOtp);
};

const isOtpExpired = (otpExpirationTime) => {
  const currentTime = Date.now();
  return currentTime > otpExpirationTime;
};

module.exports = {
  generateOTP,
  sendOTP,
  verifyOTP,
  isOtpExpired,
};
