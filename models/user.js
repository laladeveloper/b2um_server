import mongoose from "mongoose";
import  validator from "validator";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, "Please enter your name"],
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
});

// // plugin for passport-local-mongoose
userSchema.plugin(passportLocalMongoose);
// Plugin for passport-local-mongoose
// userSchema.plugin(passportLocalMongoose, {
//   usernameField: "email", // Use email as the username field for authentication
// });

// Method to verify password
userSchema.methods.verifyPassword = function (password) {
  return this.authenticate(password); // Use passport-local-mongoose's built-in authenticate method
};

const User = mongoose.model("User", userSchema);
export default User;
