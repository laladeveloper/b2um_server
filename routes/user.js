import express from "express";
import User from "../models/user.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const app = express.Router();

const secretkey = "this is secter";

app.post("/new",async function (req, res) {
  const { fname, lname, email, username, gender, password } = req.body;
 // Check if the email already exists in the database
    const existingEmail = await User.findOne({ email });
    const existingUser = await User.findOne({ username });

    if (existingEmail || existingUser) {
      // If the email already exists, return an error response
      return res.status(400).json({  success: false, message: "Account already registered",  });
    }

  // console.log(fname, email, username, gender, dob);
  User.register(
    new User({ fname, lname, email, username, gender }),
    password,
    function (err, user) {
      if (err) {
        console.log(err);
         res.status(400).json({ success: false, message: `Validation failed`,error: err,});
      } else { passport.authenticate("local")(req, res, function () {
        console.log(user);
        res.status(201).json({ success: true,user, message: `Welcome ${user.fname} from B2UM team`,
        });
      });
      }
    }
  );
});
app.get("/userinfo", function (req, res) {
  console.log(req.user);
  if(req.user){

    res.send(`user found ${req.user}`)
  }
  
  res.send(`user not found`)
});

app.post("/signin", async function (req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    // Verify the password using the user's method
    const isPasswordValid = await user.verifyPassword(password);
    if (!isPasswordValid.user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid  email or  password" });
    }

    // Password is valid, return success response
    return res
      .status(200)
      .json({ success: true, user, message: `Welcome ${user.username} from B2UM` });

  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

// Login route
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/success",
    failureRedirect: "/fail",
  })
);


export default app;
