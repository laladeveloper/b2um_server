import expressAsyncHandler from "express-async-handler";
import User from "../models/user.js";
import { sendToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUser = async (req, res) => {
  const { email, username, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) {
    try {
      const saltRounds = 7; // Controls how computationally expensive hashing is
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = new User({ email, username, password: hashedPassword });
      await user.save();
      const token = await user.getJwtToken();

      res.status(200).json({
        success: true,
        message: `Welcome ${user.username} `,
        user,
        token,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        error,
      });
    }
  } else {
    res.status(200).json({
      success: false,
      message: `User already exist`,
    });
  }
};

export const getMe = expressAsyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

export const userInfo = async (req, res) => {
  try {
    console.log(req.headers.cookie);
    // Retrieve the token (with error handling)
    const token = req.headers.cookie ? req.headers.cookie.split("=")[1] : null;
    console.log(token);
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authorization token not found",
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`jwt secret`);
    console.log(process.env.JWT_SECRET);
    // Retrieve the user from the database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return the user information
    res.status(200).json({
      success: true,
      message: `Welcome back ${user.username}`,
      userInfo: user,
    });
  } catch (err) {
    // Handle JWT errors
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(403).json({
        success: false,
        message: "Invalid or expired token",
      });
    } else {
      // Handle other errors
      console.error(err);
      return res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  }
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [
        { username },
        { email: username }, // Check if the input matches the 'email' field as well
      ],
    }).select("-password");
    // const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `Invalid email or password`,
      });
    }
    console.log(user);
    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: `Invalid email or username or password`,
      });
    }
    const token = await user.getJwtToken();

    res.status(200).json({
      success: true,
      message: `Welcome ${user.username} `,
      user,
      token,
    });
  } catch (error) {
    res.status(400).json({
      message: "ther is error",
      error,
    });
  }
};
