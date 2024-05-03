import { config } from "dotenv";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
  },
  lname: {
    type: String,
  },
  username: {
    type: String,
    minLength: [4, "Username should greater than 4 characters"],
    unique: [true, "Username already exists"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: [true, "Email already exists"],
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    minLength: [8, "Password should be greater than 8 characters"],
  },
  role: {
    type: String,
    default: "user",
  },
  gender: {
    type: String,
  },
  dob:{
    type:Date
  },
  
});

// JWT TOKEN
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, "process.env.JWT_SECRET", {
    expiresIn: process.env.JWT_EXPIRE+ 30 * 24 * 60 * 60 * 1000,
  });
};
console.log(`secret in user model`);
console.log( + 30 * 24 * 60 * 60 * 1000);
const User = mongoose.model("User", userSchema);
export default User;
