import loger from "../Module/loger.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const OTP_EXPIRY_MINUTES = 5;

// Create SMTP Transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail / Brevo login email
    pass: process.env.EMAIL_PASS, // Your Brevo SMTP key
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP ERROR:", error);
  } else {
    console.log("SMTP Server is ready to send messages");
  }
});

// Generate 6-digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* ===============================
   SEND OTP
================================ */
export const sendOTP = async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({
      success: false,
      message: "Username and email are required",
    });
  }

  const otp = generateOTP();
  const createdAt = new Date();

  try {
    // Store OTP (TTL auto deletes after 5 minutes)
    await loger.findOneAndUpdate(
      { email },
      { username, email, otp, createdAt },
      { upsert: true, new: true }
    );

    // Send email
    await transporter.sendMail({
      from: process.env.SENDER_EMAI, // MUST MATCH VERIFIED SENDER
      to: email,
      subject: "Your OTP Code",
      text: `Hello ${username},\n\nYour OTP code is: ${otp}\nIt will expire in ${OTP_EXPIRY_MINUTES} minutes.\n\nThank you!`,
    });

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

/* ===============================
   VERIFY OTP
================================ */
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  try {
    const record = await loger.findOne({ email });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP expired or does not exist",
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const token = jwt.sign({ id: record._id }, process.env.JWT_SECRETE, {
      expiresIn: "1d",
    });
    // Remove OTP after success
    await loger.deleteOne({ email });

    res.json({
      success: true,
      token,
      user: {
        email: record.email,
        name: record.username,
      },
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};
