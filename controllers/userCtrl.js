import expressAsyncHandler from "express-async-handler";
import User from "../models/user.js";
import { sendToken } from "../utils/jwt.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const allUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      success: true,
      message: `There are following users`,
      users,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: `there is following error`,
      error,
    });
  }
};

export const createUser = async (req, res) => {
  const { fname, lname, email, username, password } = req.body;
  console.log(fname, lname, email, username, password);
  let user = await User.findOne({
    $or: [
      { username },
      { email }, // Check if the input matches the 'email' field as well
    ],
  }).select("-password");
  if (!user) {
    try {
      const saltRounds = 7; // Controls how computationally expensive hashing is
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = new User({fname,lname, email, username, password: hashedPassword });
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
    console.log("user exist in db" + user);
    res.status(200).json({
      success: false,
      message: `User already exist `,
    });
  }
};

export const getMe = expressAsyncHandler(async (req, res) => {
  const me = req.user;
  if (me) {
    res.status(200).json({
      success: true,
      message: `Welcome back ${me.username}`,
      me,
    });
  } else {
    res.status(200).json({
      success: false,
      message: `user not found`,
    });
  }
});

export const getById = expressAsyncHandler(async (req, res) => {
  const userId = "663540c7754e76fe79df2b69";
  const user = await User.findById(userId);
  const token = await user.getJwtToken();

  res.status(200).json({
    success: true,
    message: `Welcome ${user.username} `,
    user,
    token,
  });
});


export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [
        { username },
        { email: username }, // Check if the input matches the 'email' field as well
      ],
    });
    // const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `Invalid email or password`,
      });
    }
    console.log("found user" + user);
    // Compare password with hashed password
    console.log(`Compare password with hashed password`);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log("check password" + isPasswordValid);
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
