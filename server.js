//jshint esversion:6
// require("dotenv").config();
import express from "express";
// const bodyParser = require("body-parser");
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
// app.use(cors());
const whitelist = ["http://localhost:5173", "https://b2um.vercel.app"];

// Configure CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the whitelist
    if (whitelist.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      callback(new Error("Not allowed by CORS")); // Reject the request
    }
  },
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true,}));
app.use(
  session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false,
    cookie:{
        httpOnly:false,
        secure:true,
        maxAge:1000*60*60*24
    }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// mongoose.connect("mongodb://localhost:27017/b2umserver").then((c)=> console.log(`Server is connected to DB ${c.connection.host}`));
mongoose
  .connect(`${process.env.MONGODB_URL}`)
  .then((c) => console.log(`Server is connected to DB ${c.connection.host}`));

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
    required:[true, `Please enter your username`]
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: [true, "Email already exists"],
    // validate: [validator.isEmail, "Please enter a valid email"],
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

userSchema.plugin(passportLocalMongoose);
// userSchema.plugin(findOrCreate);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser( async function (id, done) {
  const user = await User.findById(id)
   try {
    if (user) {
        done(null,user)
    } else {
        done(null,false)
    }
   } catch (error) {
    done(error, false);
   }
    // done(err, user);

});


app.get("/", function (req, res) {
  res.send(`server is working `)
});





app.get("/user/myinfo", function (req, res) {
  if (req.user) {
    // User is authenticated, send their info
    res.status(200).json({
      success: true,
      message: `Hey ${req.user.username} you are successfully fetched from session `,
      user: req.user,
    });
  } else {
    // User is not authenticated, return 401
    res.status(401).json({
      success: false,
      message: "Unauthorized access. Please login to view your information.",
    });
  }
});


app.get("/logout", function (req, res,next) {
  req.logout(req.user , function (err) {
    if (err) {
      return next(err);
    }
    const userName = req.user?.username || "there" ;
    res.status(200).json({
      success: true,
      message: `Hey ${userName}  you are logged out `,
    });
  });
});

app.post("/user/new", function (req, res) {
  const { fname, lname, email, username, gender, password } = req.body;
    console.log(username, fname, lname, email);
    console.log(password);
  User.register(
    { username,fname,lname, email, gender,   },
   password,
    function (err, user) {
      if (err) {
        console.log(err);
        // res.redirect("/register");
        res.status(400).json({
          success: false,
          message: `Hey there ${err.message} `,
          error: err,
        });
      } else {
        passport.authenticate("local")(req, res, function () {
          // res.redirect("/secrets");
          res.status(200).json({
            success: true,
            message: `Hey ${user.username} you are registered `,
            user
          });
        });
      }
    }
  );
});

app.post("/user/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  req.login(user, function (err) {
   
    if (err) {
      // Handle authentication failure (invalid credentials)
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    
    } else {
      passport.authenticate("local")(req, res, function () {
        req.session.userId = req.user.id;
       res.status(200).json({
         success: true,
         message: `Hey ${user.username} you are logged in `,
         user
       });
      });
    }
  });
});

app.post("/login", function (req, res) {
  if (!req.body.username) {
    res.json({ success: false, message: "Username was not given" });
  } else if (!req.body.password) {
    res.json({ success: false, message: "Password was not given" });
  } else {
    passport.authenticate("local", function (err, user, info) {
      if (err) {
        console.log(err);
        res.json({ success: false, message: `there is err`,err });
      } else {
        if (!user) {
          res.json({
            success: false,
            message: "username or password incorrect",
          });
        } else {
          const token = jwt.sign(
            { userId: user._id, username: user.username },
            secretkey,
            { expiresIn: "24d" }
          );
          res.json({
            success: true,
            message: `Welcome ${user.username} Authentication successful`,
            token: token,
          });
        }
      }
    })(req, res);
  }
});
const port = 4000;
app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
